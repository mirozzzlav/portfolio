import { mkdir, readFile, writeFile } from "node:fs/promises";
import { cache, flush } from "@emotion/css";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { pageRouteDefinitions, redirectRoutes } from "../src/routes.js";
import { getRouteSeo, normalizeSiteUrl, siteSeo } from "../src/seo.js";
import { escapeHtml, replaceSeoTags } from "../src/seoTags.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, "..");
const distDir = path.join(projectRoot, "dist");
const templatePath = path.join(distDir, "index.html");
const serverEntryPath = path.join(distDir, "server", "entry-server.js");
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || siteSeo.siteUrl);

const routes = pageRouteDefinitions.map((route) => route.path);

function routeToFilePath(route) {
  if (route === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, route.slice(1), "index.html");
}

function collectEmotionStyles() {
  const entries = Object.entries(cache.inserted).filter(
    ([, styles]) => typeof styles === "string"
  );

  return {
    cssText: entries.map(([, styles]) => styles).join(""),
    ids: entries.map(([id]) => id)
  };
}

function renderEmotionStyleTag({ cssText, ids }) {
  if (!cssText || ids.length === 0) {
    return "";
  }

  return `<style data-emotion="css ${ids.join(" ")}">${cssText}</style>`;
}

function renderDocument(template, appHtml, emotionStyles, route) {
  return replaceSeoTags(template, route, siteUrl)
    .replace("</head>", `${renderEmotionStyleTag(emotionStyles)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function renderRedirectDocument(target) {
  const canonicalUrl = getRouteSeo(target, siteUrl).canonicalUrl;

  return `<!doctype html>
<html lang="sk">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <script>window.location.replace(${JSON.stringify(target)});</script>
    <title>Presmerovanie</title>
  </head>
  <body>
    <a href="${escapeHtml(target)}">Pokračovať</a>
  </body>
</html>
`;
}

function renderSitemap() {
  const urls = routes
    .map((route) => {
      const routeSeo = getRouteSeo(route, siteUrl);

      return `  <url>
    <loc>${escapeHtml(routeSeo.canonicalUrl)}</loc>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

const template = await readFile(templatePath, "utf8");
const { render } = await import(serverEntryPath);

for (const route of routes) {
  const filePath = routeToFilePath(route);
  flush();
  const appHtml = render(route);
  const emotionStyles = collectEmotionStyles();

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, renderDocument(template, appHtml, emotionStyles, route));
}

for (const redirect of redirectRoutes) {
  const filePath = routeToFilePath(redirect.from);

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, renderRedirectDocument(redirect.to));
}

await writeFile(path.join(distDir, "sitemap.xml"), renderSitemap());
await writeFile(path.join(distDir, "robots.txt"), renderRobots());
