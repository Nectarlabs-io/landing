# Nectar Network — landing site

Marketing site and app preview for [nectarnetwork.fun](https://nectarnetwork.fun): the pilot-cohort
home page, the "Talk to us" form, and preview screens for Nectar Feed, Macaulay quotes, the curator
console and Nectar Keepers.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript and CSS Modules. Every
page is statically prerendered; the only server code is the contact-form route handler.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

| Script          | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Development server                   |
| `npm run build` | Production build (type-checks too)   |
| `npm start`     | Serve the production build           |
| `npm run lint`  | ESLint (Next.js core-web-vitals + TS) |

## Routes

| Path           | Page                                              |
| -------------- | ------------------------------------------------- |
| `/`            | Home                                              |
| `/contact`     | Talk to us: pilot-cohort form                     |
| `/app/feed`    | Nectar Feed: exit capacity by market (`/app` redirects here) |
| `/app/quotes`  | Post a funded quote (Macaulay pricing preview)    |
| `/app/curate`  | Curator console: size exit capacity               |
| `/app/keepers` | Nectar Keepers: operators and races               |
| `/api/pilot`   | `POST` endpoint behind the contact form           |

## Project layout

```
src/
  app/                 routes, root layout, global styles and tokens (globals.css)
  components/
    ui/                primitives: Button, Badge, Card, CellGrid, DataTable, ToggleButton, form styles…
    brand/             logo mark and wordmark
    theme/             dark/light theme store, hook and toggle
    site/              marketing header, announcement bar, footers
    home/              home-page sections, including the architecture diagram
    app/               app-preview chrome: preview bar, tabbed header, page shell, stat strip
    feed/ quote/ curate/ keepers/ contact/   page-specific components and styles
  data/markets.ts      snapshot figures shown in the app preview
  lib/                 site config, formatting, contact-form validation
public/brand/          logo artwork (dark and light)
src/assets/            illustrations imported through next/image
```

## Design system

- **Tokens** live in `src/app/globals.css` as CSS custom properties, with a dark set (default) and a
  light set selected by `<html data-theme>`. Components only reference tokens (`var(--accent)`,
  `var(--surface)`, …), never raw colours.
- **Type:** Syne for display headings, DM Mono for everything else, loaded with `next/font`.
- **Theme:** the toggle stores the choice in `localStorage` (`nectar-theme`); an inline script in the
  root layout applies it before first paint, so there is no flash.
- **Responsive:** one breakpoint at 760px (menus collapse, tables become label/value cards, the
  architecture diagram becomes a stacked list) and a tighter one at 380px.
- **Motion:** entrance, pulse, float and flow-line animations are global utility classes and are all
  disabled under `prefers-reduced-motion`.

## Contact form

The form posts to `/api/pilot`, which validates the request and forwards it as JSON to
`PILOT_WEBHOOK_URL` (for example a Slack, Zapier or CRM webhook). Copy `.env.example` to
`.env.local` and set it.

- In **development** without `PILOT_WEBHOOK_URL`, submissions are accepted and discarded so the form
  can be tried locally.
- In **production** without it, the endpoint returns 503 and the form asks people to write in
  directly, so no request is silently dropped.

## Before launch

The design carries a few placeholders that still need real values:

- `src/lib/site.ts`: `contactEmail` (`[CONTACT EMAIL]`) and `replyWindow` (`[N] business days`).
- `src/app/app/keepers/page.tsx`: `[MIN BOND]` and the operators' `[BOND]`.
- `src/app/app/feed/page.tsx`: the draft "what counts as committed" rule (`[N]%`, `[D] days`).
- `src/data/markets.ts`: snapshot figures, dated Oct 25, 2026. Replace with live data when the Feed
  API is ready.
