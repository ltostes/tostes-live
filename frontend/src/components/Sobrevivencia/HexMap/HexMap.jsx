import React from 'react';

import styles from './HexMap.module.css'

import { HexGrid, Layout, Hexagon } from 'react-hexgrid';
import { _ } from 'lodash';

import Orientation from 'react-hexgrid/lib/models/Orientation';

import { CustomHexTile } from '../MapElements';

function HexMap({ hex_map, controls, children}) {

  const { translation, zoom } = controls;

  const [boardViewSize, setBoardViewSize] = React.useState([210, 90]);
  React.useEffect(() => {
    setBoardViewSize([210 * 2 * (1/zoom), 90 * 2 * (1/zoom)]);
  }, [zoom]);

  const layoutDefs = {
    size:{ x: 10, y: 10 },
    flat: false,
    spacing: 1.08,
    origin:{ x: boardViewSize[0]/2, y: boardViewSize[1]/2 },
    orientation: new Orientation(Math.sqrt(3), Math.sqrt(3)/2, 0, 3/2, Math.sqrt(3)/3, -1/3, 0, 2/3, 0 ) // pointy
  }

  return (<HexGrid 
        style={{ width: '100%', height: '100%' }}
        viewBox={`0 -15 ${boardViewSize[0]} ${boardViewSize[1]}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Layout {...layoutDefs}>
          {
            // Base Background hex
            hex_map.map((hex) => {
            const hexStyles = [styles[hex.type]]

            return (
              <Hexagon 
                key={hex.key}
                q={hex.q} r={hex.r} s={hex.s}
                className={hexStyles.join(' ')}
              />
            )
          })}      
          {
            // All children must be CustomTile (to be fit within a hexagon)
            children.flat()//.filter(child => (React.isValidElement(child) && child.type === CustomHexTile))
          }
          </Layout>
      </HexGrid>);
}

export default HexMap;
