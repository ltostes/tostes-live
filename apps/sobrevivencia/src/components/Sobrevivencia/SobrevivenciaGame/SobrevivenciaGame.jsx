import React from 'react';
import { Client } from 'boardgame.io/react'
// import { Local } from 'boardgame.io/multiplayer';

import { sobrevivenciaGame } from '../game'
import GameBoard from '../GameBoard';


const SobrevivenciaGame = Client({
  game: sobrevivenciaGame,
  numPlayers: 2,
  board: GameBoard,
  // multiplayer: Local()
})

export default SobrevivenciaGame;
