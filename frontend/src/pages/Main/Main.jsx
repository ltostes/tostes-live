import React from 'react';

import styles from './Main.module.css'

import ToastPad from '../../components/ToastPad/ToastPad';

function Main() {
  return (
    <div className="App">
      <header className={styles.mainHeader}>
        <p>
          tostes.live
        </p>
      </header>
      <ToastPad/>
    </div>
  )
}

export default Main;
