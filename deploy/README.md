# Nasadenie cez Docker Compose

Jeden kontajner `web` spúšťa FastAPI cez Uvicorn. Obsluhuje kontaktné API,
statické súbory a prerenderované React stránky. Node.js sa používa iba pri builde.
API cesty majú prednosť pred frontendovým fallbackom; neznáme `/api/*` a chýbajúce
statické súbory vracajú `404`. Healthcheck používa `/health`.

## Nastavenie

Ak koreňový `.env` ešte neexistuje, vytvor ho podľa `.env.example`:

```bash
cp .env.example .env
```

Existujúci `.env` zachovaj a doplň iba chýbajúce nastavenia. Pri prechode zo
staršieho nastavenia presuň hodnoty z `api/.env` do koreňového `.env`.
Skutočné env súbory nepatria do Gitu a sú vylúčené z Docker build kontextu.

Doménu nastav raz cez `DOMAIN_NAME`; verejná URL a kontaktné adresy sa z nej
odvodia. `SITE_URL` sa používa pri generovaní SEO odkazov a sitemap súboru.
`HTTP_PORT` určuje port dostupný iba na loopback rozhraní hostiteľa. Na aktuálnom
VPS používaj `HTTP_PORT=8081`, pretože `8080` už používa iná aplikácia.

Pre produkčný formulár nastav:

- `CONTACT_ALLOWED_ORIGINS=${SITE_URL}`.
- `CONTACT_TO_EMAIL` a `CONTACT_FROM_EMAIL` podľa overenej odosielateľskej domény.
- SMTP prístupové údaje; pre Resend použi `smtp.resend.com`, port `465`, používateľa
  `resend` a Resend API kľúč ako `SMTP_PASSWORD`.
- Verejný `VITE_TURNSTILE_SITE_KEY` a súkromný `TURNSTILE_SECRET_KEY`, ak chceš
  Turnstile ochranu. Bez nej nechaj oba prázdne.

Kým nie je SMTP pripravené, zachovaj `MAIL_DRY_RUN=true`. Potom ho nastav na `false`.
Iba premenné s prefixom `VITE_` sa vkladajú do verejného frontendu.

## Spustenie a aktualizácia

Z koreňa checkoutu s požadovaným publikovaným commitom:

```bash
docker compose up -d --build --remove-orphans
docker compose ps
docker compose logs --tail=100 web
```

Pri prechode z dvoch kontajnerov `--remove-orphans` odstráni starú Compose službu
`api`; frontend aj API potom bežia v `web`. Ostatných Compose projektov sa netýka.
Zmeny `SITE_URL` alebo verejného Turnstile kľúča vyžadujú nový build. Zmeny API
nastavení aplikuje opätovné `up`; samotný `restart` env hodnoty neobnoví.

Pre aktuálny VPS over:

```bash
curl -I http://127.0.0.1:8081/en/projects
curl -i http://127.0.0.1:8081/health
curl -i http://127.0.0.1:8081/api/contact
```

Frontend aj health endpoint vracajú `200`. GET na `/api/contact` má vrátiť `405`,
pretože kontaktný endpoint prijíma POST; tento test neodosiela e-mail.
Pri lokálnom nastavení s predvoleným portom použi namiesto `8081` port `8080`.

Zastavenie:

```bash
docker compose down
```
