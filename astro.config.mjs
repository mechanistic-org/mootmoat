import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import compress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

const isProduction = process.env.CF_PAGES === "1";
import expressiveCode, { createInlineSvgUrl } from "astro-expressive-code";
import icon from "astro-icon";

// tabler icons "clipboard-check"
const copySvg = createInlineSvgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>`,
);

// https://astro.build/config
export default defineConfig({
  output: isProduction ? "static" : "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  site: "https://mootmoat.com",
  // Dynamic R2 filename routes must also match without a final slash.
  trailingSlash: "ignore",
  integrations: [
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: ["dracula"],
      styleOverrides: {
        codeBackground: "var(--expressive-code-bg)",
        borderColor: "var(--expressive-code-bg)",
        // borderColor: "var(--color-base-800)",
        borderRadius: "var(--radius-md)",
        uiFontFamily: "inherit",
        codeFontFamily: "var(--font-mono)",
        frames: {
          copyIcon: copySvg,
          editorActiveTabBackground: "var(--expressive-code-bg)",
          editorTabBarBackground: "var(--expressive-code-bg-darker)",
          editorBackground: "var(--expressive-code-bg)",
          terminalBackground: "var(--expressive-code-bg)",
          terminalTitlebarBackground: "var(--expressive-code-bg-darker)",
          frameBoxShadowCssValue: "0",
          tooltipSuccessBackground: "var(--success)",
          tooltipSuccessForeground: "var(--success-foreground)",
        },
      },
      defaultProps: {
        // Disable line numbers by default
        showLineNumbers: false,
        // But enable line numbers for certain languages
        overridesByLang: {
          "js,ts,html,astro": {
            showLineNumbers: true,
          },
        },
      },
    }),
    mdx(),
    icon(),
    sitemap(),
    compress({
      HTML: true,
      JavaScript: true,
      CSS: false,
      Image: false, // astro:assets handles this. Enabling this can dramatically increase build times
      SVG: false, // astro-icon handles this
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [".", "D:/GitHub/mootmoat-assets/R2_MIRROR"],
      },
      watch: {
        ignored: ["**/public/assets/**", "**/public/assets", "**/R2_MIRROR/**"],
      },
    },
    resolve: {
      alias: {
        ...(isProduction ? { "react-dom/server": "react-dom/server.edge" } : {}),
      },
    },
    // stop inlining short scripts to fix issues with ClientRouter
    build: {
      assetsInlineLimit: 0,
    },
  },
});
