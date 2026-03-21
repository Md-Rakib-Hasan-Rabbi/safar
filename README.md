# Safar - Ride Sharing Web Application

Safar is a full-stack ride-sharing web app with a Node.js + Express backend and a static frontend powered by Tailwind CSS.

## Quick Start (for GitHub users)

### 1) Clone and install

```bash
git clone https://github.com/Md-Rakib-Hasan-Rabbi/safar.git
cd safar
npm install
npm --prefix ./apps/frontend install
```

### 2) Set up backend environment

Create this file:

`apps/backend/.env`

Use this content:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=safar
PORT=5000
```

### 3) Import database

Import SQL dump from:

`apps/backend/database/edU5Fsu.sql`

You can import using MySQL Workbench or CLI.

CLI example:

```bash
mysql -u root -p safar < apps/backend/database/edU5Fsu.sql
```

If `safar` database does not exist yet:

```sql
CREATE DATABASE safar;
```

### 4) Run the project

If MySQL is already running:

```bash
npm run dev
```

If MySQL is not running:

Terminal 1:

```bash
npm run db:start
```

Terminal 2:

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
- `npm run db:start` → Starts local MySQL server (Windows path configured)

## Project Structure

```text
safar/
├── apps/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── database/
│   │   ├── .env
│   │   └── server.js
│   └── frontend/
│       ├── src/
│       ├── img/
│       ├── Images/
│       ├── index.html
│       └── package.json
├── package.json
└── README.md
```

## Common Issues

### `EADDRINUSE: 5500` or `5000`

Another process is already using the port.

Close previous terminal sessions or stop the existing process, then run `npm run dev` again.

### `'C:\Program' is not recognized`

This is fixed in current scripts. Pull latest changes and run `npm install` again.

### MySQL `ibdata1 must be writable`

It usually means MySQL is already running and locking files.

In this case, do not run `npm run db:start`; run only `npm run dev`.

## Tech Stack

- Backend: Node.js, Express, MySQL
- Frontend: HTML, Tailwind CSS, JavaScript

## Contact

- Email: israqq2120@gmail.com
