---
title: MootMoat issue 9 - doctrine and residue receipt
sources:
  - https://github.com/mechanistic-org/mootmoat/issues/9
  - https://github.com/mechanistic-org/mootmoat/issues/8#issuecomment-5546452747
  - https://github.com/mechanistic-org/mootmoat/commit/5ddbbcc99a605ce2b3eeb13e25f414fe11573f70
  - https://www.hbs.edu/managing-the-future-of-work/research/hidden-workers-untapped-talent
  - https://www.onetonline.org/link/summary/17-2141.00
---

# Doctrine and template-residue implementation

Implements only the #9 assignments in the approved #8 ruling. The seven content routes are `/`, `/docs/`, `/docs/what-is-mootmoat/`, `/docs/doctrine/`, `/docs/workbook/`, `/docs/faq/`, and `/docs/ontology-gap/`.

[The exact file inventory](issue-9-files.json) maps all ten original doctrine sources and all 126 original component files, identifies preserved runtime/branding surfaces, and records the owned pathset. Historical sources remain available at the cited Git revision; obsolete copies are removed from the current content tree.

## Doctrine rulings

| Approved ruling | Result and evidence |
| --- | --- |
| Keep author-controlled DIY evidence production | Home, what-is-mootmoat, doctrine, and workbook describe the author-owned record and the work required to make it reviewable. |
| Keep the not-an-ATS-bypass boundary | Home, what-is-mootmoat, FAQ, and README state the boundary without outcome promises. |
| Rewrite Source Standard | Doctrine separates observation, recollection, inference, and proposal; requires a source and visible limits. Memory initiates investigation rather than proving a claim. |
| Keep/rewrite Depth Signals and workbook | Doctrine explains the method; workbook retains all twelve named techniques and adds source, uncertainty, attribution, and disclosure prompts. |
| Rewrite tri-node structure | Doctrine presents claim, evidence, and project as an optional authoring pattern. No universal ontology or conformance requirement remains. |
| Rewrite restricted-information practice | Doctrine and FAQ distinguish appropriate local custody from disclosure permission, and explicitly avoid security or legal guarantees. |
| Rewrite Round Zero and screening claims | Ontology-gap frames them as a risk model and hypothesis. HBS/Accenture supports filtering concerns; O*NET supplies counterevidence to blanket claims that mechanical engineering is absent from occupational vocabularies. Neither is presented as evidence that MootMoat improves hiring outcomes. |
| Kill Levels 0-5, universal schema, validator, namespace, conformance claims | Legacy source copies removed. Current pages and README describe the implemented method and explicitly disclaim those product capabilities. No endpoints were invented. |
| Kill Reverse Radar as an active capability | Legacy source copies removed. Ontology-gap explicitly states that no employer-specific visibility or active screening telemetry is provided. |
| Kill authenticity and outcome guarantees | Current doctrine emphasizes inspectability and verification limits; workbook rejects precision, repetition, and prose style as authenticity tests. |
| Kill/no-op OpenClaw, NanoClaw, swarm, 30-project slicing | No OpenClaw or NanoClaw matches in baseline `src`/README; none in current published content. No execution model was added. |
| Kill/no-op Project 6, CEO office, outreach residue | No Project 6 matches in baseline `src`/README; old planning material removed, no such public surface retained. |

## Source-document rulings

| Original source | Result |
| --- | --- |
| README | Rewritten for actual routes, files, local commands, runtime, limitations, and release boundary. |
| Executive Briefing | Removed; no standalone replacement. |
| Explanation | Replaced by `src/docs/data/docs/what-is-mootmoat.mdx`. |
| Specification | Replaced by non-normative `doctrine.mdx`. |
| Evidence Workbook | Replaced by `workbook.mdx`, preserving all twelve canvases. |
| FAQ | Replaced by `faq.mdx`, grounded in the retained method and bounded claims. |
| Ontology Gap | Replaced by `ontology-gap.mdx`, with primary-source citations and explicit inference limits. |
| Implementation Study Guide | Removed as a standalone document; Depth Standard material is carried into doctrine/workbook. |
| Strategic Case | Removed. |
| Strategic Roadmap | Removed. |
| NotebookLM prompt stack | Removed. |

Every retained MDX document has nonempty `sources` metadata enforced by the content collection schema. Source links identify the approved ruling and immutable historical source revisions; those revisions are provenance, not the current doctrine.

## Routes and component rulings

| Approved group | Treatment |
| --- | --- |
| Home and docs index | Rewritten; CTAs resolve to the approved method/workbook. Explicit skip-link targets and Pagefind bodies. |
| French routes and 17 French content sources | Removed, including the locale's home/index and all locale configuration. |
| 17 English template sources, including unpublished sources | Removed. The single five-document collection generates the approved doctrine routes. |
| 404 | Rewritten to MootMoat language; no astronaut or particle effect; noindex and excluded from Pagefind. |
| Announcement / cookie consent | Removed. |
| Button | Retained; live consumer of `tailwind-variants`. |
| Docs logo | Label/link rewritten; existing SVG preserved for #10. |
| Footer (2 files) | Footer rewritten to valid method and repository links; link component retained as a reusable primitive. |
| Language selector (2 files) | Removed. |
| Markdown overrides (13 files) | Retained; locale indirection removed, external links retain their correct target and fragments. |
| MDX demos (9 files) | Removed along with automatic demo imports. |
| Navigation (19 files) | Flat ordered navigation replaces locale/tab machinery; five tab files removed; native mobile dialog and pagination retained. |
| Search (10 files) | Retained Pagefind UI and dialog; internal dialog class names updated consistently. Local search returns current content. |
| SEO (2 files) | SEO rewritten for one locale and correct PNG fallback metadata; obsolete hreflang component removed. |
| Skip link | Retained; landing pages now provide the required main-content target. |
| Social (2 files) | Retained primitives; links and accessible labels point to the actual repository. |
| Starwind examples (59 files) | Removed. Retained navigation/search dialogs are functional copies outside that example tree. |
| Table of contents (2 files) / theme control (1 file) | Retained. |

## Associated residue and dependencies

- Removed the 17 i18n/configuration and package-manager helper scripts, locale utilities, translation tables, and French configuration. Remaining site/navigation data are flat files in `src/docs/config/`.
- Removed testimonials, feature/Cosmic/astronaut images, tours, Starwind configuration, particle script, motion-on-scroll styles, unused accordion animation rules, and 28 unreferenced local icons. The local GitHub icon remains consumed by the social component.
- Removed the tracked root scratch/log residue: `ascii_out.txt`, `error_log.txt`, `catch_err.js`, `build_error.log`, `build_err.log`, `build_err.utf8.log`, `fix_frontmatter.js`, and `out.txt`.
- Removed `@astrojs/rss`, `@tailwindcss/forms`, `astro-auto-import`, `motion`, `motion-on-scroll`, and `swiper` after removing/checking their sole consumers. Retained `tailwind-variants` for Button, `tw-animate-css` for dialog behavior, and the existing Astro/MDX/search/SEO stack.
- Regenerated `package-lock.json` independently from the clean baseline. Removed stale pnpm lock/config so npm is the documented installation authority. No changes were copied from the operator's primary lockfile.
- Removed the unusable inherited Vitest and motion-coverage scripts (no Vitest dependency or target), and replaced OS-specific search-copy commands with the explicit cross-platform `search:dev` helper. This does not represent a passing historical test suite.

## Runtime and downstream boundary

| Surface | Disposition |
| --- | --- |
| Astro, Worker adapter, explicit build wrapper, Wrangler configurations | Retained; production and development configuration packaging dry-runs pass. |
| `/assets/*` endpoint and R2 binding | Retained unchanged; no R2 write or remote probe required for this content transaction. |
| Stale root `functions/` and `netlify.toml` | Removed. |
| robots.txt | Rewritten with the MootMoat sitemap URL. |
| Static headers | Removed only the deleted French route rule. Final security/cache policy for production remains part of #11's release contract. |
| Pagefind and sitemap | Retained and regenerated locally from exactly seven approved content routes. |
| Repository authority link | Corrected to `mechanistic-org/mootmoat`. |
| Logo graphic, favicon, manifest, app/theme metadata, existing R2 image | Preserved for #10. The old apple-mobile-web-app-title and favicon/manifest identity are explicit deferred branding residue. They are not represented as cleaned in #9. |
| Portfolio crosslinks | Deferred to #10; none added. |
| Production deployment and final live/mobile/search acceptance | Deferred to #11; no production mutation performed. |
| Historical session-mining note | Preserved as historical evidence, excluded from current publishing/spec authority. |

## Validation

- Clean `npm ci --no-audit --no-fund`: pass with the isolated lockfile.
- `npm run build:worker`: pass. Eight HTML files comprise the seven approved content pages and 404; Pagefind indexes seven pages in English.
- `npm run check:content`: pass. Seven content routes, seven sitemap routes, seven indexed pages, 236 internal links/fragments, twelve canvases, required source metadata, no prohibited public template/claim residue.
- `npm run check:worker`: pass, packaging dry-run only.
- `npx --yes wrangler@4.114.0 deploy --dry-run --config wrangler.production.jsonc`: pass, packaging dry-run only; retained R2/assets bindings visible.
- `git diff --check`: pass.
- Exact outbound-candidate `validate_outbound_voice.py`: pass, zero em-dash violations.
- Independent standards and spec reviews: pass, no actionable findings against the approved ruling and baseline.
- Local rendered inspection: home and workbook render; searching `provenance` returns workbook, FAQ, and doctrine results. At 390px, documentation index fits and the menu navigates to doctrine, closes, and leaves no horizontal overflow. These are bounded structural checks, not #11 final production acceptance.
- Inherited `npm run lint`: cannot start, `Cannot find module 'typescript'`. The retained `typescript-eslint@8.38.0` requires a TypeScript peer that the original manifest does not declare. No passing lint result is claimed and no unrelated linter migration is included.

## Closeout scope

Only #9 may be released by this transaction. Its outward receipt records the final commit and issue/board state. Parent #7 is reconciled to make #10 the next Ready child, then execution stops. No absorbed ticket or parent Epic is closed here.
