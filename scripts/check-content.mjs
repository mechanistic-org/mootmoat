import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const routes = ["/", "/docs/", "/docs/what-is-mootmoat/", "/docs/doctrine/", "/docs/workbook/", "/docs/faq/", "/docs/ontology-gap/"];
const files = await readdir(dist, { recursive: true });
const htmlFiles = files.filter((file) => file.endsWith(".html")).sort();
const expected = [...routes.map((route) => `${route.slice(1)}index.html`), "404.html"].sort();
assert.deepEqual(htmlFiles.map((file) => file.replaceAll("\\", "/")), expected, "Published HTML must match the seven approved pages plus 404");

const pages = new Map();
const attributes = (html, tag, attr) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*?\\s${attr}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "gi"))].map((match) => match[1] ?? match[2] ?? match[3]);
for (const route of routes) {
  const html = await readFile(path.join(dist, `${route.slice(1)}index.html`), "utf8");
  pages.set(route, html);
  assert.match(html, /data-pagefind-body/, `${route}: explicit search body`);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${route}: one page heading`);
  assert.match(html, /id=(?:"main-content"|'main-content'|main-content[\s>])/, `${route}: skip-link target`);
  assert.match(html, /lang=(?:"en"|'en'|en[\s>])/, `${route}: English document`);
  const current = html;
  assert.doesNotMatch(current, /Solstice|Cosmic Themes|cosmicthemes\.com|github\.com\/(?:Boston343|mootmoat)(?:["/\s<])|\/fr\/|hreflang=|OpenClaw|NanoClaw|unfakeable|isomorphicProof/i, `${route}: stale public claims or template routes`);
  assert.ok(attributes(html, "a", "href").includes("https://github.com/mechanistic-org/mootmoat"), `${route}: correct repository authority`);
  assert.ok(html.includes(`https://mootmoat.com${route}`), `${route}: canonical URL`);
}

let linkCount = 0;
for (const [route, html] of pages) {
  for (const href of attributes(html, "a", "href")) {
    const url = new URL(href.replaceAll("&amp;", "&"), `https://mootmoat.com${route}`);
    if (url.origin !== "https://mootmoat.com") continue;
    const targetRoute = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    assert.ok(pages.has(targetRoute), `${route}: unapproved internal link ${href}`);
    if (url.hash) {
      const ids = attributes(pages.get(targetRoute), "[a-z][a-z0-9]*", "id");
      assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `${route}: broken fragment ${href}`);
    }
    linkCount += 1;
  }
}
const sitemapFiles = files.filter((file) => /sitemap-\d+\.xml$/.test(file));
const locations = [];
for (const file of sitemapFiles) {
  const xml = await readFile(path.join(dist, file), "utf8");
  locations.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname));
}
assert.deepEqual(locations.sort(), [...routes].sort(), "Sitemap must contain exactly the approved content pages");
const pagefind = JSON.parse(await readFile(path.join(dist, "pagefind/pagefind-entry.json"), "utf8"));
assert.deepEqual(Object.keys(pagefind.languages), ["en"], "Only English search data");
assert.equal(pagefind.languages.en.page_count, 7, "All seven content pages must be indexed");
const notFound = await readFile(path.join(dist, "404.html"), "utf8");
assert.match(notFound, /noindex/);
assert.match(notFound, /data-pagefind-ignore/);

const sources = await readdir(path.join(root, "src/docs/data/docs"));
assert.deepEqual(sources.filter((file) => file.endsWith(".mdx")).sort(), ["doctrine.mdx", "faq.mdx", "ontology-gap.mdx", "what-is-mootmoat.mdx", "workbook.mdx"]);
for (const file of sources.filter((name) => name.endsWith(".mdx"))) {
  const text = await readFile(path.join(root, "src/docs/data/docs", file), "utf8");
  assert.match(text, /sources:\s*\n\s+- "https:/, `${file}: traceable source metadata`);
  assert.doesNotMatch(text, /\u2014/, `${file}: outbound authorship typography`);
}
const workbook = await readFile(path.join(root, "src/docs/data/docs/workbook.mdx"), "utf8");
assert.equal((workbook.match(/^## \d{2}\./gm) ?? []).length, 12, "All twelve workbook canvases retained");
console.log(JSON.stringify({ status: "pass", contentRoutes: routes.length, sitemapRoutes: locations.length, indexedPages: pagefind.languages.en.page_count, internalLinksAndFragments: linkCount, workbookCanvases: 12 }));
