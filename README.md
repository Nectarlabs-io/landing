# Nectar Network — public site

Marketing site for [nectarnetwork.fun](https://nectarnetwork.fun): the home page and the "Talk to us"
pilot-cohort form, which stores requests in Postgres and emails a notification.

Next.js 16 (App Router, Cache Components), React 19, TypeScript, CSS Modules, `pg`. Deployed on
Railway as one service (pages + API) with a Railway Postgres database.

The internal app screens (Feed, Quotes, Curate, Keepers) are not part of this site. They are kept on
the `app-preview` branch.

## Local development

```bash
npm install
cp .env.example .env.local        # then fill in DATABASE_URL and IP_HASH_SALT
npm run db:migrate
npm run dev
```

| Script                  | What it does                                                           |
| ----------------------- | ---------------------------------------------------------------------- |
| `npm run dev`           | Development server on http://localhost:3000                            |
| `npm run build`         | Production build (`output: 'standalone'`), then copies assets into it   |
| `npm start`             | Runs the standalone server (`node .next/standalone/server.js`)          |
| `npm run typecheck`     | Route types + `tsc --noEmit`                                           |
| `npm run lint`          | ESLint                                                                 |
| `npm test`              | API and script tests (needs `TEST_DATABASE_URL`, see below)            |
| `npm run db:migrate`    | Applies `/migrations/*.sql` not yet applied                            |
| `npm run export:pilot`  | Exports `pilot_requests` as CSV (see below)                            |

## Routes

| Path          | What                                                         |
| ------------- | ------------------------------------------------------------ |
| `/`           | Home                                                         |
| `/contact`    | Talk to us (pilot form)                                      |
| `/api/pilot`  | `POST`: stores a pilot request, then notifies                |
| `/api/health` | `GET`: `200 {"status":"ok"}`, Railway's health check         |

`www.nectarnetwork.fun/*` redirects with a 301 to `https://nectarnetwork.fun/*` (in `next.config.ts`).
Anything else, including `/app/*`, is a 404.

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

**Privacy.** `ip_hash` is `sha256(client IP + IP_HASH_SALT)`; the raw IP is never stored. Logs carry
only request ids, outcomes and error codes, never submission content.

### Database

Plain SQL migrations are kept in `/migrations` and are applied in filename order by
`scripts/migrate.mjs`, which records each one in `schema_migrations`. On Railway it runs as the
pre-deploy command, so a failed migration stops the deploy and the previous version keeps serving.

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

The tests run the real route handler against a real Postgres database built by the migration script.
Only the outgoing HTTP calls (Resend and the webhook) are mocked.

```bash
TEST_DATABASE_URL=postgres://user:password@127.0.0.1:5432/nectar_test npm test
```

The test database is dropped and rebuilt on every run; don't point it at real data.

## Environment variables

| Variable            | Required | Notes                                                                  |
| ------------------- | -------- | ---------------------------------------------------------------------- |
| `DATABASE_URL`      | yes      | On Railway: `${{Postgres.DATABASE_URL}}` (private network)             |
| `IP_HASH_SALT`      | yes      | Random secret, one per environment: `openssl rand -hex 32`             |
| `RESEND_API_KEY`    | for email | Resend API key with sending access                                    |
| `PILOT_FROM`        | for email | Sender on the verified domain, e.g. `Nectar pilot <pilot@nectarnetwork.fun>` |
| `PILOT_NOTIFY_TO`   | no       | Defaults to `kunal@nectarnetwork.fun`                                  |
| `PILOT_WEBHOOK_URL` | no       | Extra JSON notification; off when empty                               |

Without `DATABASE_URL` or `IP_HASH_SALT` the form returns 503 ("email us instead"). Without the two
email variables, requests are stored but not emailed.

## Deploying on Railway

The repo's `Dockerfile` builds the standalone server and copies `public/` and `.next/static/` into it
(the standalone server doesn't serve them otherwise), plus `migrations/` and `scripts/`.

Railway's `railway.json` / `railway.toml` config-as-code is deprecated and new services can't opt in,
so these settings are made on the service itself.

1. **Project.** New project → deploy this GitHub repo as a service named `web`. Add a PostgreSQL
   database to the same project (service name `Postgres`).
2. **Environments.** Create a `staging` environment and do everything below there first, then repeat
   in `production`.
3. **web service settings.**
   - Builder: Dockerfile (Railway switches to it because the repo root has one).
   - Pre-deploy command (Deploy section): `node scripts/migrate.mjs`
   - Healthcheck path: `/api/health`
   - Networking: generate a Railway domain for staging.
4. **web → Variables:** `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `IP_HASH_SALT`, `RESEND_API_KEY`,
   `PILOT_FROM`, `PILOT_NOTIFY_TO=kunal@nectarnetwork.fun`, and `PILOT_WEBHOOK_URL` only if wanted.
5. **Postgres → Backups tab.** Turn on the daily schedule (kept 6 days). If your plan doesn't offer
   it, Railway's docs suggest a cron service running a daily `pg_dump` instead.
6. **Check staging.** Submit the form on the staging domain, confirm the row in the Postgres
   database view, and confirm the email arrives at kunal@nectarnetwork.fun.

### Custom domain (production)

Add `nectarnetwork.fun` and `www.nectarnetwork.fun` as custom domains on the `web` service
(production environment). For each, Railway shows two records to create at your DNS provider:

| Host                 | Type                                     | Value                         |
| -------------------- | ---------------------------------------- | ----------------------------- |
| `nectarnetwork.fun`  | CNAME, using CNAME flattening / ALIAS / ANAME at the root | target Railway shows |
| `nectarnetwork.fun`  | TXT (ownership)                          | name and value Railway shows  |
| `www`                | CNAME                                    | target Railway shows          |
| `www`                | TXT (ownership)                          | name and value Railway shows  |

Railway doesn't publish a static IP, so plain `A` records won't work at the root; the DNS provider
must support CNAME flattening or ALIAS. Both the CNAME and the TXT record are needed to verify.
The app itself sends www to the apex with a 301.

### Email (Resend)

Add `nectarnetwork.fun` in Resend (Domains → Add domain) and create every record on its Records tab.
The values are generated per domain, so copy them exactly:

| Host                     | Type | Purpose                                   |
| ------------------------ | ---- | ----------------------------------------- |
| `resend._domainkey`      | TXT  | DKIM                                      |
| `send`                   | TXT  | SPF for the sending subdomain             |
| `send`                   | MX   | Bounce and complaint feedback             |

Newer Resend domains may show CNAME records instead; use whatever the Records tab lists. If a
DNS proxy is in front (e.g. Cloudflare), turn proxying off for these records. These are on the
`send` subdomain and `resend._domainkey`, so they don't touch the root MX records that deliver mail
to kunal@nectarnetwork.fun. After verification, Resend recommends a DMARC record; if `_dmarc`
already exists, edit it rather than adding a second one.

## Before the domain switch

- **Media kit.** The footer links to `https://nectarnetwork.fun/media-kit`, which today is served by
  the current site. Once DNS points here that path will 404 until the page is ported into this app.
