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

## Lightbox

`Lightbox` má vlastné tlačidlá a predvolené štýly. Nepotrebuje prekladový provider
ani globálne CSS premenné aplikácie. Voliteľný `translate` dostáva anglický text;
bez neho sa text zobrazí nezmenený. `ImageWrapper` dostáva iba `<img>` cez `children`
a určuje vzhľad rámčeka jedného obrázka.

```jsx
<Lightbox
  images={[{ src: "/photo.webp", alt: "Popis fotografie" }]}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  theme={{
    "--lightbox-text-color": "#111",
    "--lightbox-spacing": "12px"
  }}
/>
```

`theme` prepíše iba zadané CSS premenné na koreňovom elemente lightboxu vrátane
obsahu renderovaného cez portal. Všetky predvolené hodnoty sú v
[`src/components/lightbox/theme.js`](src/components/lightbox/theme.js).
Téma obsahuje aj radius a prechod tlačidiel, disabled opacity, rozmery focus
outline a blur pozadia. Premenné `--blur-loaded-image-blur` a
`--blur-loaded-image-transition` nastavené cez `theme` upravujú rozmazanie náhľadu
a prechod obrázka.
Projektový `ProjectPreviewFrame` má vlastné štýly nezávislé od témy lightboxu.
Technickými závislosťami zostávajú React, Emotion a pomocné moduly v repozitári.

## Spustenie lokálne

```bash
cp .env.example .env
npm ci
npm run dev
```

Vite vypíše lokálnu adresu, štandardne:

```text
http://localhost:8080
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

Portfolio je samostatný statický frontend. `npm run build` vytvorí HTML,
JavaScript, CSS a médiá v `dist/`; SSR bundle slúži iba na prerenderovanie
pri builde a následne sa odstráni. Produkcia nepotrebuje Node.js ani Python.

- `SITE_URL=https://mirofurinda.com` určuje kanonické SEO URL a sitemap.
- `VITE_CONTACT_API_URL=https://contact-api.wondercules.com` je úplná cieľová
  URL formulára, bez pridávania `/api/contact` alebo `/contact`.
- `VITE_TURNSTILE_SITE_KEY` je existujúci verejný kľúč z `.env.example`.

Formulár posiela JSON priamo do spoločného API: `name`, `email`, `message`,
`company` (honeypot) a pri zapnutom Turnstile `turnstileToken`. Token sa resetuje
po každom pokuse vrátane chybových stavov. Po úspechu sa vyprázdni formulár.
SMTP, Turnstile secret, príjemca a odosielateľ patria výhradne do spoločného API;
nevkladaj ich do frontendových env súborov. Lokálny origin musí byť povolený
v spoločnom API; frontend nemá vlastný proxy ani API. Produkčný CORS musí povoliť
`https://mirofurinda.com`, metódu POST a hlavičku Content-Type.

Zmena build premenných vyžaduje nový build aj nasadenie. Postup nasadenia
statických súborov cez Caddy je v [deploy/README.md](deploy/README.md).

## Lokálny projektový kontext

Detailný pracovný brief je uložený v:

```text
.project-context/PROJECT_BRIEF.md
```

Tento priečinok je zámerne ignorovaný Gitom. Pri novom chate alebo ďalšej práci v tomto workspaci si najprv prečítaj tento súbor a použi ho ako hlavný kontext projektu.
