import React from "react";
import { HexUtils, Hex } from "react-hexgrid";

import { translateRowColToGRS } from "../utils";

export function updateChildrenPositions(childElement, layoutDefs) {
    if (Array.isArray(childElement)) return childElement.map(child => updateChildrenPositions(child, layoutDefs));
    if (childElement === null || typeof childElement !== 'object') return;
    const {hex, q, r, s, row, col} = childElement.props;

    if (hex instanceof Hex) {
      const childPos = HexUtils.hexToPixel(hex, layoutDefs);
      return ({...childElement, props: {...childElement.props, transform: `translate(${childPos.x}, ${childPos.y})`}});
    }

    if ([q,r,s].every(n => typeof n === 'number')) {
      const childHex = new Hex(q,r,s);
      const childPos = HexUtils.hexToPixel(childHex, layoutDefs);
      return ({...childElement, props: {...childElement.props, transform: `translate(${childPos.x}, ${childPos.y})`}});
    }

    if ([row,col].every(n => typeof n === 'number')) {
      const {q, r, s} = translateRowColToGRS(row, col);

      const childHex = new Hex(q,r,s);
      const childPos = HexUtils.hexToPixel(childHex, layoutDefs);
      return ({...childElement, props: {...childElement.props, transform: `translate(${childPos.x}, ${childPos.y})`}});

    return childElement;
  };
}