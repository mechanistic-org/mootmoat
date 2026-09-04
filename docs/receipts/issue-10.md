---
title: MootMoat issue 10 - design coherence and cross-link receipt
sources:
  - https://github.com/mechanistic-org/mootmoat/issues/10
  - https://github.com/mechanistic-org/mootmoat/issues/8#issuecomment-5546452747
  - https://github.com/mechanistic-org/mootmoat/issues/9#issuecomment-5547218337
  - https://github.com/mechanistic-org/mootmoat/blob/d2705b5a29cf2c9c71badd6624df4bc8a3594689/docs/receipts/issue-9.md
  - https://github.com/mechanistic-org/portfolio/blob/1a0844bf58e5aa575b3747745f5bb2e8f43c991e/DESIGN.md
  - https://github.com/mechanistic-org/global_agent/blob/main/laws/law_002_design_system.md
---

# Design coherence and bidirectional cross-links

Implements only #10's approved visual and cross-link assignments. The five accepted doctrine MDX files remain byte-identical to #9. No deployment, R2 upload, absorbed-ticket disposition, or #11 implementation occurred.

[The exact file inventory](issue-10-files.json) lists every changed file in both repositories, their starting commits, the unchanged doctrine authority, and the release-image checksum. The portfolio change is exactly one added `href` in `src/config/bio_nodes.ts`.

## Changed surfaces

| Surface | Change | Verification |
| --- | --- | --- |
| All seven approved content routes | Shared black/ash canvas, cyan selection, orange primary action, square controls, opaque header, and locally served JetBrains Mono headings/navigation. Body text retains Geist for long-form reading. | All eight HTML pages, including 404, pass at 1440, 390, and 320 CSS pixels; loaded heading font, no horizontal overflow, opaque header, square controls, and metadata checked. |
| `/` | Existing accepted prose and CTAs receive a restrained hero hierarchy, responsive type, stacked mobile actions, and a small field-guide label. | Desktop/mobile screenshot inspection and viewport checks. |
| `/docs/` | Existing document index receives consistent numbered rows and a contents label. | All five destinations remain in the approved seven-route contract. |
| `/docs/what-is-mootmoat/`, `/docs/doctrine/`, `/docs/workbook/`, `/docs/faq/`, `/docs/ontology-gap/` | Shared documentation shell loses the decorative gradient/blur; sidebar selection, reading measure, heading rhythm, and mobile contents menu follow the same visual system. | Content unchanged; all five routes checked at each width. Workbook tables wrap within mobile width. |
| 404 | Reuses the shared landing shell so the navigation, branding, and return link remain available. Existing message and noindex/search-exclusion behavior retained. | Bounded rendered check plus content-contract noindex/search exclusion. |
| Search, menu, theme control | Shared square geometry, visible focus, minimum mobile control targets, and explicit search-button label. The approved theme control remains available with a readable light variant. | Menu navigation closes the dialog; Escape restores trigger focus; first Tab reaches skip link; search returns current doctrine/workbook results; theme choice persists across navigation. |
| Footer on every page | Adds `Erik Norris / Portfolio` linking directly to `https://eriknorris.com/`. | Exactly one footer return link on each of the eight HTML pages at each checked width. |
| Portfolio `/about/` | The existing MootMoat biography node receives `href: "https://mootmoat.com/"`. Existing SVG keyboard navigation and the mobile native link use that destination. | Built-page browser activation passed at desktop 1440px (Enter) and mobile 390px (anchor click), with the exact destination captured by a local fixture. |
| App/SEO metadata | Solstice app title/manifest replaced with MootMoat; black theme/background metadata, explicit manifest start URL/scope, corrected viewport declaration, new social-image key. | Built metadata checked on every page; manifest icons decoded and size-checked. |
| Logos and favicons | New square M mark propagated to all three legacy logo paths, the source-imported logo, SVG/PNG/ICO favicon, touch icon, and app icons. Decorative logo is hidden from assistive technology. | `build:brand` generates the assets; icon metadata and manual image inspection pass. |
| Obsolete branding payloads | Deletes `public/favicon.zip`, `public/images/cosmic-themes-logo.png`, and `public/images/solstice.jpg`. | Exact inventory and reviewed diff. |
| R2 social image | Prepares the new 1200x630 PNG and points metadata to its versioned `/assets/mootmoat_v18.png` URL. | PNG decoded, inspected, and regenerated with identical bytes on the validation host. Upload remains with #11. |
| Tooling | Pinned JetBrains Mono replaces Geist Mono. `build:brand` and `check:design` use explicit sharp/Puppeteer dev dependencies; the content check no longer exempts stale app-title metadata. | Clean installation, brand generation, build, content contract, local browser checks, and Worker packaging dry-runs. |

## Cross-property authority

- `https://eriknorris.com/about/` links to `https://mootmoat.com/` through the existing MootMoat node. No new portfolio page, copied doctrine, canonical override, or portfolio visual redesign was introduced.
- MootMoat's shared footer links to `https://eriknorris.com/`. Its seven content-page canonicals remain on `https://mootmoat.com/`.
- Both approved destination roots returned HTTP 200 without redirect on 2026-09-04. This is destination availability only; the new links are locally verified and landed, not deployed by this task.
- Existing portfolio biography prose is outside the authorized link-only change. The new link bypasses the old inert-node detail panel; no claim in that existing prose was adopted as MootMoat doctrine.

## Release image for #11

- Source: `docs/brand/social.svg`; build command: `npm run build:brand`.
- Prepared file: `docs/release-assets/mootmoat_v18.png`.
- SHA-256: `39b53aa046fdf390d45aa8d6b5f8ea5de62033f3b1a11a0d01ae79d6340b45f7`.
- Intended bucket/key: `assets-mootmoat-com` / `mootmoat_v18.png`, `Content-Type: image/png`.
- Intended public URL: `https://mootmoat.com/assets/mootmoat_v18.png`.
- #11 must upload these exact bytes before deploying the metadata change, then verify the public image and metadata together. The existing Worker `/assets/*` implementation and R2 binding were not edited. The old object was not deleted or overwritten.
- The local browser fixture serves the staged PNG only for presentation validation. It does not prove an R2 upload or production runtime response. Re-rendering SVG text on another host can depend on its installed fonts; the committed PNG and checksum are the release authority.

## Validation results

| Command / bounded check | Exit | Result |
| --- | ---: | --- |
| MootMoat `npm ci --no-audit --no-fund` | 0 | Clean initial install; final lockfile clean install also verified before landing. |
| `npm run build:brand` | 0 | SVG propagation, PNG/ICO icons, and social PNG generated locally. Repeated generation preserved the social PNG checksum. |
| `npm run build:worker` | 0 | Seven content pages plus 404; Pagefind indexes seven English pages. |
| `npm run check:content` | 0 | Seven routes, seven sitemap entries, seven indexed pages, 236 internal links/fragments, twelve workbook canvases. |
| `npm run check:design` | 0 | 24 page/viewport checks plus navigation, focus, search, theme, icon, and metadata checks; no browser exceptions or failed local resources. |
| `npm run check:worker` | 0 | Packaging dry-run; no deployment. |
| `npx --yes wrangler@4.114.0 deploy --dry-run --config wrangler.production.jsonc` | 0 | Production configuration packaging only; retained R2 and static-asset bindings. |
| Portfolio `npm ci --no-audit --no-fund` | 0 | Isolated locked installation. |
| Portfolio `npm run check:ci` | 0 | Frontmatter audit and Astro check; zero errors, zero warnings, 56 hints. |
| Portfolio `npm run build:worker` | 0 | Full local production build, publication gates, and Pagefind. |
| Portfolio temporary built-page cross-link fixture | 0 | Desktop keyboard and mobile anchor request the exact approved MootMoat root. External destination response is stubbed; root availability is checked separately. |
| Exact public candidates: `validate_outbound_voice.py --json` | 0 | No em-dash violations in new outbound text. |
| Accepted doctrine byte-parity and `git diff --check` | 0 | No changes to accepted MDX; reviewed diff has no whitespace errors. |
| `npm run lint` | 2 | Inherited blocker: ESLint cannot load the undeclared TypeScript peer. Same limitation recorded by #9; no passing lint result is claimed. |

Visual inspection covered the home, doctrine, workbook, light-theme workbook, mobile menu/search, and social image. Search initially ran before the client transition completed; waiting for navigation/network readiness resolved the fixture failure without a search implementation change. All 24 page/viewport checks passed on the final rendered presentation.

## Closeout boundary

The release transaction lands the reviewed pathset on both repositories' `origin/main`, publishes commit and validation evidence, closes only #10 / Done on the Main Board, and reconciles #7 to the next unstarted child. The existing primary checkout files and their pre-existing changes stay untouched. Final deployment, production/mobile/search acceptance, and absorbed-ticket disposition remain with #11. Execution stops after #10 closeout.
