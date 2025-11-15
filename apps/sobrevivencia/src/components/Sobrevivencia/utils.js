import { HEX_MAP_LAYOUT } from "./constants";
import { Hex, HexUtils } from "react-hexgrid";

import * as d3 from 'd3';

export function denormalizeCoords(row, col) {

    // Here ORow - Offset row, as defined in the HEX MAP LAYOUT (from -13 to +3)
    // Row and Col correspond to row and cols staring from 0 at the top left

    const minRow = d3.min(HEX_MAP_LAYOUT.map(({row}) => row))
    const minCol = d3.min(HEX_MAP_LAYOUT.map(({col}) => col))

    const calcRow = row + minRow;
    const calcCol = col + minCol;

    return {orow: calcRow, ocol: calcCol}
}

export function translateRowColToGRS(row, col) {
  // convert row,col to q,r,s
  const {orow, ocol} = denormalizeCoords(row,col);

  const q = ocol - Math.floor(orow/2);
  const r = orow;
  const s = -q - r;

  return {q, r, s};
}

export function parseHex(hex) {
    const {q, r, s} = hex;

    return new Hex(q, r, s)
}

export function getHex(args) { 

    const {row, col, orow, ocol, hex_map} = args;

    if (!(typeof orow == 'undefined') && !(typeof ocol == 'undefined')) {
        return hex_map.find(tile => tile.row == orow && tile.col == ocol);    
    } else {
        const {orow, ocol} = denormalizeCoords(row,col);

        const retHex = hex_map.find(tile => tile.row == orow && tile.col == ocol);
        
        return retHex
    }
}

export function hexEquals(hex_1, hex_2) {
    if (hex_1 == null || hex_2 == null) return false;
    return HexUtils.equals(parseHex(hex_1),parseHex(hex_2))
}

export function getTargetHexes(args) {

    const {hex_map, hex, direction, player_locations} = args;

    const dirs = direction == 0 ? [5,0,1] : direction == 5 ? [4,5,6] : [direction-1, direction, direction+1];

    const mainHex = parseHex(hex);
    
    return dirs.map((dir,index) => {
        const dir_hex = hex_map.find(th => {
            const testHex = parseHex(th);
            const dirHex = HexUtils.add(mainHex, HexUtils.direction(dir));
            return HexUtils.equals(testHex, dirHex);
        });

        return {...dir_hex, direction: dir, way: index == 1 ? 'main' : index == 0 ? 'right' : 'left'}
    }).filter(d => d.key && !player_locations.some(pl_hex => hexEquals(d, pl_hex))).reverse();
}

export function getNextLocation({hex: hex_coordinates, direction, G}) {

    const { hex_map, players_state } = G;
    const player_locations = Object.values(players_state).map(({hex}) => hex)

    const hex = hex_map.find((map_hex) => hexEquals(hex_coordinates,map_hex));

    const nextLocation = {
        direction,
        hex,
        targetHexes: getTargetHexes({hex, direction, hex_map, player_locations})
    }
    return nextLocation;
}