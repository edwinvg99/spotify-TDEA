import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./features/authFirebase/context/AuthContext";
import { SpotifyProvider } from "./features/authSpotify/context/SpotifyContext";
import { SpotifySDKProvider } from "./features/authSpotify/context/SpotifySDKContext";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SpotifyProvider>
          {/* SpotifySDKProvider debe ir dentro de SpotifyProvider
              para poder leer el token via useSpotify().
              Inicializa el SDK UNA SOLA VEZ y comparte estado y controles. */}
          <SpotifySDKProvider>
            <App />
          </SpotifySDKProvider>
        </SpotifyProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
