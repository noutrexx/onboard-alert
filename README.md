# Onboard Alert

<p align="center">
  <strong>Live News & Crisis Map Platform</strong><br />
  Interactive map UI, editorial admin dashboard, bot ingestion, and triage workflow.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Leaflet" src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-TypeScript-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Ready-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

<p align="center">
  <img src="docs/screenshots/map.png" alt="Onboard Alert full-screen map" width="100%" />
</p>

## Overview

Onboard Alert is a full-stack, map-first news operations platform. It visualizes location-based alerts on a live dark-mode map, gives editors a professional dashboard for manual publishing, and prepares the system for automated bot/scraper ingestion.

The architecture is built around a hybrid editorial workflow: trusted admin entries can go live immediately, while bot-generated items with missing or uncertain location data are routed into a triage queue. Editors can then review the item, assign a location from an interactive map, and publish or reject it.

To stay copyright-safe, the project stores only short snippets and source links. Full media and article content remain with the original publisher. Twitter/X links can be embedded directly, while other links are presented as polished source cards.

## Highlights

- Full-screen Leaflet map focused on Turkey
- Pulse animated alert markers with severity indicators
- Collapsible glassmorphism news feed pinned to the left side
- Smooth Framer Motion sidebar transitions
- Hidden custom scrollbar for a cleaner map experience
- Keyboard shortcuts: `M` toggles the feed, `Esc` closes it
- Unread ping badge when new items arrive while the feed is closed
- Copyright-safe source rendering with `react-tweet`
- Admin dashboard for managing news records
- Mini-map location picker for manual entries
- Bot triage queue for alerts waiting for location approval
- Node.js TypeScript backend with PostgreSQL migrations
- Zod validation, JWT admin guard, and API-key-protected bot webhook

## Screenshots

### News Feed Sidebar

![News Sidebar](docs/screenshots/sidebar.png)

### Admin Dashboard

![Admin Dashboard](docs/screenshots/admin.png)

## Product Flow

```txt
Bot / Admin input
      |
      v
Unified alert schema
      |
      +-- Published with coordinates ------> Public live map
      |
      +-- Missing location ----------------> Admin triage queue
                                               |
                                               v
                                      Assign location & publish
```

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- React Leaflet / Leaflet
- Framer Motion
- Lucide React
- React Tweet

### Backend

- Node.js
- TypeScript
- Express
- PostgreSQL
- Zod
- JWT
- pg
- Helmet / CORS / Morgan

## Project Structure

```txt
onboard-alert/
  src/
    components/
      admin/
      AlertMarker.jsx
      LiveMap.jsx
      NewsFeedSidebar.jsx
      SourceEmbedder.jsx
    context/
    data/
    pages/
      admin/
      HomePage.jsx
    services/
    utils/
  backend/
    database/
      migrations/
    src/
      config/
      controllers/
      db/
      middleware/
      models/
      repositories/
      routes/
      schemas/
      services/
  docs/
    screenshots/
```

## Installation

### Clone

```bash
git clone https://github.com/noutrexx/onboard_alert.git
cd onboard_alert
```

### Frontend

```bash
npm install
npm run dev
```

Frontend routes:

```txt
http://127.0.0.1:5173/        Public live map
http://127.0.0.1:5173/admin   Admin dashboard
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs at:

```txt
http://localhost:4000
```

## Environment

Create `backend/.env`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/onboard_alert
JWT_SECRET=change-this-admin-secret
BOT_INGEST_API_KEY=change-this-bot-key
BOT_AUTO_PUBLISH_CONFIDENCE=0.82
CORS_ORIGIN=http://127.0.0.1:5173
```

## Database Migrations

```bash
cd backend
psql "$DATABASE_URL" -f database/migrations/001_create_alerts.sql
psql "$DATABASE_URL" -f database/migrations/002_source_url_snippet_model.sql
psql "$DATABASE_URL" -f database/migrations/003_pending_location_triage.sql
```

## API

```txt
GET    /api/alerts
POST   /api/admin/alerts
GET    /api/admin/alerts/pending
PATCH  /api/admin/alerts/:id/publish-location
DELETE /api/admin/alerts/:id
POST   /api/webhooks/bot-ingest
```

## Bot Triage Workflow

Bots submit alerts through:

```txt
POST /api/webhooks/bot-ingest
```

If coordinates are available, the alert can be published depending on confidence. If coordinates are missing or geocoding fails, the record is saved as:

```txt
status = pending_location
```

Editors then review the pending alert, choose the correct location on a mini map, and publish it.

## Copyright-Safe Content Model

Onboard Alert avoids storing copied article text, images, or videos. The system stores:

- Short editorial snippet
- Location and category metadata
- Severity/status information
- Original `source_url`

The public UI either embeds the original Twitter/X post or links the user back to the original publisher.

## Quality Checks

Frontend:

```bash
npm run build
npm run lint
```

Backend:

```bash
cd backend
npm run build
```

## Repository

```txt
https://github.com/noutrexx/onboard_alert.git
```

## License

Portfolio prototype. Add a production license before commercial deployment.
