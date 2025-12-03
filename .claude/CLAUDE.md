# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Style
- Be extremely concise. Sacrifice grammar for concision.

## Build Commands

```bash
# Install dependencies
npm install

# Development
npm run dev:main          # Main site at localhost:5173
npm run dev:sobrevivencia # Board game at localhost:5174
npm run dev:notebooks     # Observable preview server

# Build
npm run build             # Build all apps
npm run build:main
npm run build:sobrevivencia
npm run build:notebooks

# Deploy notebooks (AWS S3/CloudFront)
npm run docs:release --workspace=@tostes/notebooks
```

## Architecture

**Monorepo:** Turborepo + npm workspaces

**Apps:**
- `apps/main` - Portfolio site (Vite, React 19, React Router v7, Tailwind v4, D3.js, Observable Plot)
- `apps/sobrevivencia` - Board game (Vite, React 19, boardgame.io, react-hexgrid, Tailwind v4)
- `apps/notebooks` - Data notebooks (Observable Framework, DuckDB)
- `apps/quiz` - Placeholder

**Packages:**
- `@tostes/ui` - Shared React components (StandardPage, PopupModal, ToastPad, hooks)
- `@tostes/styles` - Shared CSS (reset.css, index.css)
- `@tostes/utils` - Reserved for future utilities

## Tech Preferences
- DuckDB in Node.js: use `@duckdb/node-api` (no connection.close() needed, see https://duckdb.org/docs/stable/clients/node_neo/overview)
- Data visualization: @observablehq/plot (https://observablehq.com/plot) for general, d3.js for complex/custom

## Plans
- End each plan with unresolved questions, if any
- Break big tasks into multiple phases designed for incremental validation
- Persist approved plans in context files for agent continuity. Let me know location
- Remove persisted plan files when fully finished

## Development
- Implement phase by phase. Ask for validation before next phase
- Keep `/.claude/CONTEXT.md` up to date after development