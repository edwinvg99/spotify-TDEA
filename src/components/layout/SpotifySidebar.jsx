import Dashboard from "../Dashboard/Dashboard";
import SpotifyPlayer from "../Player/SpotifyPlayer";
import PlaylistGrid from "../Playlists/PlaylistGrid";

const SpotifySidebar = () => (
  <aside className="bg-gray-950 h-full p-4 flex flex-col gap-6 border-l border-purple-900 shadow-xl overflow-y-auto">
    {/* Perfil de usuario y datos de Spotify */}
    <div>
      <Dashboard sidebarMode={true} />
    </div>
    
        {/* Playlists del usuario */}
        <div>
      <PlaylistGrid sidebarMode={true} />
    </div>
    
    
    {/* Reproductor de Spotify */}
    <div>
      <SpotifyPlayer />
    </div>

  </aside>
);

export default SpotifySidebar;