import React from 'react';

import styles from './Main.module.css'

import { Link } from 'react-router-dom';

import { StandardPage } from '@tostes/ui';

function Main() {
  return <StandardPage 
      title={'tostes.live'}
    >
      <Link to={"/gmtk-gamejam-2025"}>
        #1 RollerCoaster Rama!
      </Link>
      <Link to={"/surpresa"}>
        #2 Surpresa
      </Link>
    </StandardPage>
}

export default Main;
