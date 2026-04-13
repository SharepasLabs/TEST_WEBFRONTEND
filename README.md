# Hello World — React (Vite) + Express

Minimal full-stack hello world app.

## Project Structure

```
WEB_FRONTEND/
├── client/          # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── App.css
├── server/          # Express backend
│   └── index.js
├── dist/            # Production build (generated)
├── package.json     # Root — workspaces + scripts
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9 (workspaces support)

## Quick Start

```bash
# Install all dependencies (root + workspaces)
npm install

# Development: Vite dev server :5173 + Express :3000 (with hot reload)
npm run dev

# Production build (builds React output into ./dist)
npm run build

# Serve production build (Express serves ./dist as static files)
npm start
```

## Deploy via SSH

```bash
# 1. Build locally
npm run build

# 2. Sync to remote server
rsync -avz --exclude=node_modules ./ user@host:/path/to/app/

# 3. On remote server
ssh user@host
cd /path/to/app
npm install --omit=dev
npm start
```

Or use a process manager like **pm2** for production:

```bash
npm install -g pm2
pm2 start server/index.js --name helloworld
pm2 save
pm2 startup
```

## API

- `GET /api/hello` → `{ "message": "Hello World from Express! 🚀" }`
