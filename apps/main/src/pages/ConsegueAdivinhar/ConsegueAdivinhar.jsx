import React from 'react';
import { StandardPage, Section, CenteredMain, Header } from '@tostes/ui';

import styles from './ConsegueAdivinhar.module.css'

function ConsegueAdivinhar() {
  return (
    <>
      <div className={styles.dark}>
      <CenteredMain className={styles.dark}>
        <Header>
          Consegue Adivinhar?
        </Header>  

      </CenteredMain>
    </div>
    </>
  );
}

export default ConsegueAdivinhar;
