import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('spotify_token'));
  const [loading, setLoading] = useState(false);
  const [contextError, setContextError] = useState(null);

  const navigate = useNavigate();

  const exchangeCodeForToken = useCallback(async (code) => {
    if (!code) return null;

    setLoading(true);
    setContextError(null);

    try {
      // Preparar credenciales
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      const redirectUri = import.meta.env.VITE_REDIRECT_URI;

      if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Faltan credenciales en las variables de entorno');
      }

      const basic = btoa(`${clientId}:${clientSecret}`);

      // Realizar la petición de token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || 'Error al obtener el token');
      }

      const accessToken = data.access_token;
      
      // Guardar token y actualizar estado
      localStorage.setItem('spotify_token', accessToken);
      setToken(accessToken);

      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }

      return accessToken;
    } catch (error) {
      console.error('Error intercambiando código:', error);
      setContextError(error.message);
      setToken(null);
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_refresh_token');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Intentar pausar la reproducción antes de cerrar sesión
      const player = window.Spotify?.Player;
      if (player) {
        await fetch('https://api.spotify.com/v1/me/player/pause', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error al pausar la reproducción:', error);
    } finally {
      // Limpiar todo el estado y storage
      setToken(null);
      setContextError(null);
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_refresh_token');
      sessionStorage.removeItem('auth_state');
    }
  }, [token]);

  // Validar token inicial
  useEffect(() => {
    const validateToken = async () => {
      const currentToken = localStorage.getItem('spotify_token');
      if (!currentToken) {
        setToken(null);
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (!response.ok) {
          throw new Error('Token inválido');
        }

        setToken(currentToken);
      } catch (error) {
        console.error('Error validando token:', error);
        setToken(null);
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_refresh_token');
      }
    };

    validateToken();
  }, []);

  return (
    <SpotifyContext.Provider value={{
      token,
      loading,
      contextError,
      exchangeCodeForToken,
      logout
    }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify debe usarse dentro de un SpotifyProvider');
  }
  return context;
}