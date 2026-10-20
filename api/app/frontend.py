from pathlib import Path

from fastapi import FastAPI
from starlette.exceptions import HTTPException
from starlette.responses import Response
from starlette.routing import Match, Mount
from starlette.staticfiles import StaticFiles
from starlette.types import Scope


class FrontendMount(Mount):
    def matches(self, scope: Scope) -> tuple[Match, Scope]:
        path = scope.get("path", "")
        if path in {"/api", "/health"} or path.startswith("/api/"):
            return Match.NONE, {}
        return super().matches(scope)


class FrontendFiles(StaticFiles):
    async def get_response(self, path: str, scope: Scope) -> Response:
        parts = Path(path).parts
        if ".." in parts or any(part.startswith(".") for part in parts):
            raise HTTPException(status_code=404)

        try:
            response = await super().get_response(path, scope)
        except HTTPException as exc:
            if exc.status_code != 404 or Path(path).suffix or "assets" in parts[:1]:
                raise
            try:
                response = await super().get_response(f"{path}/index.html", scope)
            except HTTPException as page_exc:
                if page_exc.status_code != 404:
                    raise
                response = await super().get_response("index.html", scope)

        if response.media_type == "text/html":
            response.headers["Cache-Control"] = "no-cache"
        return response


def mount_frontend(app: FastAPI, directory: Path) -> None:
    # The API can also run on its own during local Vite development.
    if directory.is_dir():
        app.router.routes.append(
            FrontendMount("/", app=FrontendFiles(directory=directory), name="frontend")
        )
