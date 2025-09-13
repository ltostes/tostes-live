import React, { useEffect } from 'react'
import styles from './SobrevivenciaPrototype.module.css'

import useToggle from '../../hooks/useToggle';

import { Hex, HexUtils } from 'react-hexgrid';
import { Flag } from 'react-feather';
import { _ } from 'lodash';
import * as d3 from "d3";

import { translateRowColToGRS } from '../../components/Sobrevivencia/MainMap';
import MainMap from '../../components/Sobrevivencia/MainMap';
import CardPortal from '../../components/Sobrevivencia/CardPortal';
import DirectionControls from '../../components/Sobrevivencia/DirectionControls/DirectionControls';

import { LOCATIONS } from '../../components/Sobrevivencia/constants';
import { CARD_DEFINITIONS } from '../../components/Sobrevivencia/cards';
import PopupModal from '../../components/PopupModal/PopupModal';

function SobrevivenciaPrototype() {

  const [disclaimer, toggleDisclaimer] = useToggle(true);

  const [playerPos, setPlayerPos] = React.useState({ hex: new Hex(0,0,0), dir: 2});
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);

  const [directionChosen, setDirectionChosen] = React.useState(false);

  useEffect(() => {
    const {q, r, s} = playerPos.hex;
    console.log("Player position changed:", [q,r,s]);
    if ([q,r,s].every(n => n === 0) && gameStarted) {
      setGameOver(true);
      setInstructionText("Parabéns! Você chegou ao destino final.");
    }
  }, [playerPos]);
  const movePlayer = (newHex) => {
    setPlayerPos({...playerPos, hex: newHex});
    setDirectionChosen(false);
    setInstructionText("Continue nessa direção ou escolha outra.");
  }

  const [instructionText, setInstructionText] = React.useState("Escolha a posição inicial do personagem");

  const startingLocation = (loc) => {
          const { row, col, id, dir } = loc;
          return (
            <g row={row} col={col} key={id} onClick={() => {
              const {g, r, s} = translateRowColToGRS(row, col);
              const newHex = new Hex(g, r, s);
              setGameStarted(true);
              setInstructionText("O jogo começou! Escolha a direção do personagem para se mover.");
              setPlayerPos({ hex: new Hex(...Object.values(translateRowColToGRS(row, col))), dir });
            }}>
              <circle cx="0" cy="0" r="4" fill="none" stroke="white" />
              <circle cx="0" cy="0" r="6.5" fill="none" stroke="white" />
              <circle cx="0" cy="0" r="2" fill="white" />
              <circle cx="0" cy="0" r="10" fill="white" opacity={0} />
              {/* <text>{id}</text> */}
            </g>
          );
  };

  function RandomCard() {
    return (
      <img 
        src={_.sample(CARD_DEFINITIONS.map(({location, filename}) => `${location}/${filename}`))}
        alt="Example" className='rounded-2xl h-150' />
    )
  }

  return (
    <div className='h-screen w-full flex justify-center items-center p-4 bg-blue-100'>
      {disclaimer && <PopupModal handleDismiss={toggleDisclaimer}>
        <div className='text-center p-2 text-3xl text-blue-500 min-w-[400px]'>
          <h2 className='font-bold mb-2'>Bem-vindo!</h2>
          <p className='text-xl'>Esta é uma primeira iteração de um protótipo digital para o jogo "Sobrevivência na Amazônia".</p>
          <p className='text-xl'>Seu principal intuito é servir de exemplo para um futuro desenvolvimento do jogo.</p>
          <br />
          <p className='text-xl'>As cartas não são dinâmicas, não há tabuleiro de jogador, dentre outras partes faltantes.</p>
          <br />
          <p className='text-xl'><i>Portanto não espere uma versão divertida e jogável <span className='animate-pulse font-semibold'>ainda</span>...</i></p>
        </div>
        <div className='flex justify-center pt-4'>
          <button
            className='mt-4
            bg-blue-500 
            text-white
            px-4 py-2 rounded-2xl hover:bg-blue-600 transition'
            onClick={toggleDisclaimer}
            >
            <span className='font-bold'>Ok, entendido!</span>
          </button>
        </div>
      </PopupModal>}
      <div className='flex flex-col items-center mb-4'> 
        <div className='text-center p-2 text-4xl text-blue-500'>
          <h2 className='font-bold mb-2'>Protótipo digital <a className='transition hover:text-green-800 hover:animate-pulse' href="https://ludopedia.com.br/jogo/sobrevivencia-na-amazonia">Sobrevivência na Amazônia</a></h2>
          <p className='text-sm'>Escolha a direção do personagem para poder se mover e selecione o melhor caminho até encontrar o resgate.</p>
        </div>
        <div className='text-center pt-8 text-3xl text-indigo-500'>
          <h2 className='font-bold mb-2'>{instructionText}</h2>
        </div>
        <div className='w-400 h-160'>
          <MainMap 
            controls={{ translation: { x: 0, y: 0 }, zoom: 1 }} // To be turned into states later
            playerPos={playerPos}
            movePlayer={movePlayer}
            gameStarted={gameStarted}
            >
            {
                !gameStarted && LOCATIONS.filter(f => f.type == 'start').map((loc) => startingLocation(loc))
            }
            {
                gameStarted && <g hex={playerPos.hex}>
                  <circle cx="0" cy="0" r="6" fill="orange" />
                </g>
            }
            <g row={5} col={10}>
              {/* <circle cx="0" cy="0" r="4" fill="none" stroke="red" />
              <circle cx="0" cy="0" r="6.5" fill="none" stroke="red" />
              <circle cx="0" cy="0" r="2" fill="red" /> */}
              <Flag size={12} x={6} y={6} className={`stroke-amber-500 fill-amber-400`}   />
            </g>
          </MainMap>
        </div>
        {gameStarted && !gameOver && 
          <DirectionControls
            directionChosen={directionChosen}
            setDirectionChosen={setDirectionChosen}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            setInstructionText={setInstructionText}
          />
          }
        {/* {mapControls} */}
        {gameStarted && directionChosen && <CardPortal>
          <div 
              className={`position-relative bg-white/70 p-2 rounded-2xl translate-y-0.5 hover:translate-y-0 transition-all duration-300`}
              onClick={() => {
                const {hex, dir} = playerPos;
                const effectiveDir = dir == 5 ? 0 : playerPos.dir + 1;
                movePlayer(HexUtils.neighbor(hex, effectiveDir));
              }}
            >
            <RandomCard />
          </div>
          <div 
            className={`position-relative bg-white/70 p-2 rounded-2xl translate-y-[-15px] hover:translate-y-[-20px] transition-all duration-300`}
            onClick={() => {
                const {hex, dir} = playerPos;
                movePlayer(HexUtils.neighbor(hex, dir));
              }}
            >
            <RandomCard />
          </div>
          <div 
              className={`position-relative bg-white/70 p-2 rounded-2xl translate-y-0.5 hover:translate-y-0 transition-all duration-300`}
              onClick={() => {
                const {hex, dir} = playerPos;
                const effectiveDir = dir == 0 ? 5 : playerPos.dir - 1;
                movePlayer(HexUtils.neighbor(hex, effectiveDir));
              }}
            >
            <RandomCard />
          </div>
          </CardPortal>}
          {gameOver && <div 
            className='
             absolute bottom-3
             mt-4 p-4
             bg-fuchsia-200 border-4
             border-fuchsia-400 rounded-2xl
             text-fuchsia-800 text-2xl font-bold
             cursor-pointer hover:bg-fuchsia-300'
            onClick={() => {
              setGameOver(false);
              setGameStarted(false);
              setPlayerPos({ hex: new Hex(0,0,0), dir: 2});
              setInstructionText("Escolha a posição inicial do personagem");
            }}
          >
            Reiniciar o jogo
          </div>}
      </div>

    </div>
  );
}

export default SobrevivenciaPrototype;