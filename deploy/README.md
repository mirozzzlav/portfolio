# Statické nasadenie na mirofurinda.com

Caddy na VPS `wondercules.com` obsluhuje `/var/www/html/mirofurinda.com`.
`www.mirofurinda.com` presmerúva na hlavnú doménu. Projekt nemá vlastné API,
Docker ani produkčný Node.js proces. Existujúcu konfiguráciu Caddy, spoločného
API a ostatných webov pri nasadení nemeň.

## Príprava

Koreňový `.env` obsahuje iba hodnoty z `.env.example`: `SITE_URL`,
`VITE_CONTACT_API_URL=https://contact-api.wondercules.com` a existujúci verejný
`VITE_TURNSTILE_SITE_KEY`. Žiadne SMTP údaje, Turnstile secret ani adresy
príjemcu a odosielateľa sem nepatria. Zmena env vyžaduje nový build.

Pred nasadením over dostupnosť webu a CORS:

```bash
curl -I https://mirofurinda.com
curl -i -X OPTIONS https://contact-api.wondercules.com \
  -H 'Origin: https://mirofurinda.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
```

Preflight má vrátiť 200 a `Access-Control-Allow-Origin: https://mirofurinda.com`.
Spoločný kontajner `contact-api` spravuje formuláre samostatne. Frontend posiela
JSON priamo na jeho základnú URL, bez ďalšej cesty. Turnstile používa akciu
`contact`; úspech vyžaduje HTTP úspech aj JSON `{"ok":true}`.

## Build, záloha a kopírovanie

```bash
npm ci
npm run check
npm test
npm run build
```

Prenášaj iba obsah `dist/`. Priečinok obsahuje hotové statické stránky vrátane
jazykových ciest, assets, sitemap a robots; serverový bundle sa po prerenderi
odstráni. `.env`, zdroje a zálohy nepatria do verejného adresára.

Príklad s oprávnením sudo na VPS (vyžaduje rsync na oboch stranách):

```bash
release_id=$(date -u +%Y%m%dT%H%M%SZ)
ssh wondercules.com "mkdir -p /home/miro/portfolio-static-$release_id /home/miro/backups"
rsync -a dist/ "wondercules.com:/home/miro/portfolio-static-$release_id/"
ssh -t wondercules.com "sudo cp -a /var/www/html/mirofurinda.com /home/miro/backups/portfolio-$release_id && sudo rsync -a --chmod=D755,F644 /home/miro/portfolio-static-$release_id/ /var/www/html/mirofurinda.com/"
```

Najprv vytvor úplnú zálohu; ak zlyhá, nenasadzuj. Cieľový adresár zachovaj.
Kopírovanie bez `--delete` ponechá staré hashované assets pre otvorené karty.
Po overení odstráň iba dočasný staging, zálohu ponechaj mimo webrootu.
Nie je potrebný reload Caddy ani reštart spoločného API.

## Overenie a návrat

Over HTTP 200 pre `/`, `/contact`, `/en/contact`, `/projects`,
`/en/projects`, `/sitemap.xml` a `/robots.txt`. Stiahni JavaScript odkazovaný
verejnou stránkou a over, že obsahuje základnú URL spoločného API a verejný
Turnstile kľúč. Form action na kontaktných stránkach musí ukazovať na rovnakú URL.
Opakuj CORS preflight. Samotný build a preflight nepotvrdzujú doručenie e-mailu;
to vyžaduje skutočné overenie Turnstile v prehliadači a odoslanie formulára.

Pri návrate obnov obsah zálohy do rovnakého statického adresára, napríklad
`sudo rsync -a --delete /home/miro/backups/portfolio-<release_id>/ /var/www/html/mirofurinda.com/`.
Zálohu pred obnovou skontroluj. Ostatných webov ani spoločného API sa obnova netýka.
