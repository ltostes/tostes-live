import React from 'react'
import styles from './GameBoard.module.css'

import { FaLongArrowAltDown } from "react-icons/fa";
import { _ } from 'lodash';

import SimpleFlexTable from '../SimpleFlexTable';

import HexMap from '../HexMap/HexMap'
import { FinishTile, PlayerTile, StartLocation } from '../MapElements'
import { CustomHexTile } from '../MapElements';

import CardChoiceMenu from '../CardChoiceMenu/CardChoiceMenu';
import DirectionTiles from '../DirectionTiles';

function GameBoard({G, ctx, moves, reset, events}) {

  const stage = !ctx.activePlayers ? null : ctx.activePlayers[ctx.currentPlayer];
  const { currentPlayer, phase, turn, numPlayers, gameover } = ctx;
  const { forest_deck, river_deck } = G;
  const currentPlayerState = G.players_state[currentPlayer];
  const { cardsToChoose, color: playerColor, targetHexes } = currentPlayerState;

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
        <div className='text-center p-2 text-md text-blue-500'>
            <p>Após selecionar o local inical dos dois jogadores, o jogo funciona atualmente com hotkeys, listados embaixo </p>
          {/* <SimpleFlexTable items={{
            phase, stage, turn, currentPlayer
            // , currentPlayerState
            , deck_lengths: {forest: forest_deck.length, river: river_deck.length }
            , playerHex: currentPlayerState.hex
          }} 
            /> */}
        </div>
      </div>
      {
        stage == 'card' && !gameover && <CardChoiceMenu 
                cards={cardsToChoose}
                chooseCard={chooseCard}
                playerColor={playerColor}
                />
      }
      {/* Map */}
      <div className='max-h-150 border-2 bg-white'>
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
                <CustomHexTile row={row} col={col} key={`starting-${id}`} onClick={
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
                <CustomHexTile row={row} col={col} key={`finish-${id}`}
                // style={{border: 1, stroke:'red'}} 
                >
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
                  key={`${playerId}-location`}
                >
                  <PlayerTile style={{fill: color}}/>
                </CustomHexTile>
              )
            })
          }
          {
            // Direction hexes
            stage == 'direction' && 
            <DirectionTiles 
                targetHexes={targetHexes}
                playerColor={playerColor}
                changeDirection={moves.changeDirection}
                confirmDirection={moves.confirmDirection}
              />
          }
        </HexMap>
      </div>
      {/* Footer */}
      <div className='flex-2 bg-white flex justify-center items-center p-5 gap-20 max-h-[15%] border-amber-400'>
        <div className='flex flex-col gap-2'>
          <div className='text-green-800 font-bold self-center'>
            Hotkeys de direção
          </div>
          <div className='text-gray-800'>
            <kbd>Q</kbd>: Rotacionar direção (anti-horário)
          </div>
          <div className='text-gray-800'>
            <kbd>W</kbd>: Confirmar direção
          </div>
          <div className='text-gray-800'>
            <kbd>E</kbd>: Rotacionar direção (horário)
          </div>
        </div>
        <div className='flex flex-col gap-2 mb-5'>
          <div className='text-green-800 font-bold self-center'>
            Escolha da carta
          </div>
          <div className='text-gray-800'>
            <kbd>Q</kbd>: Carta da esquerda
          </div>
          <div className='text-gray-800'>
            <kbd>W</kbd>: Carta do meio (principal)
          </div>
          <div className='text-gray-800'>
            <kbd>E</kbd>: Carta da direita
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoard;