import { useState } from 'react';
import { useSpotify } from '../../context/SpotifyContext'; // Asegúrate que la ruta sea correcta

function Login() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // No necesitas setToken aquí, el Dashboard manejará la recepción del token

  const handleLogin = () => {
    if (isAuthenticating) return;

    try {
      setIsAuthenticating(true);

      // Generar state para protección CSRF
      const state = crypto.randomUUID();
      sessionStorage.setItem('auth_state', state);

      // Scopes necesarios - añade o quita según las funcionalidades que necesites
      const scopes = [
        // Información básica del usuario
        'user-read-private',
        'user-read-email',
        
        // Acceso a playlists
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        
        // Biblioteca del usuario
        'user-library-read',
        'user-top-read',
        
        // Reproducción (necesarios para el Web Playback SDK)
        'streaming',
        'app-remote-control',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing'
      ].join(' ');
      

      // Construir URL de autorización
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        state: state,
        scope: scopes,
        show_dialog: true // Opcional: fuerza al usuario a aprobar cada vez
      });

      // Redirigir a Spotify - URL CORREGIDA
      window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
      

    } catch (error) {
      console.error('Error en handleLogin:', error);
      setIsAuthenticating(false);
      sessionStorage.removeItem('auth_state');
      // Considera mostrar un mensaje al usuario si hay un error antes de redirigir
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <button
        onClick={handleLogin}
        disabled={isAuthenticating}
        className={`
          bg-green-500 hover:bg-green-600 text-white font-bold
          py-4 px-6 rounded-full transition-colors
          ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isAuthenticating ? 'Conectando...' : 'Conectar con Spotify'}
      </button>
    </div>
  );
}

export default Login;