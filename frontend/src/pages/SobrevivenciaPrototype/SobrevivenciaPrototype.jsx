import React, { useEffect } from 'react'
import styles from './SobrevivenciaPrototype.module.css'

import { CenteredMain } from '../../components/StandardPage/StandardPage';
import MainMap from '../../components/Sobrevivencia/MainMap';

import { Hex, HexUtils } from 'react-hexgrid';

import { STARTING_LOCATIONS } from './constants';
import { translateRowColToGRS } from '../../components/Sobrevivencia/MainMap';

// import FlagIcon from '/assets/flag.svg?react';
import CardPortal from '../../components/Sobrevivencia/CardPortal';

function SobrevivenciaPrototype() {

  const [mapTranslation, setMapTranslation] = React.useState({ x: 0, y: 0 });
  const [mapZoom, setMapZoom] = React.useState(1);

  const [playerPos, setPlayerPos] = React.useState({ hex: new Hex(0,0,0), dir: 2});
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  // const [dirTypes, setDirTypes] = React.useState(['none','none','none']);

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
    setInstructionText("Personagem movido. Agora você pode escolher a direção novamente.");
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

  const directionControls = (
    <div className='flex flex-row justify-center items-center mt-4 gap-12'>
          <button 
            className={`m-1 p-2
                       bg-blue-500
                       text-white 
                       rounded-2xl text-9xl border-4 
                       
                       ${directionChosen ? 'opacity-50 cursor-not-allowed' 
                        : 'border-amber-300 scale-150 transition hover:scale-200'}
                       `}
            onClick={() => {
              !directionChosen && setPlayerPos({...playerPos, dir: (playerPos.dir + 1 + 6) % 6});
            }}
          >
            ←
          </button>
          <button
            className={`m-1 p-4 border
                    text-white rounded-2xl text-9xl  
                    ${directionChosen ? 'opacity-50 bg-gray-400 cursor-not-allowed border-gray-600' 
                      : 'bg-green-700 transition hover:scale-120'}
                    `}
            onClick={() => {
              if(directionChosen) return;
              setDirectionChosen(true);
              setInstructionText("Direção confirmada. Agora você pode mover o personagem.");
            }}
          >
            Confirmar direção
          </button>
          <button 
            className={`m-1 p-2
                       bg-blue-500
                       text-white 
                       rounded-2xl text-9xl border-4 
                       
                       ${directionChosen ? 'opacity-50 cursor-not-allowed' 
                        : 'border-amber-300 scale-150 transition hover:scale-200'}
                       `}
            onClick={() => {
              !directionChosen && setPlayerPos({...playerPos, dir: (playerPos.dir - 1 + 6) % 6});
            }}
          >
            →
          </button>
        </div>
  )

  const mapControls = (
    <div>
      <div>
        <input 
          type="range" 
          min="0.5" 
          max="2" 
          step="0.001" 
          value={mapZoom}
          onChange={(e) => setMapZoom(e.target.value)} 
          />
        <span> Zoom: {mapZoom}</span>
      </div>
      <div>
        {
          [0,1,2,3,4,5].map(dir => (
            <button 
            key={dir}
            className={`m-1 p-2 border ${playerPos.dir === dir ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setPlayerPos({...playerPos, dir})}
            >
              {dir}
            </button>
          ))
        }
      </div>
    </div>
  )

  return (
    <div className='h-screen w-full flex justify-center items-center p-4 bg-blue-100'>
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
            controls={{ translation: mapTranslation, zoom: mapZoom }}
            playerPos={playerPos}
            movePlayer={movePlayer}
            gameStarted={gameStarted}
            >
            {
                !gameStarted && STARTING_LOCATIONS.map((loc) => startingLocation(loc))
            }
            {
                gameStarted && <g hex={playerPos.hex}>
                  <circle cx="0" cy="0" r="6" fill="orange" />
                </g>
            }
            <g row={5} col={10}>
              <circle cx="0" cy="0" r="4" fill="none" stroke="red" />
              <circle cx="0" cy="0" r="6.5" fill="none" stroke="red" />
              <circle cx="0" cy="0" r="2" fill="red" />
              {/* <FlagIcon width="12" height="12" x="-6" y="-6"/> */}
            </g>
          </MainMap>
        </div>
        {gameStarted && !gameOver && directionControls}
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
            <img 
              src="/assets/Carta2.png" 
              alt="Example" className='rounded-2xl' />
          </div>
          <div 
            className={`position-relative bg-white/70 p-2 rounded-2xl translate-y-[-15px] hover:translate-y-[-20px] transition-all duration-300`}
            onClick={() => {
                const {hex, dir} = playerPos;
                movePlayer(HexUtils.neighbor(hex, dir));
              }}
            >
            <img 
              src="/assets/Carta1.png" 
              alt="Example" className='rounded-2xl' />
          </div>
          <div 
              className={`position-relative bg-white/70 p-2 rounded-2xl translate-y-0.5 hover:translate-y-0 transition-all duration-300`}
              onClick={() => {
                const {hex, dir} = playerPos;
                const effectiveDir = dir == 0 ? 5 : playerPos.dir - 1;
                movePlayer(HexUtils.neighbor(hex, effectiveDir));
              }}
            >
            <img 
              src="/assets/Carta3.png" 
              alt="Example" className='rounded-2xl' />
          </div>
          </CardPortal>}
          {gameOver && <div 
            className='mt-4 p-4
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