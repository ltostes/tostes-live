import React from 'react';

import styles from './MainMap.module.css'

import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex, HexUtils } from 'react-hexgrid';
import Orientation from 'react-hexgrid/lib/models/Orientation';

import { HEX_MAP_LAYOUT } from './constants';

export function translateRowColToGRS(row, col) {
  // convert row,col to g,r,s
  const calc_col = col - 10;
  const calc_row = row - 5;

  const g = calc_col - Math.floor(calc_row/2);
  const r = calc_row;
  const s = -g - r;

  return {g, r, s};
}

function MainMap({controls, playerPos, movePlayer, gameStarted, children}) {

  const { translation, zoom } = controls;
  const { hex: playerHex, dir: playerDir } = playerPos;

  const [boardSize, setBoardSize] = React.useState([210, 90]);
  React.useEffect(() => {
    setBoardSize([210 * 2 * (1/zoom), 90 * 2 * (1/zoom)]);
  }, [zoom]);

  const layoutDefs = {
    size:{ x: 10, y: 10 },
    flat: false,
    spacing: 1.08,
    origin:{ x: boardSize[0]/2, y: boardSize[1]/2 },
    orientation: new Orientation(Math.sqrt(3), Math.sqrt(3)/2, 0, 3/2, Math.sqrt(3)/3, -1/3, 0, 2/3, 0 ) // pointy
  }

  function updateChildrenPositions(childElement) {
    if (Array.isArray(childElement)) return childElement.map(child => updateChildrenPositions(child));
    if (childElement === null || typeof childElement !== 'object') return;
    const {hex, g, r, s, row, col} = childElement.props;

    if (hex instanceof Hex) {
      const childPos = HexUtils.hexToPixel(hex, layoutDefs);
      return React.cloneElement(childElement, { transform: `translate(${childPos.x}, ${childPos.y})` });
    }

    if ([g,r,s].every(n => typeof n === 'number')) {
      const childHex = new Hex(g,r,s);
      const childPos = HexUtils.hexToPixel(childHex, layoutDefs);
      return React.cloneElement(childElement, { transform: `translate(${childPos.x}, ${childPos.y})` });
    }

    if ([row,col].every(n => typeof n === 'number')) {
      const {g, r, s} = translateRowColToGRS(row, col);

      const childHex = new Hex(g,r,s);
      const childPos = HexUtils.hexToPixel(childHex, layoutDefs);
      return React.cloneElement(childElement, { transform: `translate(${childPos.x}, ${childPos.y})` });
    }

    return childElement;
  };

  return (<HexGrid 
        style={{ width: '100%', height: '100%' }}
        viewBox={`0 -15 ${boardSize[0]} ${boardSize[1]}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Layout {...layoutDefs}>
          {HEX_MAP_LAYOUT.map((hex) => {
            const thisHex = new Hex(hex.q, hex.r, hex.s);
            const isSelectable = HexUtils.equals(thisHex, playerHex);

            const dirs = playerDir == 0 ? [5,0,1] : playerDir == 5 ? [4,5,6] : [playerDir-1, playerDir, playerDir+1];

            const isDirs = dirs.some((dir) => {
              const dirHex = HexUtils.add(playerHex, HexUtils.direction(dir));
              return HexUtils.equals(thisHex, dirHex);
            });

            const hexStyles = [styles[hex.type]]
            if (gameStarted) {
              if(isSelectable) hexStyles.push(styles['selectable']);
              if(isDirs) hexStyles.push(styles['dirs']);
            }

            return (
              <Hexagon 
                key={hex.key}
                q={hex.q} r={hex.r} s={hex.s}
                className={hexStyles.join(' ')}
                >
                {/* <Text className={styles[`hex-text`]}>{`#${hex.key}. ${hex.q}, ${hex.r}, ${hex.s}`}</Text> */}
              </Hexagon>
            )
          })}
          {
            updateChildrenPositions(children)
          }        
          </Layout>
      </HexGrid>);
}

export default MainMap;
