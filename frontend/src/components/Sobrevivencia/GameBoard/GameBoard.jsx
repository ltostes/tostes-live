import React from 'react'
import styles from './GameBoard.module.css'

import { Flag } from 'react-feather';
import { FaLongArrowAltDown } from "react-icons/fa";
import { Hex, Path } from 'react-hexgrid';
import { _ } from 'lodash';

import useKeyDown from '../../../hooks/useKeyDown';
import SimpleFlexTable from '../SimpleFlexTable';

import HexMap from '../HexMap/HexMap'
import { FinishTile, PlayerTile, StartLocation } from '../MapElements'
import { CustomHexTile } from '../MapElements';

import CardPortal from '../CardPortal';
import { CARD_DEFINITIONS } from '../cards';
import CardChoiceMenu from '../CardChoiceMenu/CardChoiceMenu';

function GameBoard({G, ctx, moves, reset, events}) {

  const stage = !ctx.activePlayers ? null : ctx.activePlayers[ctx.currentPlayer];
  const { currentPlayer, phase, turn, numPlayers } = ctx;
  const { forest_deck, river_deck } = G;
  const currentPlayerState = G.players_state[currentPlayer];
  const { cardsToChoose, color: playerColor } = currentPlayerState;

  function chooseCard(chosen_way) {
    const {q, r, s, direction} = currentPlayerState.targetHexes.find(({way}) => chosen_way == way);
    moves.moveCurrentPlayer({hex: {q,r,s}, direction});
    return;
  }

  return (
    <div 
      className='flex flex-col justify-center h-lvh'
    >
      {/* Header */}
      <div className='flex-1 bg-white flex flex-col justify-center items-center p-2 gap-2'>
        <div className='text-center p-2 text-4xl text-blue-500'>
          <h2 className='font-bold mb-2'>Protótipo digital <span className='transition hover:text-green-800 hover:animate-pulse' href="https://ludopedia.com.br/jogo/sobrevivencia-na-amazonia">Sobrevivência na Amazônia</span></h2>
          {/* <p className='text-sm'>Escolha a direção do personagem para poder se mover e selecione o melhor caminho até encontrar o resgate.</p> */}
        </div>
        <div className='text-green-800'>
          <SimpleFlexTable items={{
            phase, stage, turn, currentPlayer
            // , currentPlayerState
            , deck_lengths: {forest: forest_deck.length, river: river_deck.length }
          }} 
            />
        </div>
      </div>
      {
        stage == 'card' && <CardChoiceMenu 
                cards={cardsToChoose}
                chooseCard={chooseCard}
                playerColor={playerColor}
                />
      }
      {/* Map */}
      <div className='max-h-150 border-2 border-amber-100'>
        <HexMap 
          hex_map={G.hex_map}
          controls={{ translation: { x: 0, y: 0 }, zoom: 1 }} // To be turned into states later
        >
          {
            // When it is the Start Location Phase
            ctx.phase == 'startLocationSelection' &&
            G.start_locations.map((props, index) => {
              const {row, col, id, dir : direction} = props;
              return (
                <CustomHexTile row={row} col={col} key={id} onClick={
                  () => {
                    moves.selectStartLocation({row, col, direction, index})
                  }
                }>
                  <StartLocation />
                </CustomHexTile>
              )
            }
            )
          }
          {
            // End location flag
            G.end_locations.map(({row, col, id}) => {
              return (
                <CustomHexTile row={row} col={col} key={id}>
                  <FinishTile />
                </CustomHexTile>
              )
            }
            )
          }
          {
            // Player tiles
            Object.entries(G.players_state).map(([playerId, playerState]) => {
              if (playerState.hex == null) return;
              const {hex, color} = playerState;
              const {q, r, s} = hex;
              return (
                <CustomHexTile
                  q={q}
                  r={r}
                  s={s}
                  style={{stroke: color}}
                  key={playerId}
                >
                  <PlayerTile style={{fill: color}}/>
                </CustomHexTile>
              )
            })
          }
          {
            // Direction hexes
            currentPlayerState.targetHexes.map(({key, q, r, s, direction, way},i) => (
              <CustomHexTile 
                  key={`direction-${key}`}
                  q={q}
                  r={r}
                  s={s}
                  style={{stroke: 'white', strokeWidth: 1}}
              >
                {
                  <FaLongArrowAltDown 
                    transform={`translate(-6,0) rotate(${-90 -direction*60},6,0) translate(0,-6)`}
                    size={12} // If you were to change this size, also change the fixed '6' in transforms (should be 1/2 the size)
                    style={{fill: way == 'main' ? currentPlayerState.color : 'white', opacity: 0.5}}
                  />
                }
              </CustomHexTile>
            ))
          }
        </HexMap>
      </div>
      {/* Footer */}
      <div className='flex-1 border-2 border-amber-300'>
        <h1>Goodbye!</h1>
      </div>
    </div>
  )
}

export default GameBoard;