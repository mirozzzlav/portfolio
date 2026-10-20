FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG SITE_URL=https://mirofurinda.com
ARG VITE_TURNSTILE_SITE_KEY=""
RUN SITE_URL="$SITE_URL" VITE_TURNSTILE_SITE_KEY="$VITE_TURNSTILE_SITE_KEY" npm run build \
    && rm -rf dist/server

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app/api

COPY api/pyproject.toml ./
COPY api/app ./app
RUN /usr/local/bin/python -m pip install --no-cache-dir . \
    && useradd --system --uid 10001 app

COPY --from=build /app/dist /app/dist
USER app
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
