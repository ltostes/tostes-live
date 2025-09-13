import { HEX_MAP_LAYOUT, LOCATIONS, PLAYER_COLORS } from "./constants"
import { CARD_DEFINITIONS } from "./cards";

import { _, forEach } from 'lodash';

import { getHex, getTargetHexes, getNextLocation, translateRowColToGRS } from "./utils";

function playerSetup(index) {
    return {
        direction: null,
        hex: null,
        targetHexes: [],
        color: PLAYER_COLORS[index],
        cardsToChoose: []
    }
}

function getFreshDeck(deck_type, shuffler=_.shuffle) {

    const base_deck = CARD_DEFINITIONS.filter(f => f.type == deck_type);

    return shuffler(base_deck)
}

function selectStartLocation({G, ctx, events}, args) {

    const { row, col, direction, index } = args;
    const { hex_map } = G;
    const { currentPlayer } = ctx;

    const nextHex = getHex({row, col, hex_map})
    
    const nextLocation = getNextLocation({hex: nextHex, direction, G})

    G.start_locations.splice(index,1);
    G.players_state[currentPlayer] = {...G.players_state[currentPlayer], ...nextLocation};

    events.endTurn();
}

function changeDirection({G, ctx}, clockwise=true) {

    const { hex_map } = G;
    const { currentPlayer } = ctx;

    const { hex: playerHex, direction: currentDirection } = G.players_state[currentPlayer];

    const nextDirection = clockwise ? 
                            currentDirection == 0 ? 5 : currentDirection - 1
                            :   
                            currentDirection == 5 ? 0 : currentDirection + 1;

    const nextLocation = getNextLocation({hex: playerHex, direction: nextDirection, G});

    G.players_state[currentPlayer] = {...G.players_state[currentPlayer], ...nextLocation};
}

function updatePlayersLocations({G}) {

    Object.entries(G.players_state).forEach(([playerId,playerState]) => {
        const { hex, direction } = playerState;
        const nextLocation = getNextLocation({hex, direction, G});

        G.players_state[playerId] = {...G.players_state[playerId], ...nextLocation};
    })
}

function confirmDirection({G, ctx, events, random}) {
    // Here we need to update the cardsToChoose of the player
    const { targetHexes } = G.players_state[ctx.currentPlayer];

    G.players_state[ctx.currentPlayer].cardsToChoose = [];

    targetHexes.forEach(({type, way}) => {
        let cardToAdd;
        if (type == 'land') {
            if (G.forest_deck.length > 0) {
                cardToAdd = G.forest_deck.pop()        
            } else {
                const freshForestDeck = getFreshDeck('forest', random.Shuffle);
                cardToAdd = freshForestDeck.pop();
                G.forest_deck = freshForestDeck;
            }
        } else if (type == 'water') {
            if (G.river_deck.length > 0) {
                cardToAdd = G.river_deck.pop();      
            } else {
                const freshRiverDeck = getFreshDeck('river', random.Shuffle);
                cardToAdd = freshRiverDeck.pop();
                G.river_deck = freshRiverDeck;
            }
        }

        G.players_state[ctx.currentPlayer].cardsToChoose.push({...cardToAdd, way});
    })

    events.endStage();
}

function moveCurrentPlayer({G, ctx, events}, {hex, direction}) {

    const { hex_map } = G;
    const { currentPlayer } = ctx;

    G.players_state[currentPlayer] = {...G.players_state[currentPlayer], hex, direction};

    events.endTurn();
}

function setup({ctx, random}, setupData) {

    const base_hex_map = [
        ...HEX_MAP_LAYOUT
    ];

    const hex_map = base_hex_map;

    const hex_locations = LOCATIONS.map((location) => ({
        ...location,
        ...translateRowColToGRS(location.row, location.col)
    }))

    const start_locations = hex_locations.filter(f => f.type == 'start')
    const end_locations = hex_locations.filter(f => f.type == 'finish');

    const forest_deck = getFreshDeck('forest', random.Shuffle)
    const river_deck = getFreshDeck('river', random.Shuffle)

    const players_state = Object.assign({},..._.times(ctx.numPlayers).map((player, index) => ({[player]: playerSetup(index)})));

    return {
        hex_map,
        forest_deck,
        river_deck,
        players_state,
        start_locations,
        end_locations
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
            endIf: (({G}) => Object.values(G.players_state).every(({hex}) => hex != null)),
            next: 'main'
        },
        'main' : {
            turn: {
                stages: {
                    'direction' : {
                        next: 'card',
                        moves: {
                            changeDirection,
                            confirmDirection
                        }
                    },
                    'card' : {
                        moves: {
                            moveCurrentPlayer,
                            endCard: (({events}) => events.endTurn())
                        }
                    }
                },
                onBegin: ({G, ctx, events}) => {
                    updatePlayersLocations({G});
                    events.setActivePlayers({currentPlayer:'direction'});
                },
            },
            next: 'main',
            onBegin: (({G}) => {
                G.start_locations = []
            })
        }
    },
    endIf: (({G, ctx}) => ctx.phase != 'startLocationSelection' && 
        Object.values(G.players_state)
            .some(({hex: {q,r,s}}) => G.end_locations
            .some(({q: end_q, r: end_r, s: end_s}) => 
                _.isEqual([q,r,s], [end_q,end_r,end_s])
    ))),
}