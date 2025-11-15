import React from 'react';
import { createPortal } from 'react-dom';

import { X as Close } from 'react-feather';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';

import useKeyDown from '../hooks/useKeyDown';

import styles from './PopupModal.module.css';

// Usage example:
// <PopupModal
//   title="My Modal Title"
//   handleDismiss={() => setIsModalOpen(false)}
// >
//   <p>Modal content goes here.</p>
// </PopupModal>

function PopupModal({ title, handleDismiss, children }) {
  useKeyDown(handleDismiss, 'Escape');

    const [host, setHost] = React.useState(null);
  
    React.useEffect(() => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      host.setAttribute('popup-modal-host', '')
  
      setHost(host);
  
      return () => {
        host.remove();
      };
    }, []);
  
    if (!host) {
      return null;
    }

  return createPortal(
    <FocusLock returnFocus={true}>
      <RemoveScroll>
        <div className={styles.wrapper}>
          <div
            className={styles.backdrop}
            onClick={handleDismiss}
          />
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <button
              className={styles.closeBtn}
              onClick={handleDismiss}
            >
              <Close />
            </button>
            {title && <h2>{title}</h2>}
            {children}
          </div>
        </div>
      </RemoveScroll>
    </FocusLock>,
    host
  );
}

export default PopupModal;