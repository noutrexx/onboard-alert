# Onboard Alert

<div align="center">
  <img src="assets/banner.svg" alt="Onboard Alert" width="100%" />
</div>

Location-aware crisis and live news monitoring platform for Turkey. Onboard Alert combines an interactive Leaflet map, a real-time style news feed, admin triage screens, and an Express/PostgreSQL API for verified alert publishing.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-111827?style=for-the-badge&logo=express&logoColor=white)

![Onboard Alert full map](docs/screenshots/home-map-full.png)

## Highlights

- Full-screen Turkey map with clustered alert markers and multiple tile modes.
- Collapsible live news feed with source cards, keyboard shortcuts, and alert focus.
- Admin panel for manual alert creation, editing, deletion, and pending-location triage.
- Local demo mode for zero-backend previews.
- Backend mode with Express, PostgreSQL, JWT-protected admin routes, and bot ingest endpoint.
- Clear data-mode indicator so operators can see whether the UI is using Local Demo, Public API, or Admin API mode.

## Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Leaflet, Framer Motion |
| Backend | Node.js, TypeScript, Express, PostgreSQL, Zod, JWT |
| Mapping | Leaflet, React Leaflet, marker clustering, CARTO/OpenStreetMap tiles |
| Media / Assets | SVG icons, screenshot documentation |
| Quality | ESLint, TypeScript checks, production build verification |

## Architecture

```mermaid
flowchart LR
    SRC[onboard-feeder<br/>RSS / news signals] -->|signed webhook| API

    subgraph BE["Express + PostgreSQL API"]
        direction TB
        API[Alert API<br/>Zod validation] --> GEO[Geocoding service]
        API --> DB[(PostgreSQL<br/>alerts)]
        ADMIN[Admin routes<br/>JWT auth] --> DB
    end

    DB --> PUB[/Public API/]
    PUB --> FE

    subgraph FE["React + Vite Frontend"]
        direction TB
        MAP[Leaflet map<br/>clustered markers]
        FEED[Live news feed]
        ADMINUI[Admin triage UI] --> ADMIN
    end
```

## Screenshots

### Live Map

![Live map](docs/screenshots/map.png)

### News Feed

![News sidebar](docs/screenshots/sidebar.png)

### Admin Panel

![Admin dashboard](docs/screenshots/admin.png)

## Project Structure

```txt
onboard-alert/
├─ src/                    # React frontend
│  ├─ components/          # Map, feed, controls, admin UI
│  ├─ context/             # Alert provider and shared state
│  ├─ data/                # Demo alerts and static metadata
│  ├─ pages/               # Home and admin routes
│  └─ services/            # API/local-storage data adapter
├─ backend/                # Express + PostgreSQL API
│  ├─ database/migrations/ # SQL schema migrations
│  └─ src/                 # Controllers, routes, services, repositories
├─ docs/screenshots/       # README screenshots
└─ public/                 # Static icons
```

## Frontend Setup

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Open:

```txt
http://127.0.0.1:5173/
http://127.0.0.1:5173/admin
```

Run checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Data Modes

The frontend automatically selects a data mode from environment variables.

| Mode | When it is used | Behavior |
| --- | --- | --- |
| Local Demo | `VITE_API_BASE_URL` is not set | Reads and writes demo alerts in browser `localStorage`. |
| Public API | `VITE_API_BASE_URL` is set, `VITE_ADMIN_TOKEN` is not set | Reads published alerts from the backend. |
| Admin API | `VITE_API_BASE_URL` and `VITE_ADMIN_TOKEN` are set | Reads and manages admin alert records through protected backend routes. |

Create a frontend `.env.local` only when connecting to the backend:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_ADMIN_TOKEN=<jwt-token-for-development>
```

> For production, do not ship a long-lived admin token in the browser bundle. Add a real login/session flow before exposing admin routes publicly.

## Backend Setup

Install backend dependencies:

```bash
cd backend
npm install
Copy-Item .env.example .env
```

Update `backend/.env`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/onboard_alert
JWT_SECRET=replace-with-a-strong-secret
BOT_INGEST_API_KEY=replace-with-a-long-bot-key
BOT_AUTO_PUBLISH_CONFIDENCE=0.82
CORS_ORIGIN=http://127.0.0.1:5173
```

Run all migrations in order:

```bash
psql $DATABASE_URL -f database/migrations/001_create_alerts.sql
psql $DATABASE_URL -f database/migrations/002_source_url_snippet_model.sql
psql $DATABASE_URL -f database/migrations/003_pending_location_triage.sql
```

On PowerShell:

```powershell
psql $env:DATABASE_URL -f database/migrations/001_create_alerts.sql
psql $env:DATABASE_URL -f database/migrations/002_source_url_snippet_model.sql
psql $env:DATABASE_URL -f database/migrations/003_pending_location_triage.sql
```

Run the backend:

```bash
npm run dev
```

The API runs on:

```txt
http://localhost:4000
```

## API Overview

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/alerts` | Public | Published map alerts. |
| `GET` | `/api/admin/alerts` | Admin JWT | Full admin alert list. |
| `GET` | `/api/admin/alerts/pending` | Admin JWT | Alerts waiting for location triage. |
| `POST` | `/api/admin/alerts` | Admin JWT | Create manual alert. |
| `PATCH` | `/api/admin/alerts/:id` | Admin JWT | Update manual alert. |
| `PATCH` | `/api/admin/alerts/:id/publish-location` | Admin JWT | Approve a pending alert location. |
| `DELETE` | `/api/admin/alerts/:id` | Admin JWT | Delete alert. |
| `POST` | `/api/webhooks/bot-ingest` | Bot API key | Ingest automated source alerts. |

Example bot ingest request:

```bash
curl -X POST http://localhost:4000/api/webhooks/bot-ingest \
  -H "Content-Type: application/json" \
  -H "x-api-key: <BOT_INGEST_API_KEY>" \
  -d '{
    "title": "Istanbul Bogaz hattinda yogunluk",
    "description": "Kisa haber ozeti veya editor snippet metni.",
    "sourceUrl": "https://example.com/news/123",
    "locationText": "Istanbul",
    "severity": "yellow",
    "confidence": 0.74
  }'
```

## Production Checklist

- Replace browser-injected admin token with a login/session based admin flow.
- Use strong secrets for `JWT_SECRET` and `BOT_INGEST_API_KEY`.
- Run all migrations during deployment.
- Set `CORS_ORIGIN` to the deployed frontend origin.
- Add monitoring for bot ingest failures, API errors, and pending-location backlog.
- Keep source snippets short; do not store full copied articles or copyrighted media.

## GitHub Language Hygiene

The repository uses `.gitattributes` to keep generated assets, screenshots, package locks, and SQL migrations from polluting GitHub language stats. The language bar should focus on the actual application source instead of noisy `Other` entries.
