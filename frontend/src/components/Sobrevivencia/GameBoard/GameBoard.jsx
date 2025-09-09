import React from 'react'
import styles from './GameBoard.module.css'
import { Flag } from 'react-feather';

import HexMap from '../HexMap/HexMap'
import { FinishTile, StartLocation } from '../MapElements'

import { STARTING_LOCATIONS } from '../constants';

function GameBoard({G, ctx, moves, reset}) {

  return (
    <div 
      className='flex flex-col justify-center h-lvh'
    >
      <div className='flex-1 border-2 border-amber-300'>
        <h1>Hello!</h1>
      </div>
      <div className='max-h-150 border-2 border-amber-100'>
        <HexMap 
          hex_map={G.hex_map}
          controls={{ translation: { x: 0, y: 0 }, zoom: 1 }} // To be turned into states later
        >
          <FinishTile row={4} col={10}/>
          {
            STARTING_LOCATIONS.map((props) => {
              const {row, col, id, dir : direction} = props;
              return (
                <StartLocation row={row} col={col} key={id} onClick={
                  () => {
                    moves.selectStartLocation({row, col, direction})
                  }
                }/>
              )
            }
            )
          }
        </HexMap>
      </div>
      <div className='flex-1 border-2 border-amber-300'>
        <h1>Goodbye!</h1>
      </div>
    </div>
  )
}

export default GameBoard;