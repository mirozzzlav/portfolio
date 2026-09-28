# Portfolio

Jednoduché osobné portfolio pre programátora alebo tvorcu digitálneho contentu.

Projekt je postavený na Reacte, Vite, React Routeri a Emotion. Lokalizovaný obsah je oddelený v `src/content/sk.json` a `src/content/en.json`.

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

## Lokálny projektový kontext

Detailný pracovný brief je uložený v:

```text
.project-context/PROJECT_BRIEF.md
```

Tento priečinok je zámerne ignorovaný Gitom. Pri novom chate alebo ďalšej práci v tomto workspaci si najprv prečítaj tento súbor a použi ho ako hlavný kontext projektu.
