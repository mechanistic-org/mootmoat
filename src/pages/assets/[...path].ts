import type { APIRoute } from "astro";

export const prerender = false;

// R2 Logic configuration
// [VIRTUAL BRIDGE]: Point directly to external drive to avoid Watcher/Vite memory leaks
const R2_STAGING_ROOT =
  import.meta.env.PROD || process.env.NODE_ENV === "production"
    ? "" // Prod (Worker) uses root relative to binding
    : "D:/GitHub/mootmoat-assets/R2_MIRROR"; // Local Dev Code

const DEBUG_MODE = true;

// Singleton cache for Node APIs to prevent blocking the event loop on 50+ concurrent image loads
let devFs: any = null;
let devPath: any = null;
let devMime: any = null;

export const GET: APIRoute = async ({ params, locals }) => {
  const assetPath = params.path;

  if (!assetPath) {
    return new Response("Not Found", { status: 404 });
  }

  // 1. PRODUCTION STRATEGY (Cloudflare Proxy)
  if (import.meta.env.PROD) {
    // @ts-ignore
    const R2 = locals?.runtime?.env?.MOOTMOAT_ASSETS;

    if (!R2) {
      console.error("[R2 Proxy] Critical: 'MOOTMOAT_ASSETS' binding missing in Prod!");
      return new Response("Configuration Error: Missing R2 Binding", { status: 500 });
    }

    try {
      const object = await R2.get(assetPath);

      if (!object) {
        return new Response(`Not Found: ${assetPath}`, { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    } catch (e) {
      console.error(`[R2 Proxy] Error fetching ${assetPath}:`, e);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // 2. FALLBACK STRATEGY (Local Disk)
  if (import.meta.env.DEV) {
    try {
      if (!devFs) devFs = await import("node:fs");
      if (!devPath) devPath = await import("node:path");
      if (!devMime) devMime = await import("mime-types");

      const fs = devFs.default || devFs;
      const path = devPath.default || devPath;
      const mime = devMime.default || devMime;

      let decodedPath = decodeURIComponent(assetPath);
      const checkPath = decodedPath.replace(/\\/g, "/");

      if (checkPath.startsWith("r2/")) {
        decodedPath = checkPath.substring(3);
      } else if (checkPath.startsWith("/r2/")) {
        decodedPath = checkPath.substring(4);
      }

      const stagingRoot = path.resolve("D:/GitHub/mootmoat-assets/R2_MIRROR");
      const filePath = path.join(stagingRoot, decodedPath);

      if (!fs.existsSync(filePath)) {
        console.warn(`[Asset Proxy] 404 - File Not Found at: ${filePath}`);
        return new Response(`Not Found Local: ${filePath}`, { status: 404 });
      }

      const contentType = mime.lookup(filePath) || "application/octet-stream";
      const stream = fs.createReadStream(filePath);

      // @ts-ignore
      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache",
        },
      });
    } catch (e) {
      console.error(`[Local Proxy] Error serving ${assetPath}:`, e);
      return new Response(`Internal Server Error: ${e}`, { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
};
