import { getRouteSeo } from "./seo.js";

const seoBlockPattern = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderSeoTags(route, siteUrl) {
  const routeSeo = getRouteSeo(route, siteUrl);

  return `<!-- seo:start -->
    <title>${escapeHtml(routeSeo.title)}</title>
    <meta name="description" content="${escapeHtml(routeSeo.description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(routeSeo.canonicalUrl)}" />
    ${routeSeo.alternates
      .map(
        (alternate) =>
          `<link rel="alternate" hreflang="${escapeHtml(alternate.hrefLang)}" href="${escapeHtml(alternate.href)}" />`
      )
      .join("\n    ")}
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(routeSeo.title)}" />
    <meta property="og:description" content="${escapeHtml(routeSeo.description)}" />
    <meta property="og:url" content="${escapeHtml(routeSeo.canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(routeSeo.imageUrl)}" />
    <meta property="og:locale" content="${escapeHtml(routeSeo.locale)}" />
    <meta name="twitter:card" content="${escapeHtml(routeSeo.twitterCard)}" />
    <meta name="twitter:title" content="${escapeHtml(routeSeo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(routeSeo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(routeSeo.imageUrl)}" />
    <!-- seo:end -->`;
}

export function replaceSeoTags(html, route, siteUrl) {
  return html.replace(seoBlockPattern, renderSeoTags(route, siteUrl));
}

export function replaceHtmlLang(html, route, siteUrl) {
  const routeSeo = getRouteSeo(route, siteUrl);

  return html.replace(
    /<html lang="[^"]*">/,
    `<html lang="${escapeHtml(routeSeo.htmlLang)}">`
  );
}

export function replaceDocumentMetadata(html, route, siteUrl) {
  return replaceHtmlLang(replaceSeoTags(html, route, siteUrl), route, siteUrl);
}
