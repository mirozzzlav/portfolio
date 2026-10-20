# Deployment Notes

## Docker Compose s Caddy

Compose v koreni projektu spúšťa dva kontajnery: Caddy so statickým React buildom
a FastAPI pre kontaktný formulár. Caddy čaká na úspešný healthcheck API.
Caddy počúva iba na HTTP porte 80 bez domény a automatického HTTPS.
Compose publikuje tento port na `127.0.0.1:8080` hostiteľa. Doménu, HTTPS,
certifikáty a presmerovanie HTTP na HTTPS spravuje Nginx na hostiteľovi.

### Lokálne spustenie

Z koreňa projektu:

```bash
cp .env.example .env
docker compose up -d --build
```

Existujúci koreňový `.env` neprepisuj; potrebné hodnoty doplň podľa `.env.example`.
Docker, frontend aj API používajú tento jeden súbor. Pri prechode zo staršieho
nastavenia presuň hodnoty z `api/.env` do koreňového `.env` a starý súbor odstráň.
Otvor `http://localhost:8080`. `/api/contact` smeruje na API, ostatné cesty
obsluhuje frontend vrátane prerenderovaných jazykových stránok a SPA fallbacku.
API port 8001 je dostupný iba v Docker sieti. Healthcheck používa interný `/health`.
Lokálny príklad má `MAIL_DRY_RUN=true` a prázdne Turnstile kľúče.

### Nasadenie za Nginxom na hostiteľovi

Na aktuálnom VPS port `8080` používa `yokaid_api_main`. Pre portfolio nastav
`HTTP_PORT=8081`; tento port bol pri kontrole 2026-10-20 voľný.
Pripravená konfigurácia [nginx-docker.example](nginx-docker.example) vychádza zo
živej konfigurácie `/etc/nginx/sites-available/mirofurinda.com`, zachováva HTTPS,
presmerovanie `www` a existujúci rate limit. Všetky požiadavky posiela na `8081`.
Pôvodné `root`, `try_files` a samostatná proxy `/api/` na `8001` sa odstránia,
pretože frontend aj API už obsluhuje Caddy v Compose.

Najprv nasaď publikovaný commit s Docker konfiguráciou, zachovaj serverový `.env`,
nastav v ňom `HTTP_PORT=8081` a spusti `docker compose up -d --build`.
Over `docker compose ps`, `curl -I http://127.0.0.1:8081/en/projects` a API cestu
bez odoslania správy cez `curl -i http://127.0.0.1:8081/api/contact`
(API má pre GET vrátiť `405`, pretože endpoint prijíma POST).
Až potom prepni Nginx:

```bash
sudo cp -a /etc/nginx/sites-available/mirofurinda.com /etc/nginx/sites-available/mirofurinda.com.before-docker
sudo cp deploy/nginx-docker.example /etc/nginx/sites-available/mirofurinda.com
sudo nginx -t && sudo systemctl reload nginx
curl -I https://mirofurinda.com/en/projects
curl -i https://mirofurinda.com/api/contact
```

Ak test zlyhá, obnov zálohu pred ďalším reloadom. Staré `portfolio-api` na porte
`8001` možno odstaviť až po overení fungovania Docker API cez verejnú doménu.
Ostatné aplikácie na VPS ponechaj bez zmien.

V koreňovom `.env` nastav:

```dotenv
HTTP_PORT=8081
DOMAIN_NAME=mirofurinda.com
SITE_URL=https://${DOMAIN_NAME}
VITE_TURNSTILE_SITE_KEY=verejny_turnstile_kluc
```

DNS domény musí smerovať na VPS. Nginx počúva na verejných portoch 80 a 443;
HTTP presmeruje na HTTPS a HTTPS požiadavky posiela cez HTTP na Docker port.
V existujúcom HTTPS `server` bloku pre `mirofurinda.com` použi:

```nginx
location / {
    proxy_pass http://127.0.0.1:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Rovnaká proxy obslúži frontend aj `/api/*`; Caddy smeruje API požiadavky
na interný FastAPI kontajner. Ak zmeníš `HTTP_PORT`, uprav aj port v `proxy_pass`.
Po úprave konfigurácie over `sudo nginx -t` a použi `sudo systemctl reload nginx`.
Existujúce nastavenie certifikátov zostáva v Nginxe. Caddy nepotrebuje TLS porty
ani volumes pre certifikáty. Staré premenné `CADDY_ADDRESS` a `HTTPS_PORT`
môžeš z existujúceho `.env` odstrániť; Compose ich už nepoužíva.

`SITE_URL` naďalej obsahuje verejnú HTTPS adresu pre prerender a sitemapu;
neurčuje adresu, na ktorej Caddy počúva.

V rovnakom koreňovom `.env` nastav adresy odosielateľa a príjemcu, SMTP prístupové údaje,
`CONTACT_ALLOWED_ORIGINS=${SITE_URL}` a súkromný `TURNSTILE_SECRET_KEY`.
Keď je SMTP a doména odosielateľa pripravená, nastav `MAIL_DRY_RUN=false`.
Všetky nastavenia sú uvedené v koreňovom `.env.example`.

Compose aj priamy Vite build používajú koreňový `.env`.
`VITE_TURNSTILE_SITE_KEY` je verejný a zapíše sa do JS pri builde.
Súkromné API nastavenia sa načítavajú až pri spustení z rovnakého `.env`; env súbory sú
vylúčené z Docker build kontextu. Node.js a SSR build artefakty nie sú vo výslednom
Caddy image.

### Aktualizácia a kontrola

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 web api
curl -I http://localhost:8080/en/projects
```

Pri produkcii použi v `curl` svoju HTTPS adresu. Zmeny verejného Turnstile kľúča
alebo `SITE_URL` vyžadujú nový build. `docker compose up -d --build` zároveň
aplikuje zmeny API env súboru; samotný `restart` nové hodnoty nenačíta.

Zastavenie:

```bash
docker compose down
```

Pôvodný skript `deploy-vps.sh` je určený pre nasadenie cez Nginx/systemd
opísané nižšie, nie pre Docker Compose.

## Pôvodné nasadenie cez Nginx a systemd

These files are examples for deploying the portfolio frontend and contact API on a VPS.

They are intentionally not meant to be copied blindly. Check the existing VPS services first so the portfolio API does not conflict with anything already running.

## Safe VPS checks

Before changing anything on the VPS, inspect the current state:

```bash
systemctl list-units --type=service --state=running
ss -tulpn
sudo nginx -T
```

Do not stop or restart unrelated services.

## Expected layout

Example deployment path:

```text
/var/www/html/portfolio/
  api/
  dist/
```

Example production env file:

```text
/var/www/html/portfolio/.env
```

The API should listen only on localhost:

```text
127.0.0.1:8001
```

Nginx can then proxy `/api/` to the API while serving the React build from `dist/`.

The nginx example is configured for React/Vite client-side routing:

```nginx
try_files $uri $uri/ /index.html;
```

This keeps direct visits and browser refreshes working for routes such as `/contact` and `/projects`.

## Nginx site files

This VPS uses the Debian/Ubuntu nginx layout:

```text
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
```

Create the portfolio site as a separate nginx config so existing services, such as `wondercules.com`, are not modified:

```bash
sudo cp deploy/nginx-site.example /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t
sudo systemctl reload nginx
```

If `/etc/nginx/sites-enabled/portfolio` already exists, inspect it first instead of overwriting it.

The example config is for:

```text
mirofurinda.com
```

It intentionally does not include `www.mirofurinda.com`.

## HTTPS certificate

Issue the certificate only after DNS points to the VPS and HTTP works:

```bash
sudo certbot --nginx -d mirofurinda.com
```

This creates a certificate for `mirofurinda.com` only. It should not replace the existing `wondercules.com` certificate.

## Deployment flow

1. Pull or copy the repository to the VPS.
2. For regular deploys, run:

   ```bash
   ./deploy/deploy-vps.sh
   ```

   The script pulls `origin/main` by default, installs Node dependencies when package files changed, builds the frontend, prepares the API virtualenv, and restarts `portfolio-api` when permitted.

   To deploy a different branch explicitly:

   ```bash
   BRANCH=dev ./deploy/deploy-vps.sh
   ```

3. Or build the frontend manually:

   ```bash
   export VITE_TURNSTILE_SITE_KEY=0x4AAAA...
   npm ci
   npm run build
   ```

4. Create the API virtualenv:

   ```bash
   cd api
   python3 -m venv .venv
   .venv/bin/pip install -e .
   ```

5. Create the root `.env` from `.env.example` if it does not exist and edit the SMTP values:

   ```bash
   cp .env.example .env
   nano .env
   ```

6. Install the systemd service from `portfolio-api.service.example`.
7. Test nginx config before reload:

   ```bash
   sudo nginx -t
   ```

8. Reload nginx, do not restart it:

   ```bash
   sudo systemctl reload nginx
   ```

Keep `MAIL_DRY_RUN=true` until the domain and Resend SMTP are ready. For Resend, set `SMTP_HOST=smtp.resend.com`, `SMTP_USERNAME=resend`, and `SMTP_PASSWORD` to a Resend API key. The sender domain in `CONTACT_FROM_EMAIL` must be verified in Resend.

For contact form bot protection, create a Cloudflare Turnstile widget for the
production hostname. Put the public `VITE_TURNSTILE_SITE_KEY` and matching private
`TURNSTILE_SECRET_KEY` in the root `.env` using `.env.example` as a template.
Non-production environments can leave both unset. Only the public key uses the
`VITE_` prefix and is embedded in frontend JavaScript.
