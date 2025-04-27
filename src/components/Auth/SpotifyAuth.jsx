import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar estados anteriores al montar el componente
    localStorage.removeItem('spotify_token');
    sessionStorage.removeItem('auth_state');
  }, []);

  const handleLogin = async () => {
    if (isAuthenticating) return;
    
    try {
      setIsAuthenticating(true);
      
      // Generar estado seguro y guardarlo
      const state = crypto.randomUUID();
      console.log('Generando nuevo estado:', state);
      sessionStorage.setItem('auth_state', state);
  
      // Scope necesarios
      const scopes = [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-top-read',
        'streaming',
        'app-remote-control',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing'
      ].join(' ');
  
      // Construir y verificar parámetros de autorización
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        state: state,
        scope: scopes,
        show_dialog: true
      });

      // Verificar que los parámetros requeridos estén presentes
      if (!params.get('client_id') || !params.get('redirect_uri')) {
        throw new Error('Faltan credenciales de Spotify en las variables de entorno');
      }
  
      console.log('Iniciando autorización con estado:', state);
      const authUrl = `https://accounts.spotify.com/authorize?${params}`;
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Error en proceso de login:', error);
      setIsAuthenticating(false);
      sessionStorage.removeItem('auth_state');
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
};

export default SpotifyAuth;