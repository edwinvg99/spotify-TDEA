import { useSpotify } from "../../context/SpotifyContext";
import ConnectButton from "../spotify/ConnectButton";

const Navbar = () => {
  const { token, loading } = useSpotify();

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
    <nav className="bg-black bg-opacity-80 px-8 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <img src="/assets/dj-logo.png" alt="DJ Logo" className="h-10 w-10 rounded-full" />
        <span className="text-2xl font-bold text-purple-400">DJ Nova</span>
      </div>
      <ul className="flex gap-8 text-white font-semibold">
        <li><a href="#about" className="hover:text-purple-400">Sobre mí</a></li>
        <li><a href="#events" className="hover:text-purple-400">Eventos</a></li>
        <li><a href="#songs" className="hover:text-purple-400">Canciones</a></li>
      </ul>
      {!token && !loading && <ConnectButton onClick={handleLogin} />}
    </nav>
  );
};

export default Navbar;