# Onboard Alert

Live news and crisis map platform for tracking location-based alerts on an interactive Turkey map.

![Onboard Alert map](docs/screenshots/map.png)

## Features

- Full-screen Leaflet map with clustered alert markers
- Collapsible live news sidebar
- Admin panel for adding and editing alerts
- Mini-map location picker for manual entries
- Source cards for external news links
- TypeScript React frontend with Vite
- Node.js TypeScript backend

## Screenshots

### News Feed

![News Sidebar](docs/screenshots/sidebar.png)

### Admin Panel

![Admin Dashboard](docs/screenshots/admin.png)

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Leaflet

**Backend:** Node.js, TypeScript, Express, PostgreSQL

## Getting Started

Install frontend dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Useful routes:

```txt
http://127.0.0.1:5173/
http://127.0.0.1:5173/admin
```

Run checks:

```bash
npm run typecheck
npm run build
```

## Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:4000`.
