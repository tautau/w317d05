# w317d05

A small SimCity-inspired city-building game in development.

## Current build

The welcome screen starts a new, empty city. Choose a starting year — **1925**, **1975**, or **2025** — and select **Start Game**.

The vanilla gameplay screen currently contains the foundation of the simulation:

- A fixed **2048 × 2048** city grid.
- Every tile is **48 × 48 pixels**.
- The viewport is a scrollable window into the full city.
- The city clock starts on **January 1 of the selected year** and advances by **one day every 5 seconds**.

The center of the empty map is the initial view when a new city starts. The building, zoning, infrastructure, economy, and simulation systems will be layered on top of this foundation.

## Development

Requirements:

- Node.js 24

Run locally:

```bash
npm install
npm run dev
```

For the simple Node server:

```bash
npm start
```

## Deployment

The project is configured for Vercel's Node.js runtime. Pushes to the connected GitHub repository trigger Vercel deployments automatically.
