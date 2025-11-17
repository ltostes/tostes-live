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
      <Link to={"https://tostes-live-sobrevivencia.vercel.app/"} target='_blank' rel="noreferrer">
        #2 Protótipo Sobrevivência na Amazônia
      </Link>
      <Link to={"https://emotionalgeographies-interactivity.vercel.app/TOSTESLIVE/presentation"} target='_blank' rel="noreferrer">
        #3 Interatividade Emotional Geographies
      </Link>
    </StandardPage>
}

export default Main;
