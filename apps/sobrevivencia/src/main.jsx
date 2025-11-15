import React from 'react';
import ReactDOM from 'react-dom/client';

import '@tostes/styles/reset.css';
import '@tostes/styles/index.css';

import SobrevivenciaGame from './components/Sobrevivencia/SobrevivenciaGame/SobrevivenciaGame';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SobrevivenciaGame />
  </React.StrictMode>
);
