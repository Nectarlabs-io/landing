# syntax=docker/dockerfile:1
#
# Production image for Railway (a Dockerfile in the repo root switches the
# service to the Dockerfile builder). Runs Next.js's standalone server.
#
#   web service      pre-deploy: node scripts/migrate.mjs · health check: /api/health
#   indexnow service start: node scripts/indexnow-cron.mjs · cron: daily

FROM node:22-slim AS node22
WORKDIR /app

FROM node22 AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM node22 AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Railway passes service variables to a Dockerfile build only when declared
# here. These are read by `next build` (pages are prerendered):
#   SITE_NOINDEX=true on staging; search-engine verification codes on production.
ARG SITE_NOINDEX
ARG CONTENT_PREVIEW
ARG GOOGLE_SITE_VERIFICATION
ARG BING_SITE_VERIFICATION
# `npm run build` also runs postbuild, which copies public/ and
# .next/static/ into .next/standalone so server.js can serve them.
RUN npm run build

FROM node22 AS runner
ENV NODE_ENV=production
# Docker sets HOSTNAME to the container id; the standalone server binds to
# HOSTNAME, so listen on every interface. Railway provides PORT at runtime.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=build --chown=node:node /app/.next/standalone ./
# For the pre-deploy migration and `npm run export:pilot` over `railway ssh`.
COPY --from=build --chown=node:node /app/migrations ./migrations
COPY --from=build --chown=node:node /app/scripts ./scripts

USER node
EXPOSE 3000
CMD ["node", "server.js"]
