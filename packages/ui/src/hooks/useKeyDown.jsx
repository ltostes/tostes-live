import React from 'react';

function useKeyDown(callback, key) {
  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === key) {
        callback();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, key]);
}

export default useKeyDown;