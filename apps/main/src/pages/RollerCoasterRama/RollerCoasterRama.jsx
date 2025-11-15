import React from 'react';
import { StandardPage } from '@tostes/ui';

import styles from './RollerCoasterRama.module.css'

function RollerCoasterRama() {
  return (
    <StandardPage
      title={'RollerCoaster Rama!'}
      description={
        <>
          A game made for the GMTK Game Jam 2025.
          <br/>
          <br/>
          <a href='#about'>@tostes.live</a>
        </>
      }
      className={styles.light}
      >
      <iframe 
        height="166" 
        style={{border: 0}}
        src="https://itch.io/embed/3784936">
      </iframe>
    </StandardPage>
  );
}

export default RollerCoasterRama;
