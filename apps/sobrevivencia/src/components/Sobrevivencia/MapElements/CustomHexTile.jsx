import styled from 'styled-components'

import { Hex, Hexagon } from 'react-hexgrid';

import { translateRowColToGRS } from '../utils';

const Transparent = styled.g`
  /* target hexagon only when inside this component */
  & .hexagon > polygon:first-of-type {
    fill-opacity: 0;
  }
`;

export function CustomHexTile(props) {
    const {hex, q, r, s, row, col, children, ...otherProps} = props;

    const tileHex = {};

    if (hex instanceof Hex) {
        tileHex.q = hex.q;
        tileHex.r = hex.r;
        tileHex.s = hex.s;
    }

    if ([q,r,s].every(n => typeof n === 'number')) {
        tileHex.q = q;
        tileHex.r = r;
        tileHex.s = s;
    }

    if ([row,col].every(n => typeof n === 'number')) {
        const {q, r, s} = translateRowColToGRS(row, col);
        tileHex.q = q;
        tileHex.r = r;
        tileHex.s = s;
    };

    return (
        <Transparent>
            <Hexagon 
                q={tileHex.q} r={tileHex.r} s={tileHex.s}
                {...otherProps}
                >
                {
                    children
                }
            </Hexagon>
        </Transparent>
    );
}