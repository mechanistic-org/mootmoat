import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sharp from "sharp";

// Bounded local presentation checks, not Worker/R2 or production acceptance.
const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const output = process.env.DESIGN_OUTPUT || path.join(os.tmpdir(), "mootmoat-10-design");
await mkdir(output, { recursive: true });
const routes = ["/", "/docs/", "/docs/what-is-mootmoat/", "/docs/doctrine/", "/docs/workbook/", "/docs/faq/", "/docs/ontology-gap/", "/404.html"];
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webmanifest": "application/manifest+json", ".wasm": "application/wasm", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  // The staged release image is deliberately served locally, never uploaded here.
  const file = pathname === "/assets/mootmoat_v18.png"
    ? path.join(root, "docs/release-assets/mootmoat_v18.png")
    : path.resolve(dist, `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`);
  if (!file.startsWith(dist + path.sep) && file !== path.join(root, "docs/release-assets/mootmoat_v18.png")) { res.writeHead(403).end(); return; }
  try { const bytes = await readFile(file); res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" }).end(bytes); }
  catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const installedChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
let browser;
let page;
const errors = [];
const report = { status: "pass", scope: "local built presentation; staged image served locally", viewports: [], interactions: [] };
try {
  browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || (existsSync(installedChrome) ? installedChrome : undefined) });
  page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${new URL(response.url()).pathname}`); });
  for (const width of [1440, 390, 320]) {
    await page.setViewport({ width, height: width === 1440 ? 1000 : 844, deviceScaleFactor: 1 });
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => {
        const heading = document.querySelector("h1");
        const header = document.querySelector(".site-header");
        const css = getComputedStyle(document.documentElement);
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          heading: heading?.textContent,
          headings: document.querySelectorAll("h1").length,
          font: getComputedStyle(heading).fontFamily,
          loaded: document.fonts.check('500 16px "JetBrains Mono Variable"'),
          background: css.backgroundColor,
          headerBlur: getComputedStyle(header).backdropFilter,
          appTitle: document.querySelector('meta[name="apple-mobile-web-app-title"]')?.content,
          returnLinks: document.querySelectorAll('footer a[href="https://eriknorris.com/"]').length,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          image: document.querySelector('meta[property="og:image"]')?.content,
          radius: getComputedStyle(document.querySelector("button")).borderRadius,
        };
      });
      assert.equal(state.overflow, false, `${route} at ${width}: horizontal overflow`);
      assert.equal(state.headings, 1);
      assert.match(state.font, /JetBrains Mono/);
      assert.equal(state.loaded, true, `${route}: font loaded`);
      assert.equal(state.background, "rgb(0, 0, 0)");
      assert.equal(state.headerBlur, "none");
      assert.equal(state.appTitle, "MootMoat");
      assert.equal(state.returnLinks, 1);
      assert.equal(state.radius, "0px");
      assert.match(state.canonical, /^https:\/\/mootmoat\.com\//);
      assert.equal(state.image, "https://mootmoat.com/assets/mootmoat_v18.png");
      const filename = `${route === "/" ? "home" : route.replaceAll("/", "-").replace(/^-|-$/g, "")}-${width}.png`;
      await page.screenshot({ path: path.join(output, filename), fullPage: false });
      report.viewports.push({ route, width, ...state, screenshot: filename });
    }
  }
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(base + "/docs/", { waitUntil: "networkidle0" });
  await page.click('button[aria-label="Toggle Menu"]');
  await page.waitForSelector('dialog[open][aria-label="Documentation menu"]');
  await page.screenshot({ path: path.join(output, "mobile-menu.png") });
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Toggle Menu");
  await page.click('button[aria-label="Toggle Menu"]');
  await page.click('dialog[open] a[href="/docs/doctrine/"]');
  await page.waitForFunction(() => location.pathname === "/docs/doctrine/" && !document.querySelector("dialog[open]"));
  await page.waitForNetworkIdle();
  report.interactions.push("mobile menu: Escape restores focus; link navigates and closes");
  await page.click('button[aria-label="Search documentation"]');
  await page.waitForSelector('dialog[open] input');
  await page.type('dialog[open] input', "provenance");
  await page.waitForSelector('.pagefind-ui__result-link');
  const results = await page.$$eval('.pagefind-ui__result-link', (links) => links.map((a) => ({ text: a.textContent, href: a.getAttribute("href") })));
  assert.ok(results.some((r) => r.href.includes("workbook")));
  await page.screenshot({ path: path.join(output, "mobile-search.png") });
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog[open]"));
  report.interactions.push({ search: "provenance", results });
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(base + "/", { waitUntil: "networkidle0" });
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("href")), "#main-content");
  report.interactions.push("keyboard: first Tab reaches the skip link");
  await page.click('.site-header button.theme-toggle');
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains("dark")), false);
  await page.goto(base + "/docs/workbook/", { waitUntil: "networkidle0" });
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains("dark")), false);
  await page.screenshot({ path: path.join(output, "workbook-light.png") });
  await page.click('.site-header button.theme-toggle');
  report.interactions.push("theme: light choice survives navigation; dark can be restored");
  const manifest = JSON.parse(await readFile(path.join(dist, "favicons/site.webmanifest"), "utf8"));
  assert.equal(manifest.name, "MootMoat");
  assert.equal(manifest.theme_color, "#000000");
  for (const icon of manifest.icons) {
    const { width, height } = await sharp(path.join(dist, icon.src)).metadata();
    assert.equal(`${width}x${height}`, icon.sizes);
  }
  const social = await sharp(path.join(root, "docs/release-assets/mootmoat_v18.png")).metadata();
  assert.equal(social.width, 1200); assert.equal(social.height, 630);
  assert.deepEqual(errors, [], "No browser exceptions or failed local resources");
  report.interactions.push("manifest icons and staged 1200x630 social image validated");
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ status: "pass", pageViewportChecks: report.viewports.length, interactions: report.interactions, output }, null, 2));
} catch (error) {
  if (page) {
    await page.screenshot({ path: path.join(output, "failure.png") });
    console.error(JSON.stringify({ errors, url: page.url(), dialogs: await page.$$eval("dialog", (nodes) => nodes.map((n) => ({ open: n.open, label: n.getAttribute("aria-label"), input: !!n.querySelector("input") }))) }));
  }
  throw error;
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
