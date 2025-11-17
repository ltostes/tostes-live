import React from 'react';
import ReactDOM from 'react-dom/client';

import '@tostes/styles/reset.css';
import '@tostes/styles/index.css';

import Main from './pages/Main/Main';
import RollerCoasterRama from './pages/RollerCoasterRama';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Main />},
  { path: "/gmtk-gamejam-2025", element: <RollerCoasterRama />},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);