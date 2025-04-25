import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('spotify_token'));
  const [loading, setLoading] = useState(false); // Estado de carga para las operaciones del contexto
  const [contextError, setContextError] = useState(null); // Estado de error a nivel de contexto

  // se usa useCallback para memoizar la función y evitar problemas con useEffect dependencies
  const exchangeCodeForToken = useCallback(async (code) => {
    setLoading(true);
    setContextError(null); // Limpiar errores previos del contexto

    try {
      // Validar que las variables de entorno existan antes de usarlas
      if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID || !import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || !import.meta.env.VITE_REDIRECT_URI) {
         throw new Error("Spotify API credentials or redirect_uri are not set in environment variables.");
      }

      // Crear Basic Auth token
      const basic = btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`);

      // Endpoint para el intercambio de código - URL CORREGIDA
      const tokenUrl = 'https://accounts.spotify.com/api/token';

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: import.meta.env.VITE_REDIRECT_URI
        })
      });

      const data = await response.json();

      if (!response.ok) {
         // Si Spotify devuelve un error (ej: Invalid authorization code)
         const errorMessage = data.error_description || data.error || 'Error desconocido al obtener el token';
         console.error('API Error al obtener token:', data);
         throw new Error(`Error al obtener el token: ${errorMessage}`);
      }

      // Éxito al obtener el token
      setToken(data.access_token);
      localStorage.setItem('spotify_token', data.access_token);

      // Opcional: Guardar refresh_token si lo vas a usar
      if (data.refresh_token) {
         localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }

      return data.access_token;

    } catch (error) {
      console.error('Error en exchangeCodeForToken:', error);
      setContextError(error.message); // Establecer error en el estado del contexto
      // No lanzar el error aquí si quieres que el componente que llama lo maneje.
      // Pero si quieres que el componente que llama sepa que falló, puedes relanzarlo.
      // Para que Dashboard lo capture, lo relanzamos.
      throw error;
    } finally {
      setLoading(false); // Asegurarse de que loading se desactiva
    }
  }, []); // Dependencias de useCallback: vacío porque las env vars son estáticas

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_refresh_token'); // Limpiar refresh token también
    sessionStorage.removeItem('auth_state'); // Limpiar estado de autenticación
  }, []); // logout no tiene dependencias externas

  const value = {
    token,
    loading, // Loading del contexto (para operaciones como el intercambio de token)
    contextError, // Error del contexto
    exchangeCodeForToken,
    logout,
    // Puedes añadir aquí más funciones de la API de Spotify que necesites (ej: fetchProfile, searchTracks)
  };

  return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>;
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify debe usarse dentro de un SpotifyProvider');
  }
  return context;
}