# Deployment Notes

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
/var/www/html/portfolio/api/.env
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

   The script pulls the current branch, installs Node dependencies when package files changed, builds the frontend, prepares the API virtualenv, and restarts `portfolio-api` when permitted.

3. Or build the frontend manually:

   ```bash
   npm ci
   npm run build
   ```

4. Create the API virtualenv:

   ```bash
   cd api
   python3 -m venv .venv
   .venv/bin/pip install -e .
   ```

5. Create `api/.env` from `deploy/portfolio-api.env.example` and edit the SMTP values:

   ```bash
   cp deploy/portfolio-api.env.example api/.env
   nano api/.env
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

Keep `MAIL_DRY_RUN=true` until the domain and Cloudflare Email Sending SMTP are ready.
