import { HEX_MAP_LAYOUT } from "./constants"

import { PluginPlayer } from 'boardgame.io/plugins'

function setup({ctx}, setupData) {

    const hex_map = {
        ...HEX_MAP_LAYOUT
    };

    // const 
    // const 

    return G
}

function playerSetup() {

}

export const SobrevivenciaGame = {
    name: 'Sobrevivência na Amazônia',
    setup,
    plugins: [
        PluginPlayer({
            setup: playerSetup,
        })
    ]
}