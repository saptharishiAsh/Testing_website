# Rishi Mart test store

A static storefront with a local Node email API for UI, API, checkout and integration testing.

## Run the site and email API

1. Create a free Resend account at https://resend.com and create an API key.
2. Start the server with your key in the shell:

```bash
RESEND_API_KEY=re_your_key_here EMAIL_FROM="Rishi Mart <onboarding@resend.dev>" npm start
```

3. Open http://localhost:8000.

The API is available at:

- `GET /api/health`
- `POST /api/send-order-email`

The payment flow accepts any 12 to 19 digit card number for test practice. A successful order sends an email through Resend when `RESEND_API_KEY` is configured. Without the key, the backend returns a local mock response so the UI and automation tests still work.

For production recipients, configure a verified sending domain and set `EMAIL_FROM` to an address on that domain. Never commit API keys; `.env` is ignored by Git.
