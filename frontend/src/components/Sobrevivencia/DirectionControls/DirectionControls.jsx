import React from 'react';

function DirectionControls({directionChosen, setDirectionChosen, playerPos, setPlayerPos, setInstructionText}) {
  return (
    <div className='absolute bottom-5 flex flex-row justify-center items-center mt-4 gap-12'>
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
              setInstructionText("Escolha para onde se mover.");
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
  );
}

export default DirectionControls;
