# Nectar Network — public site

Site for [nectarnetwork.fun](https://nectarnetwork.fun): the home page, the "Talk to us" pilot-cohort
form (stored in Postgres, notified by email), and the explainer, research and reference pages
written in Markdown under `/content`.

Next.js 16 (App Router, Cache Components, every page statically prerendered), React 19,
TypeScript, CSS Modules, `pg`. Deployed on **Railway** from the repo's `Dockerfile`: a web service
(pages + API), a Postgres database and a daily cron service for IndexNow.

The internal app screens (Feed, Quotes, Curate, Keepers) are not part of this site. They are kept on
the `app-preview` branch.

## Local development

```bash
npm install
cp .env.example .env.local        # then fill in DATABASE_URL and IP_HASH_SALT
npm run db:migrate
npm run dev                       # CONTENT_PREVIEW=1 npm run dev to see drafts
```

| Script                  | What it does                                                           |
| ----------------------- | ---------------------------------------------------------------------- |
| `npm run dev`           | Development server on http://localhost:3000                            |
| `npm run build`         | Production build (`output: 'standalone'`), then copies assets into it   |
| `npm start`             | Runs the standalone server (`node .next/standalone/server.js`)          |
| `npm run typecheck`     | Route types + `tsc --noEmit`                                           |
| `npm run lint`          | ESLint                                                                 |
| `npm test`              | Content rules, API and script tests (API tests need `TEST_DATABASE_URL`) |
| `npm run db:migrate`    | Applies `/migrations/*.sql` not yet applied                            |
| `npm run export:pilot`  | Exports `pilot_requests` as CSV (see below)                            |

## Content

Pages other than home and contact are Markdown with YAML front matter:

| File                          | URL                 |
| ----------------------------- | ------------------- |
| `content/pages/<name>.md`     | `/<name>`           |
| `content/learn/index.md`      | `/learn`            |
| `content/learn/<slug>.md`     | `/learn/<slug>`     |
| `content/research/...`        | `/research/...`     |

Front matter: `title` (the H1), `metaTitle` (the `<title>` before " | Nectar Network", if different),
`description` (140–160 characters), `type`, `status` (`draft` or `published`), `published` and
`updated` (`YYYY-MM-DD`), optional `eyebrow`, `crumb` and `related`.

- **Drafts** don't exist in production builds: no page, no sitemap entry, no links, no OG image.
  `CONTENT_PREVIEW=1` shows them (with a draft banner and `noindex`).
- **Review notes** are HTML comments starting `<!-- REVIEW:`. They are stripped from the page.
- **To publish a page:** resolve its REVIEW notes, set `status: published` and `published:` to the
  date, and run `npm test`. The tests check title and description lengths, uniqueness, banned
  wording, placeholders, REVIEW notes, internal links (published pages may link only to published
  pages), FAQ answer length and article length.

Each page gets its title, description, canonical URL, Open Graph and Twitter tags, an OG image
(`/og/<path>`, generated at build time) and JSON-LD (`src/lib/seo/`). `/sitemap.xml`, `/robots.txt`,
`/llms.txt` and `/llms-full.txt` list published pages only.

## Routes

| Path              | What                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| `/`               | Home                                                                  |
| `/contact`        | Talk to us (pilot form)                                               |
| content pages     | See above                                                             |
| `/api/pilot`      | `POST`: stores a pilot request, then notifies                         |
| `/api/indexnow`   | `GET` with `Authorization: Bearer $CRON_SECRET`: IndexNow ping (cron) |
| `/api/health`     | `GET`: `200 {"status":"ok"}`                                          |

Redirects (all 301, in `next.config.ts`): `www.nectarnetwork.fun/*` → `https://nectarnetwork.fun/*`;
the previous site's `/features` → `/how-it-works` (or `/#how` until that page is published);
`/vault`, `/performance` and `/dashboard` → `/`. A trailing slash is removed with a 308. HTTP →
HTTPS happens at the platform edge.

Every host except `nectarnetwork.fun` (the `*.up.railway.app` service domains, staging) gets
`X-Robots-Tag: noindex`, so only the real domain is indexed and nothing needs flipping at launch.

## Pilot form backend

`POST /api/pilot` runs these checks in order:

1. **Honeypot.** A hidden `website` field. If it is filled in, the request gets a normal-looking
   success but nothing is stored or sent.
2. **Fill time.** The form sends how long it was open. Under 3 seconds → `400 too_fast`.
3. **Validation**, shared with the form (`src/lib/pilot.ts`): role must be one of the listed roles;
   name, work email and organisation are required; every field is capped at 200 characters and the
   message at 4,000. Anything over a cap is rejected (`422`), not truncated.
4. **Rate limit + insert.** At most 5 stored requests per `ip_hash` per rolling hour (`429` after
   that). The count and the insert share one transaction with a per-`ip_hash` advisory lock, so
   simultaneous requests can't slip past the limit.
5. **Notify.** Email through Resend to `PILOT_NOTIFY_TO` with Reply-To set to the submitter, plus the
   optional `PILOT_WEBHOOK_URL`. If either fails after the row is saved, the response is still a
   success and the failure is logged. The database row is the record.

If the database is unreachable the API returns `503` and the form asks people to email
kunal@nectarnetwork.fun instead.

**Privacy.** `ip_hash` is `sha256(client IP + IP_HASH_SALT)`; the raw IP is never stored. The IP
comes from `X-Real-IP`, set by Railway's edge. Logs carry only request ids, outcomes and error codes,
never submission content.

### Database

Plain SQL migrations are kept in `/migrations` and are applied in filename order by
`scripts/migrate.mjs`, which records each one in `schema_migrations`. On Railway it runs as the
pre-deploy command, so a failed migration stops the deploy and the previous version keeps serving.
Migration 003 widened the role check for the Oct 31 roles; rows stored before it are not rewritten.

No ORM: the app runs one parameterised insert and one count, and an ORM would add a build step and a
dependency without simplifying either.

### Reading and exporting submissions

Read them in Railway's database view on the Postgres service (table `pilot_requests`). To export CSV:

```bash
DATABASE_URL='<connection string>' npm run export:pilot -- pilot-requests.csv
```

From your machine the private `DATABASE_URL` isn't reachable; use the Postgres service's
`DATABASE_PUBLIC_URL`, which exists only while Public Networking (TCP proxy) is turned on for the
database. Cells that a spreadsheet would treat as formulas are prefixed with `'`.

### Tests

The API tests run the real route handlers against a real Postgres database built by the migration
script. Only outgoing HTTP calls (Resend, the webhook, IndexNow) are mocked.

```bash
TEST_DATABASE_URL=postgres://user:password@127.0.0.1:5432/nectar_test npm test
```

The test database is dropped and rebuilt on every run; don't point it at real data.

## Environment variables

Set on the Railway **web** service unless noted. Never paste secret values into chat or commits.

| Variable                   | Where                     | Notes                                                       |
| -------------------------- | ------------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`             | web                       | `${{Postgres.DATABASE_URL}}` (private network)              |
| `IP_HASH_SALT`             | web, secret               | One per environment: `openssl rand -hex 32`                 |
| `RESEND_API_KEY`           | web, secret, for email    | Resend API key with sending access                          |
| `PILOT_FROM`               | web, for email            | Sender on the verified domain, e.g. `Nectar pilot <pilot@nectarnetwork.fun>` |
| `PILOT_NOTIFY_TO`          | web                       | Defaults to `kunal@nectarnetwork.fun`                       |
| `PILOT_WEBHOOK_URL`        | web, optional             | Extra JSON notification; off when empty (not in use)        |
| `PORT`                     | web (production)          | `3000`, so the cron service can reference `${{web.PORT}}`   |
| `CRON_SECRET`              | web, secret               | 16+ random characters; the cron service references it      |
| `INDEXNOW_ENABLED`         | web (production)          | `true` once nectarnetwork.fun serves this site              |
| `GOOGLE_SITE_VERIFICATION` | web, build                | Search Console HTML-tag token (not needed with a DNS TXT)   |
| `BING_SITE_VERIFICATION`   | web, build                | Bing Webmaster `msvalidate.01` token                        |
| `SITE_NOINDEX`             | web (staging), build      | `true`: `noindex` meta, `Disallow: /`, empty sitemap        |
| `CONTENT_PREVIEW`          | web (staging), build      | `1`: drafts are visible                                     |
| `INDEXNOW_URL`             | indexnow                  | `http://${{web.RAILWAY_PRIVATE_DOMAIN}}:${{web.PORT}}/api/indexnow` |
| `CRON_SECRET`              | indexnow                  | `${{web.CRON_SECRET}}`                                      |

Variables marked "build" are read when pages are prerendered; the `Dockerfile` declares them as
`ARG`s so Railway passes them to the build, and a change needs a redeploy. Without `DATABASE_URL` or
`IP_HASH_SALT` the form returns 503 ("email us instead"). Without the two email variables, requests
are stored but not emailed.

## Deploying on Railway

The repo's `Dockerfile` builds the standalone server and copies `public/`, `.next/static/`,
`migrations/` and `scripts/` into it. Railway always builds with a root `Dockerfile` when there is
one.

| Project | Environment | Services | Deploys |
| --- | --- | --- | --- |
| nectar-network-staging | staging | `web`, `Postgres` | Automatically on every push to `claude/design-implementation-hmz7s5` (needs Railway's GitHub app on the Nectarlabs-io org) |
| nectar-network | production | `web`, `Postgres`, `indexnow` (cron) | Manually |

**web** (both): pre-deploy command `node scripts/migrate.mjs`, health check `/api/health`, restart on
failure. Staging also sets `SITE_NOINDEX=true` and `CONTENT_PREVIEW=1`, so drafts can be reviewed at
its `*.up.railway.app` domain.

**indexnow** (production): the same image with start command `node scripts/indexnow-cron.mjs` and
cron schedule `17 6 * * *` (daily, UTC). It calls the web service's `/api/indexnow` over the private
network and exits. The web service submits nothing until `INDEXNOW_ENABLED=true`.

**Production deploys stay manual:** the production `web` and `indexnow` services are pinned to one
commit, so pushes to the branch don't deploy them. To ship, pin both to the new commit (connect the
source again with that commit SHA). Turn on the Postgres service's daily backups (Backups tab) if
your plan has them.

The move of `nectarnetwork.fun` to Railway is prepared, not done: see [docs/cutover.md](docs/cutover.md).

### Email (Resend)

Add `nectarnetwork.fun` in Resend (Domains → Add domain) and create every record on its Records tab.
The values are generated per domain, so copy them exactly:

| Host                     | Type | Purpose                                   |
| ------------------------ | ---- | ----------------------------------------- |
| `resend._domainkey`      | TXT  | DKIM                                      |
| `send`                   | TXT  | SPF for the sending subdomain             |
| `send`                   | MX   | Bounce and complaint feedback             |

Newer Resend domains may show CNAME records instead; use whatever the Records tab lists. These are
on the `send` subdomain and `resend._domainkey`, so they don't touch the root MX records that
deliver mail to kunal@nectarnetwork.fun. After verification, Resend recommends a DMARC record; if
`_dmarc` already exists, edit it rather than adding a second one.

## Fonts

`src/assets/fonts/` holds Syne Bold and DM Mono Regular (SIL Open Font License 1.1, from Google
Fonts) for the generated OG images. Pages load the same families through `next/font`.
