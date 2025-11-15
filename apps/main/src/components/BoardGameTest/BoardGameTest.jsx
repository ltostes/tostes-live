import React from 'react';

import { Client } from 'boardgame.io/react';
import { INVALID_MOVE } from 'boardgame.io/core';

function IsVictory(cells) {
  const positions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const isRowComplete = row => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}

const TicTacToe = {
  setup: () => ({ cells: Array(9).fill(null) }),


  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    clickCell: ({ G, playerID }, id) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = playerID;
    },
  },

  endIf: ({ G, ctx }) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    },
  },
};

export function TicTacToeBoard({ ctx, G, moves, reset }) {
  const onClick = (id) => moves.clickCell(id);

  const { cells } = G;

  const newboard = (
    <div class="grid grid-cols-3 gap-4">
      {cells.map((cell, i) => (
        <button 
          key={i} 
          class="h-16 w-16 rounded-full bg-blue-200 transition duration-200 ease-in-out hover:shadow-lg/30 hover:scale-110"
          onClick={() => onClick(i)}
        >
          <span className='text-3xl font-bold text-blue-600'>{cell}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {newboard}
      <div className={`h-16 text-2xl font-bold translate-y-5 text-center  opacity-${ctx.gameover ? 100 : 0}`}>
        <h1>{
        ctx.gameover ? ctx.gameover.winner ? `Winner: ${ctx.gameover.winner}` : 'Draw!' : 'None'
        }</h1>
        <br/>
        <button 
         className='mt-2 rounded-full bg-blue-500 px-4 py-2 font-semibold text-white transition duration-200 ease-in-out hover:bg-blue-600 hover:shadow-lg/30 hover:scale-105'
         onClick={reset}
        >Restart Game</button>
      </div>
    </div>
  );
}

const BoardGameTest = Client({ game: TicTacToe, board: TicTacToeBoard });


export default BoardGameTest;
