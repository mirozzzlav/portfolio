# Portfolio

Jednoduché osobné portfolio pre programátora alebo tvorcu digitálneho contentu.

Projekt je postavený na Reacte, Vite, React Routeri a Emotion. Lokalizovaný obsah je oddelený v `src/content/sk.json` a `src/content/en.json`.

Tagy projektov v poli `technologies` podporujú text alebo objekt s voliteľnou ikonou:

```json
"technologies": [
  { "label": "React", "icon": "react" },
  { "label": "REST API", "icon": "api" },
  { "label": "Tag bez ikony" },
  "Pôvodný textový tag"
]
```

Podporované ikony: `python`, `fastapi`, `docker`, `react`, `chakra-ui`, `go`,
`gin`, `api`, `page` a `tag`. Vynechaná alebo prázdna ikona zobrazí iba text.
Textové tagy a neznáme názvy ikon používajú všeobecnú ikonu štítku.
Jednofarebné logá technológií pochádzajú zo [Simple Icons](https://github.com/simple-icons/simple-icons)
(CC0) a sú uložené priamo v projekte.

V odsekoch `about.paragraphs`, popisoch projektov `description` a odrážkach
`features` sa dajú pridávať odkazy zápisom `[text odkazu](adresa)`, napríklad:

```json
"Moje práce si môžete pozrieť v [projektoch](/projects)."
"Vyskúšajte [demo](https://archive.wondercules.com)."
```

Interné adresy začínajú `/` a automaticky sa prispôsobia aktuálnemu jazyku.
Podporované sú aj odkazy `https://`, `http://`, `mailto:`, `tel:` a kotvy `#`.
Jeden text môže obsahovať viac odkazov; ostatný text sa zobrazuje bez zmeny.
Ide o jednoduchý zápis odkazov, nie o podporu celého Markdownu alebo HTML.

Importy v aplikácii používajú alias `src/`, napríklad
`import { Button } from "src/components/Button.jsx"`. Alias je nastavený vo Vite
a v `jsconfig.json` pre podporu v IDE. Súbory načítavané priamo cez Node.js
(konfigurácia, testy, prerender a zdieľané moduly pre obsah, routy a SEO) používajú
relatívne importy, pretože Node.js aliasy z Vite nevyhodnocuje.

## Spustenie lokálne

```bash
npm run dev
```

Vite vypíše lokálnu adresu, štandardne:

```text
http://localhost:5173
```

## Kontrola kódu

```bash
npm run lint
npm run format:check
npm test
```

Produkčný build:

```bash
npm run build
```

Lokálny vývoj aj produkčný build používajú koreňový `.env` podľa `.env.example`.
Samostatný produkčný env súbor nie je potrebný. Premenné s prefixom `VITE_`
sú verejné a vložia sa do frontendu pri zostavení.

Doménu nastav raz cez `DOMAIN_NAME=mirofurinda.com`. `SITE_URL`, kontaktné
e-mailové adresy a povolené origins sa v `.env` odvodia pomocou `${DOMAIN_NAME}`
a `${SITE_URL}`. Vzor povoľuje aj lokálny web; v produkcii môže byť
`CONTACT_ALLOWED_ORIGINS=${SITE_URL}`.

## Docker Compose

Frontend aj API sa zostavia a spustia cez Docker Compose:

```bash
cp .env.example .env
docker compose up -d --build
```

Ak už `.env` existuje, ponechaj ho a doplň potrebné hodnoty podľa `.env.example`.
Pri prechode zo staršieho nastavenia presuň hodnoty z `api/.env` do koreňového
`.env`; `api/.env` sa už nepoužíva. Web bude dostupný na `http://localhost:8080`. Lokálny príklad
má odosielanie e-mailov vypnuté cez `MAIL_DRY_RUN=true`.

Caddy obsluhuje zostavené React stránky a presmeruje `/api/*` na samostatný
FastAPI kontajner. API nemá publikovaný port. Node.js sa používa iba pri builde.
Docker publikuje iba HTTP na `127.0.0.1:8080`; doménu, HTTPS a certifikáty
spravuje Nginx na hostiteľovi.

Nastavenie Nginx proxy a produkčného formulára je v
[deploy/README.md](deploy/README.md#docker-compose-s-caddy).

## Lokálny projektový kontext

Detailný pracovný brief je uložený v:

```text
.project-context/PROJECT_BRIEF.md
```

Tento priečinok je zámerne ignorovaný Gitom. Pri novom chate alebo ďalšej práci v tomto workspaci si najprv prečítaj tento súbor a použi ho ako hlavný kontext projektu.
