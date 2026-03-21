# Safar - Ride Sharing Web Application

Safar is a full-stack ride-sharing web app with a Node.js + Express backend and a static frontend powered by Tailwind CSS.

## Quick Start

### 1) Clone and install

```bash
git clone https://github.com/Md-Rakib-Hasan-Rabbi/safar.git
cd safar
npm install
npm --prefix ./apps/frontend install
```

### 2) Set up backend environment

Create `apps/backend/.env`:

```env
PORT=5000
DB_FILE=apps/backend/database/safar.sqlite
```

### 3) Initialize database (SQLite)

```bash
npm run db:update
```

This creates and seeds `apps/backend/database/safar.sqlite`.

### 4) Run app

```bash
npm run dev
```

### 5) Open in browser

- Frontend: http://127.0.0.1:5500/index.html
- Backend health: http://localhost:5000/

## Available Scripts

- `npm run dev` → Starts backend + frontend static server + Tailwind watcher (quiet mode)
- `npm run dev:verbose` → Same as above with full logs
- `npm run start` → Starts backend only
- `npm run db:setup` → Creates SQLite schema + seed data if missing
- `npm run db:update` → Rebuilds SQLite database with fresh seed data

## Seed Users

- Rider: `seed.rider@safar.app` / `rider123`
- Driver: `seed.driver@safar.app` / `driver123`
- Admin: `seed.admin@safar.app` / `admin123`
- Rider: `seed.rider2@safar.app` / `rider123`
- Driver: `seed.driver2@safar.app` / `driver123`
- Admin: `seed.admin2@safar.app` / `admin123`

## Tech Stack

- Backend: Node.js, Express, SQLite
- Frontend: HTML, Tailwind CSS, JavaScript
