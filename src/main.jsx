// Suprimir errores de cpapi.spotify.com globalmente
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('cpapi.spotify.com')) return;
  originalError.apply(console, args);
};


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)