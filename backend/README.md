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
BOT_INGEST_API_KEY=replace-with-a-long-bot-key
BOT_AUTO_PUBLISH_CONFIDENCE=0.82
CORS_ORIGIN=http://127.0.0.1:5173
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
| `GET` | `/api/admin/alerts` | Admin JWT | Full admin list. |
| `GET` | `/api/admin/alerts/pending` | Admin JWT | Alerts waiting for manual location triage. |
| `GET` | `/api/admin/alerts/review` | Admin JWT | Bot alerts waiting for editorial review. |
| `POST` | `/api/admin/alerts` | Admin JWT | Create manual alert. |
| `PATCH` | `/api/admin/alerts/:id` | Admin JWT | Update alert. |
| `PATCH` | `/api/admin/alerts/:id/publish-location` | Admin JWT | Publish a pending-location alert. |
| `PATCH` | `/api/admin/alerts/:id/review-status` | Admin JWT | Update review status. |
| `DELETE` | `/api/admin/alerts/:id` | Admin JWT | Delete alert. |
| `POST` | `/api/webhooks/bot-ingest` | `x-api-key` | Ingest automated source alerts. |

## Notes

- Admin routes expect `Authorization: Bearer <jwt>`.
- Bot ingest expects `x-api-key: <BOT_INGEST_API_KEY>`.
- `BOT_AUTO_PUBLISH_CONFIDENCE` controls whether bot alerts are published automatically or sent to review/pending-location queues.
- Descriptions should stay short; the schema is designed for editorial snippets, not copied full articles.
