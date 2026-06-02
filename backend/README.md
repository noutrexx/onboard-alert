# Onboard Alert Backend

Node.js, TypeScript, Express and PostgreSQL API for the live news/crisis map.

## Commands

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Run the migration in PostgreSQL:

```powershell
psql $env:DATABASE_URL -f database/migrations/001_create_alerts.sql
```

## Endpoints

- `GET /api/alerts` public published alerts for the map.
- `POST /api/admin/alerts` admin-created manual alert. Requires `Authorization: Bearer <jwt>`.
- `POST /api/webhooks/bot-ingest` bot ingestion endpoint. Requires `x-api-key`.
