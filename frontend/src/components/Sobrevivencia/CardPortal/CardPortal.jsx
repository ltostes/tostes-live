import React from 'react';
import { createPortal } from 'react-dom';

import styles from './CardPortal.module.css';

function CardPortal({ children }) {
  const [host, setHost] = React.useState(null);

  React.useEffect(() => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    host.setAttribute('data-react-portal-host', '')

    setHost(host);

    return () => {
      host.remove();
    };
  }, []);

  if (!host) {
    return null;
  }

  return createPortal(<>
    <div className={styles.wrapper}>
      <div className={styles.backdrop} />
      
      {children}
    </div>
  </>, host);
}

export default CardPortal;