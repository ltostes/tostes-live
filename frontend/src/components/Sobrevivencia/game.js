import { HEX_MAP_LAYOUT, STARTING_LOCATIONS, PLAYER_COLORS } from "./constants"
import { CARD_DEFINITIONS } from "./cards";

import { _ } from 'lodash';

import { getHex, getTargetHexes } from "./utils";

function playerSetup(index) {
    return {
        direction: null,
        hex: null,
        targetHexes: [],
        color: PLAYER_COLORS[index]
    }
}

function selectStartLocation({G, ctx, events}, args) {

    const { row, col, direction, index } = args;
    const { hex_map } = G;
    const { currentPlayer } = ctx;

    const nextHex = getHex({row, col, hex_map})
    
    const nextLocation = {
        direction: args.direction,
        hex: nextHex,
        targetHexes: getTargetHexes({hex: nextHex, direction, hex_map})
    }

    G.start_locations.splice(index,1);
    G.players_state[currentPlayer] = {...G.players_state[currentPlayer], ...nextLocation};

    events.endTurn();
}


function setup({ctx, random}, setupData) {

    const base_hex_map = [
        ...HEX_MAP_LAYOUT
    ];

    const hex_map = base_hex_map;

    const start_locations = STARTING_LOCATIONS;

    const base_forest_deck = CARD_DEFINITIONS.filter(f => f.type == 'forest');
    const base_river_deck = CARD_DEFINITIONS.filter(f => f.type == 'river');

    const forest_deck = random.Shuffle(base_forest_deck)
    const river_deck = random.Shuffle(base_river_deck)

    const players_state = Object.assign({},..._.times(ctx.numPlayers).map((player, index) => ({[player]: playerSetup(index)})));

    return {
        hex_map,
        forest_deck,
        river_deck,
        players_state,
        start_locations
    }
}


export const sobrevivenciaGame = {
    name: 'sobrevivencia_na_amazonia',
    setup,
    phases: {
        'startLocationSelection' : {
            start:true,
            moves: {
                selectStartLocation
            },
            endIf: (({G}) => Object.values(G.players_state).every(({hex}) => hex != null))
        }
    }
}