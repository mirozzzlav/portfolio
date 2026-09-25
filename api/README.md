# Portfolio API

Small FastAPI service for the portfolio contact form. It sends email through a generic SMTP client (`aiosmtplib`) and can be configured for Resend SMTP.

## Local setup

```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -e .
cp .env.example .env
```

Fill `.env` with real values. Do not commit `.env`.

For local development without a real SMTP account or domain, keep:

```env
MAIL_DRY_RUN=true
```

With dry run enabled, contact requests validate successfully and print email metadata to the API logs instead of sending mail.

Run the API:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001 --env-file .env
```

Health check:

```bash
curl http://127.0.0.1:8001/health
```

Send a test contact request:

```bash
curl -X POST http://127.0.0.1:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Ahoj"}'
```

## Resend SMTP

Use these SMTP values:

- `SMTP_HOST=smtp.resend.com`
- `SMTP_PORT=465`
- `SMTP_USERNAME=resend`
- `SMTP_PASSWORD=<Resend API key>`
- `SMTP_USE_TLS=true`

Resend SMTP uses implicit TLS on port `465`. The sender domain from `CONTACT_FROM_EMAIL` must be verified in Resend.

For production email delivery, set:

```env
MAIL_DRY_RUN=false
```

Recommended contact setup:

```env
CONTACT_TO_EMAIL=info@example.com
CONTACT_FROM_EMAIL=Portfolio <noreply@example.com>
```

Incoming form messages are delivered to `info@...`, while replies go to the visitor email through the `Reply-To` header.
