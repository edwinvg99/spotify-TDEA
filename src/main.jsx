import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { SpotifyProvider } from './context/SpotifyContext';
import App from './App.jsx'
import './styles/index.css'

// Mejorar el manejo de errores
const originalError = console.error;
console.error = (...args) => {
  // Ignorar errores específicos de Spotify
  if (
    args[0]?.includes?.('cpapi.spotify.com') || 
    args[0]?.includes?.('PlayLoad event failed')
  ) return;
  originalError.apply(console, args);
};

// Agregar listener global para errores de autenticación
window.addEventListener('unhandledrejection', event => {
  if (
    event.reason?.message?.includes('authentication') || 
    event.reason?.message?.includes('authorized')
  ) {
    console.log('Error de autenticación detectado, redirigiendo...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpotifyProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SpotifyProvider>
  </React.StrictMode>
)