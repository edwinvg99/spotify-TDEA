import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SpotifyProvider } from "./features/authSpotify/context/SpotifyContext";
import { AuthContextProvider } from "./features/authFirebase/context/AuthContext";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SpotifyProvider>
          <App />
        </SpotifyProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
