import React from 'react';

import { _ } from 'lodash';
import { Divider } from '@tostes/ui';

function SimpleFlexTable({items, selected}) {
  if (!typeof items === 'object' 
      || items == null 
      || _.isEmpty(Object.entries(items))) {
        return <div>No items to display.</div>;
  }

  let pairsToShow = [];

  if (selected) {
    pairsToShow = selected.map(s => [s, items[s]])
  } 
  else {
    pairsToShow = Object.entries(items)//.filter(f => f[1] !== null && !_.isEmpty(f[1]));
  }
  
  return <div className='flex gap-2 justify-center overflow-x-auto max-w-screen p-3'>
    {pairsToShow.map(([key, value]) => (
      <React.Fragment key={key}>
        <div className='flex flex-col gap-1 items-center'>
          <div className='font-bold'>{key}</div>
          <div>{JSON.stringify(value)}</div>
        </div>
        <Divider style={{colorScheme: 'light'}}/>
      </React.Fragment>
    ))}
  </div>;
}

export default SimpleFlexTable;
