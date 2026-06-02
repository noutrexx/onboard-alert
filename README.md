# Onboard Alert

<p align="center">

</p>

<p align="center">
  <strong>Live News & Crisis Map with Admin Triage, Bot Ingestion, and Copyright-Safe Source Embeds</strong>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Leaflet" src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-TypeScript-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Ready-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

## Overview

Onboard Alert is a full-stack live news and crisis mapping platform. It displays location-based breaking news on an interactive map, gives editors a professional admin dashboard, and supports hybrid data ingestion from both manual admin entries and automated bots or scrapers.

The project is designed for modern news workflows:

- Public users see a clean, map-first experience.
- Editors can add, edit, reject, or publish stories from an admin panel.
- Bots can ingest alerts through a protected webhook.
- Alerts with missing coordinates are held in a triage queue instead of being placed incorrectly on the map.
- Full article content and media are not copied into the database. The app stores a short snippet and renders original Twitter/X posts via embed or links users to the source.

## Features

- Full-screen dark Leaflet map focused on Turkey.
- Glassmorphism collapsible left news sidebar.
- Smooth Framer Motion panel transitions.
- Custom hidden scrollbar for a cleaner map experience.
- Keyboard shortcuts: `M` toggles the feed, `Esc` closes it.
- Unread ping badge when new items arrive while the feed is closed.
- Alert markers with pulse animation and severity color indicators.
- Copyright-safe source rendering:
  - Twitter/X URLs render as embedded posts.
  - Other links render as compact "Original News" source cards.
- Admin dashboard with:
  - News table
  - Create/edit forms
  - Mini Leaflet location picker
  - LocalStorage mock API layer for frontend development
- Bot triage workflow:
  - Missing coordinates become `pending_location`
  - Admin reviews pending alerts
  - Admin assigns location on a mini map
  - Admin publishes or rejects the record
- Node.js TypeScript backend scaffold with:
  - Express REST API
  - Zod validation
  - JWT admin middleware
  - API key protected bot webhook
  - PostgreSQL migrations
  - Mock geocoding service

## Screenshots

> Create your own screenshots and save them in `docs/screenshots/` using these file names:
> `map.png`, `sidebar.png`, and `admin.png`.

### Main Map

![Main Map](docs/screenshots/map.png)

### News Sidebar

![News Sidebar](docs/screenshots/sidebar.png)

### Admin Dashboard

![Admin Dashboard](docs/screenshots/admin.png)

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

## Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/noutrexx/onboard_alert.git
cd onboard_alert
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

The frontend runs at:

```txt
http://127.0.0.1:5173
```

Routes:

```txt
/        Public live map
/admin   Admin dashboard
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Configure backend environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Required backend variables:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/onboard_alert
JWT_SECRET=change-this-admin-secret
BOT_INGEST_API_KEY=change-this-bot-key
BOT_AUTO_PUBLISH_CONFIDENCE=0.82
CORS_ORIGIN=http://127.0.0.1:5173
```

### 6. Run PostgreSQL migrations

```bash
psql "$DATABASE_URL" -f database/migrations/001_create_alerts.sql
psql "$DATABASE_URL" -f database/migrations/002_source_url_snippet_model.sql
psql "$DATABASE_URL" -f database/migrations/003_pending_location_triage.sql
```

### 7. Run the backend

```bash
npm run dev
```

The backend runs at:

```txt
http://localhost:4000
```

## API Overview

```txt
GET    /api/alerts
POST   /api/admin/alerts
GET    /api/admin/alerts/pending
PATCH  /api/admin/alerts/:id/publish-location
DELETE /api/admin/alerts/:id
POST   /api/webhooks/bot-ingest
```

## Bot Ingestion Workflow

Bots send alerts to:

```txt
POST /api/webhooks/bot-ingest
```

If coordinates are present, the alert can be published or sent to review depending on confidence. If coordinates are missing or cannot be geocoded, the backend stores the alert as:

```txt
status = pending_location
```

Editors then open the admin triage queue, assign the correct map location, and publish the alert.

## Copyright-Safe Content Model

Onboard Alert intentionally avoids storing full article text, copied images, or videos.

The database stores:

- A short editorial snippet
- Location data
- Severity/category metadata
- The original `source_url`

The frontend either embeds the original Twitter/X post or redirects users to the original publisher.

## Development Checks

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

## Screenshots Note

The `docs/screenshots/` folder is included for portfolio assets. Add:

```txt
docs/screenshots/map.png
docs/screenshots/sidebar.png
docs/screenshots/admin.png
```

## License

This project is intended for portfolio and product-prototype use. Add your preferred license before public production use.
