# SherpaLabs — AI Innovation Lab

Production-grade corporate site for [SherpaLabs.tech](https://sherpalabs.tech).

An intelligent, modern web presence for an innovation lab building AI-powered, go-to-market-ready technology stacks and self-sustaining automation systems.

## Tech Stack

- **Frontend:** React 18 + Vite 6
- **Backend:** Express.js
- **Styling:** Custom CSS (dark theme, animations, responsive)
- **Architecture:** Monorepo with npm workspaces

## Quick Start

```bash
# Install all dependencies (root + workspaces)
npm install

# Development: Vite dev server :5173 + Express :3001
npm run dev

# Production build (output → ./dist)
npm run build

# Serve production build
npm start
```

## Project Structure

```
WEB_FRONTEND/
├── client/          # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx        # All sections (SPA)
│       └── App.css        # Dark theme, animations
├── server/          # Express backend
│   └── index.js
├── dist/            # Production build output
├── package.json
└── README.md
```

## Sections

| Section | Description |
|---------|-------------|
| Hero | Bold headline, animated particles, CTA |
| About | Sherpa Mindset — five core principles |
| Mission & Vision | Dual-card layout |
| What We Build | Six capability cards in a 3-column grid |
| Core Values | Five numbered values |
| Contact | CTA with email link |

## Design

- Dark background (#0a0a0a) with green/teal accents (#00d68f)
- Inter typeface, 48px+ hero headlines
- Scroll-triggered reveal animations
- Responsive: fluid grid, mobile-first breakpoints
- Gradient glows, subtle particle field, hover effects

## License

Proprietary — SherpaLabs
