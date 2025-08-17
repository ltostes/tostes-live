import React from 'react';
import StandardPage from '../../components/StandardPage/StandardPage';

import styles from './RollerCoasterRama.module.css'

function RollerCoasterRama() {
  return (
    <StandardPage
      title={'RollerCoaster Rama!'}
      description={
        <>
          An amazing game that was made in the GMTK Game Jam 2025.
          <br/>
          It is the first of many
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
