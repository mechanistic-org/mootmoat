import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sharp from "sharp";

// Live acceptance for #11. No stubs: every request reaches the named production sites.
const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "var/release-11/production");
await mkdir(output, { recursive: true });
const base = "https://mootmoat.com";
const routes = ["/", "/docs/", "/docs/what-is-mootmoat/", "/docs/doctrine/", "/docs/workbook/", "/docs/faq/", "/docs/ontology-gap/"];
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const report = { status: "running", startedAt: new Date().toISOString(), routes: [], missingRoutes: [], viewports: [], interactions: [], crossLinks: [] };
const html = new Map();
async function get(url, status = 200) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, status, `${url}: HTTP status`);
  return response;
}
const attributes = (text, tag, attr) => [...text.matchAll(new RegExp(`<${tag}\\b[^>]*?\\s${attr}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "gi"))].map((m) => m[1] ?? m[2] ?? m[3]);
let browser;
try {
  for (const route of routes) {
    const response = await get(base + route);
    const bytes = Buffer.from(await response.arrayBuffer());
    const built = await readFile(path.join(root, "dist", `${route.slice(1)}index.html`));
    assert.equal(digest(bytes), digest(built), `${route}: live HTML equals accepted production build`);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.match(response.headers.get("cache-control"), /max-age=0/);
    html.set(route, bytes.toString());
    report.routes.push({ route, status: response.status, sha256: digest(bytes), cache: response.headers.get("cache-control") });
  }
  let links = 0;
  for (const [route, text] of html) {
    for (const href of attributes(text, "a", "href")) {
      const url = new URL(href.replaceAll("&amp;", "&"), base + route);
      if (url.origin !== base) continue;
      const target = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
      assert.ok(html.has(target), `${route}: unexpected internal link ${href}`);
      if (url.hash) assert.ok(attributes(html.get(target), "[a-z][a-z0-9]*", "id").includes(decodeURIComponent(url.hash.slice(1))), `${route}: broken fragment ${href}`);
      links++;
    }
  }
  report.internalLinksAndFragments = links;
  const index = await (await get(base + "/sitemap-index.xml")).text();
  const sitemapUrls = [...index.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const locations = [];
  for (const url of sitemapUrls) {
    assert.equal(new URL(url).origin, base);
    const xml = await (await get(url)).text();
    locations.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
  }
  assert.deepEqual(locations.sort(), routes.map((route) => base + route).sort());
  report.sitemap = locations;
  const robots = await (await get(base + "/robots.txt")).text();
  assert.match(robots, /Sitemap: https:\/\/mootmoat\.com\/sitemap-index.xml/);
  assert.doesNotMatch(robots, /Solstice|Cosmic/i);
  const entry = await (await get(base + "/pagefind/pagefind-entry.json")).json();
  assert.deepEqual(Object.keys(entry.languages), ["en"]);
  assert.equal(entry.languages.en.page_count, 7);
  report.pagefind = entry.languages;
  for (const route of ["/v18-check-missing/", "/fr/", "/fr/docs/", "/docs/getting-started/", "/docs/components/", "/llms.txt", "/llms-full.txt", "/agent_profile.json"]) {
    const response = await get(base + route, 404);
    const text = await response.text();
    assert.match(text, /noindex/);
    assert.match(text, /MootMoat/);
    report.missingRoutes.push({ route, status: response.status, noindex: true });
  }
  await get(base + "/assets/v18-check-missing.png", 404);
  const asset = JSON.parse(await readFile(path.join(root, "docs/receipts/issue-10-files.json"), "utf8")).r2_release_asset;
  const imageResponse = await get(base + "/assets/" + asset.key);
  const image = Buffer.from(await imageResponse.arrayBuffer());
  assert.equal(digest(image), asset.sha256);
  assert.equal(imageResponse.headers.get("content-type"), asset.content_type);
  const dimensions = await sharp(image).metadata();
  assert.equal(dimensions.width, asset.width); assert.equal(dimensions.height, asset.height);
  report.r2 = { url: base + "/assets/" + asset.key, sha256: digest(image), bytes: image.length, contentType: imageResponse.headers.get("content-type"), width: dimensions.width, height: dimensions.height, cache: imageResponse.headers.get("cache-control") };
  const manifest = await (await get(base + "/favicons/site.webmanifest")).json();
  assert.equal(manifest.name, "MootMoat"); assert.equal(manifest.theme_color, "#000000");
  for (const icon of manifest.icons) {
    const iconBytes = Buffer.from(await (await get(base + icon.src)).arrayBuffer());
    const { width, height } = await sharp(iconBytes).metadata();
    assert.equal(`${width}x${height}`, icon.sizes);
  }
  report.branding = { manifest: manifest.name, icons: manifest.icons };
  for (const url of ["https://www.mootmoat.com/", "https://eriknorris.com/", "https://www.eriknorris.com/"]) await get(url);
  browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || (existsSync("C:/Program Files/Google/Chrome/Application/chrome.exe") ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : undefined) });
  const page = await browser.newPage();
  const exceptions = [], failedResources = [];
  page.on("pageerror", (error) => exceptions.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400 && new URL(response.url()).origin === base && !response.request().isNavigationRequest()) failedResources.push({url:response.url(),status:response.status()}); });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewport({ width, height: width > 768 ? 1000 : 844, deviceScaleFactor: 1 });
    for (const route of [...routes, "/v18-check-missing/"]) {
      const response = await page.goto(base + route, { waitUntil: "networkidle0" });
      assert.equal(response.status(), route.includes("missing") ? 404 : 200);
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        headings: document.querySelectorAll("h1").length,
        font: getComputedStyle(document.querySelector("h1")).fontFamily,
        loaded: document.fonts.check('500 16px "JetBrains Mono Variable"'),
        appTitle: document.querySelector('meta[name="apple-mobile-web-app-title"]')?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        image: document.querySelector('meta[property="og:image"]')?.content,
        returnLinks: document.querySelectorAll('footer a[href="https://eriknorris.com/"]').length,
      }));
      assert.equal(state.overflow, false, `${route} at ${width}: overflow`);
      assert.equal(state.headings, 1); assert.match(state.font, /JetBrains Mono/); assert.equal(state.loaded, true);
      assert.equal(state.appTitle, "MootMoat"); assert.equal(state.image, report.r2.url); assert.equal(state.returnLinks, 1);
      if (routes.includes(route)) assert.equal(state.canonical, base + route);
      const screenshot = `${route === "/" ? "home" : route.replaceAll("/", "-").replace(/^-|-$/g, "")}-${width}.png`;
      await page.screenshot({ path: path.join(output, screenshot) });
      report.viewports.push({route,width,...state,screenshot});
    }
  }
  await page.setViewport({width:390,height:844});
  await page.goto(base + "/docs/", {waitUntil:"networkidle0"});
  await page.click('button[aria-label="Toggle Menu"]');
  await page.waitForSelector('dialog[open][aria-label="Documentation menu"]');
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog[open]"));
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Toggle Menu");
  await page.click('button[aria-label="Toggle Menu"]');
  await page.click('dialog[open] a[href="/docs/doctrine/"]');
  await page.waitForFunction(() => location.pathname === "/docs/doctrine/" && !document.querySelector("dialog[open]"));
  await page.waitForNetworkIdle();
  report.interactions.push("Mobile menu navigates, closes, and restores focus on Escape");
  await page.click('button[aria-label="Search documentation"]');
  await page.waitForSelector('dialog[open] input');
  await page.type('dialog[open] input', "provenance");
  await page.waitForSelector(".pagefind-ui__result-link");
  const results = await page.$$eval(".pagefind-ui__result-link", (nodes) => nodes.map((a) => ({text:a.textContent,href:a.getAttribute("href")})));
  assert.ok(results.some((r) => r.href.includes("workbook")));
  await page.screenshot({path:path.join(output,"mobile-search.png")});
  await page.click('.pagefind-ui__result-link[href*="workbook"]');
  await page.waitForFunction(() => location.pathname === "/docs/workbook/" && !document.querySelector("dialog[open]"));
  await page.waitForNetworkIdle();
  report.interactions.push({search:"provenance",results,activation:"workbook navigation closes search dialog"});
  const stale = await page.evaluate(async () => { const p = await import("/pagefind/pagefind.js"); const r = await p.search("Solstice"); return r.results.length; });
  assert.equal(stale,0); report.interactions.push("Pagefind API has zero Solstice results");
  await page.goto(base + "/docs/workbook/#01-provenance-chain", {waitUntil:"networkidle0"});
  const anchor = await page.$eval("#01-provenance-chain", (e) => ({top:e.getBoundingClientRect().top, bottom:e.getBoundingClientRect().bottom}));
  assert.ok(anchor.bottom > 0 && anchor.top < 844, "Deep fragment reaches visible heading");
  report.interactions.push({fragment:"#01-provenance-chain",...anchor});
  await page.goto(base + "/",{waitUntil:"networkidle0"});
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("href")),"#main-content");
  await page.click(".site-header button.theme-toggle");
  await page.goto(base + "/docs/workbook/",{waitUntil:"networkidle0"});
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains("dark")),false);
  await page.click(".site-header button.theme-toggle");
  report.interactions.push("Skip link and persisted theme choice pass");
  assert.deepEqual(exceptions,[]); assert.deepEqual(failedResources,[]);
  report.browserErrors = {exceptions,failedResources};
  // Activate the real portfolio control and complete the return journey at both widths.
  for (const width of [1440,390]) {
    await page.setViewport({width,height:900});
    await page.goto("https://eriknorris.com/about/",{waitUntil:"networkidle0"});
    if (width === 1440) {
      const selector = '.cf-node[aria-label^="MootMoat"]';
      await page.waitForSelector(selector);
      await page.focus(selector);
      await Promise.all([page.waitForNavigation({waitUntil:"networkidle0"}), page.keyboard.press("Enter")]);
    } else {
      const selector = '.cf-list a[href="https://mootmoat.com/"]';
      await page.waitForSelector(selector);
      await Promise.all([page.waitForNavigation({waitUntil:"networkidle0"}),page.click(selector)]);
    }
    assert.equal(page.url(),base + "/");
    const outbound = page.url();
    await Promise.all([page.waitForNavigation({waitUntil:"networkidle0"}),page.click('footer a[href="https://eriknorris.com/"]')]);
    assert.equal(page.url(),"https://eriknorris.com/");
    report.crossLinks.push({width,from:"https://eriknorris.com/about/",outbound,returned:page.url()});
  }
  report.status = "pass";
} catch (error) {
  report.status = "fail"; report.error = error.stack;
  throw error;
} finally {
  if (browser) await browser.close();
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output,"report.json"),JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify({status:report.status,routes:report.routes.length,links:report.internalLinksAndFragments,viewports:report.viewports.length,crossLinks:report.crossLinks,error:report.error},null,2));
}
