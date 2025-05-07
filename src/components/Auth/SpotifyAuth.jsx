import { useState, useEffect } from 'react';
import { SPOTIFY_SCOPES } from '../../utils/spotifyScopes';
import ConnectButton from './ConnectButton';

const SpotifyAuth = () => {
  // controlar el proceso de autenticación
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Limpiar estados anteriores al montar el componente
    localStorage.removeItem('spotify_token');
    sessionStorage.removeItem('auth_state');
  }, []);

  const handleLogin = async () => {
    // Evitar múltiples intentos de autenticación simultáneos

    if (isAuthenticating) return;
    
    try {
      setIsAuthenticating(true);
      
      // Generar estado seguro y guardarlo
      const state = crypto.randomUUID();
      sessionStorage.setItem('auth_state', state);
      
      // Construir y verificar parámetros de autorización
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        state: state,
        scope: SPOTIFY_SCOPES,
        show_dialog: true
      });
      
      // Verifica que las credenciales necesarias estén disponibles
      if (!params.get('client_id') || !params.get('redirect_uri')) {
        throw new Error('Faltan credenciales de Spotify en las variables de entorno');
      }
      
      // Construye la URL de autorización y redirige al usuario
      const authUrl = `https://accounts.spotify.com/authorize?${params}`;
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Error en proceso de login:', error);
      setIsAuthenticating(false);
      sessionStorage.removeItem('auth_state');
    }
  };

  return (
    <ConnectButton 
      onClick={handleLogin}
      isAuthenticating={isAuthenticating}
    />
  );
};

export default SpotifyAuth;