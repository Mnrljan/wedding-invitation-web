// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global CSS
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Bungkus App dengan BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);