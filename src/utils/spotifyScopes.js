export const SPOTIFY_SCOPES = [
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
    
    // Reproducción
    'streaming',
    'app-remote-control',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    
    // Historial y estadísticas
    'user-read-recently-played',
    
    'user-library-modify',
    'app-remote-control'

  ].join(' ');
  
