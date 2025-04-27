import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { SpotifyProvider } from './context/SpotifyContext';
import App from './App.jsx'
import './styles/index.css'

// Suprimir errores de cpapi.spotify.com globalmente
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('cpapi.spotify.com')) return;
  originalError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpotifyProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SpotifyProvider>
  </React.StrictMode>
)