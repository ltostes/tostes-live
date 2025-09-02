import React from 'react';
import ReactDOM from 'react-dom/client';

import './reset.css'
import './index.css';

import Main from './pages/Main/Main';
import RollerCoasterRama from './pages/RollerCoasterRama';
import BoardGamePrototype from './pages/BoardGamePrototype/BoardGamePrototype';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Main />},
  { path: "/gmtk-gamejam-2025", element: <RollerCoasterRama />},
  { path: "/boardgameprototype", element: <BoardGamePrototype />},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);