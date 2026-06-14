# Onboard Alert Backend

Express, TypeScript, PostgreSQL, Zod, JWT, and rate-limited bot ingestion API for the Onboard Alert live news map.

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `.env` with your database URL and secrets:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/onboard_alert
JWT_SECRET=replace-with-a-strong-secret
ADMIN_PASSWORD_HASH=<scrypt-password-hash>
BOT_INGEST_API_KEY=replace-with-a-long-bot-key
BOT_AUTO_PUBLISH_CONFIDENCE=0.82
CORS_ORIGIN=http://127.0.0.1:5173
```

Generate the admin password hash:

```powershell
node -e "const {randomBytes,scryptSync}=require('crypto'); const password='replace-me'; const salt=randomBytes(16).toString('base64url'); console.log('scrypt$'+salt+'$'+scryptSync(password,salt,64).toString('base64url'))"
```

Run migrations in order:

```powershell
psql $env:DATABASE_URL -f database/migrations/001_create_alerts.sql
psql $env:DATABASE_URL -f database/migrations/002_source_url_snippet_model.sql
psql $env:DATABASE_URL -f database/migrations/003_pending_location_triage.sql
```

Run the API:

```powershell
npm run dev
```

## Checks

```powershell
npm run typecheck
npm run build
```

## Endpoints

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/alerts` | Public | Published map alerts. |
| `POST` | `/api/admin/auth/login` | Admin password | Create an HttpOnly admin session. |
| `GET` | `/api/admin/auth/session` | Admin session | Validate the current admin session. |
| `POST` | `/api/admin/auth/logout` | Public | Clear the admin session. |
| `GET` | `/api/admin/alerts` | Admin session | Full admin list. |
| `GET` | `/api/admin/alerts/pending` | Admin session | Alerts waiting for manual location triage. |
| `GET` | `/api/admin/alerts/review` | Admin session | Bot alerts waiting for editorial review. |
| `POST` | `/api/admin/alerts` | Admin session | Create manual alert. |
| `PATCH` | `/api/admin/alerts/:id` | Admin session | Update alert. |
| `PATCH` | `/api/admin/alerts/:id/publish-location` | Admin session | Publish a pending-location alert. |
| `PATCH` | `/api/admin/alerts/:id/review-status` | Admin session | Update review status. |
| `DELETE` | `/api/admin/alerts/:id` | Admin session | Delete alert. |
| `POST` | `/api/webhooks/bot-ingest` | `x-api-key` | Ingest automated source alerts. |

## Notes

- Admin routes require the signed `HttpOnly`, `SameSite=Strict` session cookie created by `/api/admin/auth/login`.
- Bot ingest expects `x-api-key: <BOT_INGEST_API_KEY>`.
- `BOT_AUTO_PUBLISH_CONFIDENCE` controls whether bot alerts are published automatically or sent to review/pending-location queues.
- Descriptions should stay short; the schema is designed for editorial snippets, not copied full articles.
