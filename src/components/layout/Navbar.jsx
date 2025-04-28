import { useState } from "react";
import { useSpotify } from "../../context/SpotifyContext";
import ConnectButton from "../spotify/ConnectButton";

const Navbar = () => {
  const { token, loading } = useSpotify();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    if (loading) return;

    // Generar state para protección CSRF
    const state = crypto.randomUUID();
    sessionStorage.setItem('auth_state', state);

    // Scopes necesarios
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-library-read',
      'user-top-read',
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
      show_dialog: true
    });

    // Redirigir a Spotify
    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log('Redirigiendo a:', authUrl);
    window.location.href = authUrl;
  };

  return (
    <nav className="bg-black bg-opacity-80 px-4 sm:px-8 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/assets/dj-logo.png" alt="DJ Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <span className="text-xl sm:text-2xl font-bold text-purple-400">DJ Nova</span>
        </div>

        {/* Botón de menú hamburguesa para móviles */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Menú de escritorio */}
        <ul className="hidden lg:flex gap-8 text-white font-semibold">
          <li><a href="#about" className="hover:text-purple-400 transition-colors">Sobre mí</a></li>
          <li><a href="#events" className="hover:text-purple-400 transition-colors">Eventos</a></li>
          <li><a href="#songs" className="hover:text-purple-400 transition-colors">Canciones</a></li>
        </ul>

        <div className="hidden lg:block">
          {!token && !loading && <ConnectButton onClick={handleLogin} />}
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
        <ul className="flex flex-col gap-4 text-white font-semibold">
          <li><a href="#about" className="block py-2 hover:text-purple-400 transition-colors">Sobre mí</a></li>
          <li><a href="#events" className="block py-2 hover:text-purple-400 transition-colors">Eventos</a></li>
          <li><a href="#songs" className="block py-2 hover:text-purple-400 transition-colors">Canciones</a></li>
          {!token && !loading && (
            <li className="py-2">
              <ConnectButton onClick={handleLogin} />
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;