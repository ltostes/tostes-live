import React from 'react';
import { _ } from 'lodash';

import CardPortal from '../CardPortal';
import { CARD_DEFINITIONS } from '../cards';
import { FaLongArrowAltDown } from 'react-icons/fa';
import useKeyDown from '../../../hooks/useKeyDown';

function CardChoiceMenu({cards, chooseCard, playerColor}) {

  useKeyDown(() => chooseCard('left'), 'KeyQ');
  useKeyDown(() => chooseCard('main'), 'KeyW');
  useKeyDown(() => chooseCard('right'), 'KeyE');

  return <CardPortal>
          {
            cards.map(({way, location, filename}) => (
              <div key={way}>
              <div 
                className={`position-relative bg-white/70 p-2 rounded-2xl translate-y-${way == 'main' ? '[-15px]' : '0.5'} hover:translate-y-${way == 'main' ? '[-20px]' : '0'} transition-all duration-300`}
                onClick={() => chooseCard(way)}
              >
                <img 
                  src={`${location}/${filename}`}
                  alt="Example" className='rounded-2xl h-150' />
              </div>
              <div className='flex justify-center'>
                <FaLongArrowAltDown 
                  transform={`rotate(${way == 'main' ? 180 : way == 'left' ? 180-30 : 180+30})`}
                  size={60}
                  style={{fill: way == 'main' ? playerColor : 'white'}}
                />
              </div>
              </div>
              )
            )
          }
        </CardPortal>;
}

export default CardChoiceMenu;
