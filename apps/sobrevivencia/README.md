# Sobrevivência na Amazônia - Digital Prototype

Digital prototype for the ["Sobrevivência na Amazônia"](https://ludopedia.com.br/jogo/sobrevivencia-na-amazonia) board game, implemented using boardgame.io.

## Overview

This is a standalone React app featuring a hexagonal grid-based board game with turn-based gameplay for 2 players. Players navigate through the Amazon rainforest, making strategic decisions via card selection to reach the finish line.

## Features

- **Hex grid map** - Built with react-hexgrid
- **Turn-based multiplayer** - Powered by boardgame.io
- **Card choice mechanics** - Players select from 3 cards each turn
- **Direction selection** - Choose movement direction on hex grid
- **Player avatars** - Male/female explorer SVG icons
- **Keyboard controls** - Q/W/E hotkeys for faster gameplay

## Development

### Run locally
```bash
# From repository root
npm run dev:sobrevivencia

# Or from this directory
npm run dev
```

Opens on http://localhost:5174

### Build
```bash
# From repository root
npm run build:sobrevivencia

# Or from this directory
npm run build
```

Output in `build/` directory.

## Game Controls

### Direction Selection Stage
- **Q** - Rotate direction counter-clockwise
- **W** - Confirm direction
- **E** - Rotate direction clockwise

### Card Choice Stage
- **Q** - Select left card
- **W** - Select middle card (main path)
- **E** - Select right card

## Tech Stack

- **Framework:** React 19 + Vite
- **Game engine:** boardgame.io
- **Grid system:** react-hexgrid
- **Styling:** Tailwind v4
- **Icons:** react-icons, custom SVG avatars
- **Shared components:** @tostes/ui, @tostes/styles

## Project Structure

```
src/
├── components/Sobrevivencia/
│   ├── SobrevivenciaGame/     # boardgame.io client wrapper
│   ├── GameBoard/             # Main game board component
│   ├── HexMap/                # Hex grid renderer
│   ├── MapElements/           # Tiles (StartLocation, PlayerTile, FinishTile, etc.)
│   ├── CardChoiceMenu/        # Card selection UI
│   ├── DirectionTiles/        # Direction preview overlays
│   ├── SimpleFlexTable/       # Debug info display
│   ├── game.js                # boardgame.io game logic
│   ├── cards.js               # Card definitions
│   ├── constants.js           # Game constants (locations, etc.)
│   └── utils.js               # Helper functions
├── assets/
│   ├── exploradora.svg        # Female player icon
│   └── explorador.svg         # Male player icon
└── main.jsx                   # App entry point
```

## Deployment

### Vercel
1. Create new Vercel project
2. Configure:
   - **Root directory:** `apps/sobrevivencia`
   - **Build command:** `cd ../.. && npm run build:sobrevivencia`
   - **Output directory:** `apps/sobrevivencia/build`
   - **Install command:** `npm install`
3. Point custom domain: `sobrevivencia.tostes.live`

## Future Enhancements

- [ ] Multiplayer over network (currently local only)
- [ ] Player inventory/stats tracking
- [ ] Dynamic card effects based on hex terrain
- [ ] Sound effects and animations
- [ ] Mobile-responsive controls
- [ ] Spectator mode

## Credits

Based on the board game "Sobrevivência na Amazônia" by [game creator info].

Digital implementation by Lucas Tostes.
