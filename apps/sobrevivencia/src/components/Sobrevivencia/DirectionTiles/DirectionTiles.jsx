import React from 'react';
import { FaLongArrowAltDown } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react"

import { CustomHexTile } from '../MapElements';
import { useKeyDown }  from '@tostes/ui';

function DirectionTiles({targetHexes, playerColor, changeDirection, confirmDirection}) {
  useKeyDown(() => changeDirection(false), 'KeyQ')
  useKeyDown(() => changeDirection(), 'KeyE')
  useKeyDown(() => confirmDirection(), 'KeyW')

  return (
    <AnimatePresence>
      {
        targetHexes.map(({key, q, r, s, direction, way},i) => (
                  <motion.g 
                    initial={{opacity: 0, fill: 'white'}}
                    animate={{opacity: 1}}
                    exit={{ opacity: 0 }}
                    // transition={{duration: 3}}
                    key={`direction-${key}`}
                  >
                    <CustomHexTile 
                        q={q}
                        r={r}
                        s={s}
                        style={{stroke: 'white', strokeWidth: 1}}
                        >
                      {
                        <FaLongArrowAltDown 
                        transform={`translate(-6,0) rotate(${-90 -direction*60},6,0) translate(0,-6)`}
                        size={12} // If you were to change this size, also change the fixed '6' in transforms (should be 1/2 the size)
                        style={{fill: way == 'main' ? playerColor : 'white', opacity: 0.5}}
                        />
                      }
                    </CustomHexTile>
                  </motion.g>
                ))
      }
    </AnimatePresence>
  );
}

export default DirectionTiles;
