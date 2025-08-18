import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Konva } from './widgets';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Konva />
  </React.StrictMode>
);

reportWebVitals();
