import tempfile
import unittest
from pathlib import Path

import httpx
from fastapi import FastAPI

from app.frontend import mount_frontend


class FrontendRoutingTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        for name, content in {
            "index.html": "<html>React shell</html>",
            "en/projects/index.html": "<html>Prerendered projects</html>",
            "assets/app-12345678.js": "console.log('app');",
            "sitemap.xml": "<urlset />",
            ".env": "SECRET=hidden",
        }.items():
            target = self.root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)

        self.app = FastAPI()

        @self.app.post("/api/contact")
        def contact():
            return {"ok": True}

        @self.app.get("/health")
        def health():
            return {"ok": True}

        mount_frontend(self.app, self.root)
        self.client = httpx.AsyncClient(
            transport=httpx.ASGITransport(app=self.app), base_url="http://testserver"
        )

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_prerendered_routes_and_spa_fallback(self):
        for path in ("/en/projects", "/en/projects/"):
            response = await self.client.get(path, follow_redirects=False)
            self.assertEqual(response.status_code, 200)
            self.assertIn("Prerendered projects", response.text)
            self.assertEqual(response.headers["cache-control"], "no-cache")
        for path in ("/", "/unknown/frontend/route"):
            self.assertIn("React shell", (await self.client.get(path)).text)

    async def test_api_is_never_handled_by_frontend(self):
        self.assertEqual((await self.client.post("/api/contact")).json(), {"ok": True})
        self.assertEqual((await self.client.get("/api/contact")).status_code, 405)
        self.assertEqual((await self.client.get("/health")).json(), {"ok": True})
        for path in ("/api", "/api/unknown", "/api/unknown.js"):
            response = await self.client.get(path)
            self.assertEqual(response.status_code, 404)
            self.assertEqual(response.json(), {"detail": "Not Found"})

    async def test_static_files_missing_assets_and_traversal(self):
        asset = await self.client.get("/assets/app-12345678.js")
        self.assertEqual(asset.status_code, 200)
        self.assertIn("javascript", asset.headers["content-type"])
        self.assertEqual((await self.client.get("/sitemap.xml")).text, "<urlset />")
        for path in (
            "/assets",
            "/assets/missing",
            "/assets/missing.js",
            "/missing.png",
            "/.env",
            "/%2e%2e/secret.txt",
        ):
            self.assertEqual((await self.client.get(path)).status_code, 404, path)
        self.assertEqual((await self.client.head("/en/projects")).status_code, 200)
        self.assertEqual((await self.client.post("/en/projects")).status_code, 405)

    async def test_api_only_development_without_build(self):
        app = FastAPI()
        mount_frontend(app, self.root / "no-build")
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://testserver"
        ) as client:
            self.assertEqual((await client.get("/")).status_code, 404)
