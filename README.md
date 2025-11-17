# tostes.live Monorepo

Monorepo for Lucas Tostes' portfolio website and projects.

## Structure

```
tostes-live/
├── apps/
│   ├── main/              # tostes.live - Main portfolio site
│   ├── sobrevivencia/     # sobrevivencia.tostes.live - Board game
│   ├── notebooks/         # notebooks.tostes.live - Data notebooks
│   └── quiz/              # quiz.tostes.live - Future app (placeholder)
├── packages/
│   ├── ui/                # Shared React components
│   ├── utils/             # Shared JavaScript utilities
│   └── styles/            # Shared CSS/design tokens
└── tools/
    └── cardprocessing/    # Development utilities
```

## Development

### Prerequisites
- Node.js 18+
- npm 9+

### Install dependencies
```bash
npm install
```

### Run apps locally

**Main site:**
```bash
npm run dev:main
# Opens on http://localhost:5173
```

**Sobrevivencia game:**
```bash
npm run dev:sobrevivencia
# Opens on http://localhost:5174
```

**Notebooks:**
```bash
npm run dev:notebooks
# Opens Observable preview server
```

### Build apps

**Build all apps:**
```bash
npm run build
```

**Build individual apps:**
```bash
npm run build:main
npm run build:sobrevivencia
npm run build:notebooks
```

## Apps

### apps/main
Main portfolio website at tostes.live.

**Routes:**
- `/` - Homepage
- `/gmtk-gamejam-2025` - RollerCoaster Rama game jam project
- `/boardgameprototype` - Board game prototype
- `/surpresa` - Sobrevivência na Amazônia prototype

**Tech:** Vite, React 19, React Router v7, Tailwind v4, D3.js, Observable Plot

### apps/sobrevivencia
Standalone Sobrevivência na Amazônia board game at sobrevivencia.tostes.live.

**Tech:** Vite, React 19, boardgame.io, react-hexgrid, Tailwind v4

See [apps/sobrevivencia/README.md](apps/sobrevivencia/README.md) for details.

### apps/notebooks
Observable Framework notebooks for data visualization at notebooks.tostes.live.

**Tech:** Observable Framework, D3.js, DuckDB

**Deploy:**
```bash
npm run docs:release --workspace=@tostes/notebooks
```

## Packages

### @tostes/ui
Shared React components (StandardPage, PopupModal, ToastPad, hooks).

### @tostes/styles
Shared CSS (reset.css, index.css).

### @tostes/utils
Shared JavaScript utilities (currently empty, reserved for future use).

## Deployment

### Main Site (tostes.live)
- **Platform:** Vercel
- **Config:** Auto-deploy from `main` branch
- **Root directory:** `apps/main`
- **Build command:** `npm run build:main`
- **Output directory:** `apps/main/build`

### Sobrevivencia (sobrevivencia.tostes.live)
- **Platform:** Vercel (separate project)
- **Root directory:** `apps/sobrevivencia`
- **Build command:** `npm run build:sobrevivencia`
- **Output directory:** `apps/sobrevivencia/build`

### Notebooks (notebooks.tostes.live)
- **Platform:** AWS S3 + CloudFront
- **Deploy:** `npm run docs:release --workspace=@tostes/notebooks`
- **S3 bucket:** `tostes-live-bucket/notebooks/`
- **CloudFront ID:** `E3MSHQGKYP8WLA`

## Tech Stack

- **Build system:** Turborepo, npm workspaces
- **Frontend:** React 19, Vite, Tailwind v4
- **Routing:** React Router v7
- **Data viz:** D3.js, Observable Plot
- **Notebooks:** Observable Framework, DuckDB
- **Game engine:** boardgame.io

## License

See [LICENSE](LICENSE)
