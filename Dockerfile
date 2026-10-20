FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG SITE_URL=https://mirofurinda.com
ARG VITE_TURNSTILE_SITE_KEY=""
RUN SITE_URL="$SITE_URL" VITE_TURNSTILE_SITE_KEY="$VITE_TURNSTILE_SITE_KEY" npm run build \
    && rm -rf dist/server

FROM caddy:2-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
