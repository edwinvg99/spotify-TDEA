import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { SpotifyProvider } from './context/SpotifyContext';
import App from './App';
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <SpotifyProvider>
        <App />
      </SpotifyProvider>
    </Router>
  </React.StrictMode>
);