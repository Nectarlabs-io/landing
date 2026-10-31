# Moving nectarnetwork.fun to this site

Checked 2026-10-31 through the Vercel connector.

## What serves the domain today

- `nectarnetwork.fun` is a domain on the Vercel project **nectar-frontend** (Git: Nectar-Network/nectar),
  in the team "kunal's projects". DNS is on Vercel's nameservers (`ns1.vercel-dns.com`,
  `ns2.vercel-dns.com`), so no record changes at a registrar are needed: the move happens in Vercel.
- The same project also has `nectar.monster` (307 → nectarnetwork.fun), `nectarn.fun`
  (302 → nectarnetwork.fun) and `testnet.nectar.monster` (the app). `www.nectarnetwork.fun` is not
  attached to any project.
- The live site has no `robots.txt` or `sitemap.xml` (both 404). Its pages' metadata describes the
  previous positioning (chain-specific, "keeper infrastructure").

## URL map

| Old URL | On this site | How |
| --- | --- | --- |
| `/` | `/` | same path |
| `/features` | `/how-it-works` once published; `/#how` until then | 301 (`next.config.ts`) |
| `/vault`, `/vault/*` | `/` | 301: product pages aren't on this site |
| `/performance`, `/performance/*` | `/` | 301 |
| `/dashboard`, `/dashboard/*` | `/` | 301 |
| `/media-kit` | `/media-kit` | same path, **but the page is a draft**: it 404s until published |
| `/media-kit/logo-files/*`, `/media-kit/png/**`, `/media-kit/svg/*` | none yet | **404 unless the files are copied** (list below) |
| `/icon.svg` | `/icon.svg` | same path |

The three product URLs could instead go to the app (e.g. `testnet.nectar.monster`), or return
410 Gone. Home is the neutral choice while the site makes no product claims.

### Media kit files linked from the live page

Copy these from Nectar-Network/nectar (`public/media-kit/`, presumably) into `public/media-kit/`
here, keeping the paths, if they should keep working:

```
logo-files/nectar-app-icon.{jpg,png}       logo-files/nectar-lockup-mono.{jpg,png}
logo-files/nectar-lockup.{jpg,png}         logo-files/nectar-mark-compact.{jpg,png}
logo-files/nectar-mark-mono-black.{jpg,png} logo-files/nectar-mark-mono-white.{jpg,png}
logo-files/nectar-mark.{jpg,png}
png/app-icon/nectar-app-icon-{180,192,256,512}.png
png/avatar/nectar-avatar-1024.png
png/favicon/nectar-favicon-{16,32}.png
png/lockup/nectar-lockup-mono-on-dark.png   png/lockup/nectar-lockup-on-dark.png
svg/nectar-app-icon.svg  svg/nectar-lockup-mono.svg  svg/nectar-lockup.svg
svg/nectar-mark-compact.svg  svg/nectar-mark-mono.svg  svg/nectar-mark.svg
```

The live media-kit text names a chain, describes the product as running and links the old X
handle, so only the files should come across, not the copy. The brand facts it states (seven-cell honeycomb mark, mint
`hsl(160 90% 52%)` on `hsl(220 15% 6%)`, Syne + DM Mono, dark-only) can be checked against
`content/pages/media-kit.md` before that draft is approved.

## Steps

1. **Before:** approve and publish `/media-kit` (or decide where it should go), copy the media-kit
   files, and set the production variables (README → Environment variables). Deploy production and
   check it on its `*.vercel.app` URL: pages, the form (row in Neon + email), `/api/health`.
2. **Move the domain.** In the **nectar-landing** project: Settings → Domains → add
   `nectarnetwork.fun`. Vercel offers to move it from nectar-frontend; accept. Add
   `www.nectarnetwork.fun` too (the app redirects it to the apex with a 301). This switches the
   live site. Deployment Protection on nectar-landing covers everything except custom domains, so
   the domain is public while `*.vercel.app` URLs still ask for a Vercel login.
3. **Check** (from any machine):

   ```bash
   curl -sI https://nectarnetwork.fun/ | grep -iE "^HTTP|x-robots-tag"   # 200, no X-Robots-Tag
   curl -sI https://www.nectarnetwork.fun/contact | grep -i location     # https://nectarnetwork.fun/contact
   curl -sI http://nectarnetwork.fun/ | grep -i -E "^HTTP|location"      # redirect to https
   curl -sI https://nectarnetwork.fun/features | grep -i location        # /#how or /how-it-works
   curl -s https://nectarnetwork.fun/robots.txt
   curl -s https://nectarnetwork.fun/sitemap.xml
   curl -s https://nectarnetwork.fun/cb936410115550f57a308d52475044dd.txt
   ```

   Also check that `nectar.monster` and `nectarn.fun` still redirect: they are configured on
   nectar-frontend as redirects to the name `nectarnetwork.fun`. If Vercel drops or rejects them
   once the target lives in another project, move them to this project as redirect domains.
4. **Turn on IndexNow:** set `INDEXNOW_ENABLED=true` in production. The daily cron then submits
   the sitemap URLs; it records only what IndexNow accepts, so it retries on its own.
5. **Search engines:** verify the domain in Google Search Console (Domain property, DNS TXT record
   in Vercel DNS) and Bing Webmaster Tools, and submit `https://nectarnetwork.fun/sitemap.xml` to
   both. Use URL Inspection on `/` to request a recrawl, since the old pages described the previous
   positioning.

## Rollback

Move `nectarnetwork.fun` back to nectar-frontend (Settings → Domains on that project). Nothing in
this site changes the old project, so its last production deployment is still there.
