import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar estados anteriores al montar el componente
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('auth_state');
  }, []);

  const handleLogin = async () => {
    if (isAuthenticating) return;
    
    try {
      setIsAuthenticating(true);
      
      // Generar un state seguro
      const state = crypto.randomUUID();
      localStorage.setItem('auth_state', state);
  
      // Scope necesarios para la aplicación
      const scopes = [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-top-read',
        // Nuevos scopes para reproducción
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'streaming',
        'app-remote-control' // Para control remoto de la reproducción
      ].join(' ');
  
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        state: state,
        scope: scopes,
        show_dialog: true // Forzar diálogo para ver los nuevos permisos
      });
  
      console.log('Scopes solicitados:', scopes);
      const authUrl = `https://accounts.spotify.com/authorize?${params}`;
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Error:', error);
      setIsAuthenticating(false);
      localStorage.removeItem('auth_state');
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