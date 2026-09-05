# MootMoat

A DIY method for making engineering experience specific, sourced, and reviewable. The site offers non-normative doctrine, twelve evidence-workbook canvases, a FAQ, and a bounded discussion of hiring-related representation risks.

It is not an ATS bypass, an application-volume tool, or a certification system. This repository does not implement a universal identity schema, validator, extraction service, or machine-readable profile endpoints.

## Published content architecture

- `/`
- `/docs/`
- `/docs/what-is-mootmoat/`
- `/docs/doctrine/`
- `/docs/workbook/`
- `/docs/faq/`
- `/docs/ontology-gap/`

The five MDX documents live in `src/docs/data/docs/`. Their source metadata links to the approved editorial ruling and historical source revisions; those historical drafts are provenance, not the current doctrine. The content collection requires nonempty sources and orders the sidebar and pagination from each document's `order` field.

`src/pages/` contains the home, documentation index, content renderer, 404 page, and `/assets/*` Worker endpoint. Site and navigation data are in `src/docs/config/`. Shared documentation components are in `src/docs/components/`.

## Local use

Use a Node.js version supported by the locked Astro release and npm. `package-lock.json` is the dependency lockfile.

```sh
npm ci
npm run dev
```

The development server does not build a search index. To search locally, build the site and copy its generated index before starting the development server:

```sh
npm run build:worker
npm run check:content
npm run search:dev
npm run dev
```

`npm run build:worker` invokes the explicit Cloudflare build wrapper, which runs Astro and Pagefind with the required build environment. `npm run check:worker` verifies the generated R2 route accepts filename URLs and packages the development Worker configuration in dry-run mode. To validate production packaging without deploying:

```sh
npx --yes wrangler@4.114.0 deploy --dry-run --config wrangler.production.jsonc
```

The content check verifies the route inventory, internal links and fragments, source metadata, all twelve canvases, English-only Pagefind output, sitemap parity, and absence of obsolete public claims. `npm run lint` retains the repository ESLint check, but currently cannot start after a clean install because its TypeScript peer is undeclared. This inherited limitation is recorded in the receipt. The former Vitest and motion-coverage scripts had no installed Vitest runner or test target and were removed with the unused template machinery.

## Runtime and release boundary

The site uses Astro and the Cloudflare Worker adapter. `wrangler.production.jsonc` retains the production routes and the `MOOTMOAT_ASSETS` R2 binding. `src/pages/assets/[...path].ts` serves the retained `/assets/*` route. A local preview without an R2 binding does not prove production asset behavior.

Building and dry-run packaging do not deploy. Production deployment is a separate release action. The V18 brand and cross-links are recorded in [issue #10's receipt](docs/receipts/issue-10.md); production acceptance and release dispositions are recorded in [issue #11's receipt](docs/receipts/issue-11.md).

After a production build, `npm run check:production` compares live HTML with the local build and verifies production search, sitemap, links/fragments, retired-route 404s, branding, responsive layouts, R2 bytes, and actual portfolio cross-link navigation. It makes read-only requests to both production sites and writes local reports/screenshots under `var/release-11/`. `npm run check:release-image` is the focused exact-URL image regression check; an optional base URL argument supports a local Worker fixture.

The historical `session_mining_mootmoat_v1.md` is a session record, not a current product specification or publishing source.

## Sources and change control

- [Repository and issue history](https://github.com/mechanistic-org/mootmoat)
- [Approved keep-kill-rewrite ruling](https://github.com/mechanistic-org/mootmoat/issues/8#issuecomment-5546452747)
- [Content cleanup contract](https://github.com/mechanistic-org/mootmoat/issues/9)
- [Ruling-to-file receipt](docs/receipts/issue-9.md)
