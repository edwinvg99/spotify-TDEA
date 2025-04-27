// src/components/PlaylistGrid.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpotify } from '../../context/SpotifyContext';
import PlaylistDetail from './PlaylistDetail';


const PlaylistGrid = ({ sidebarMode = false }) => {
  const { token } = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las playlists');
        }

        const data = await response.json();
        setPlaylists(data.items || []);
      } catch (error) {
        console.error('Error cargando playlists:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleBack = () => {
    setSelectedPlaylist(null);
  };

  if (loading) {
    return (
      <div className="animate-pulse overflow-y-scroll no-scrollbar">
        {sidebarMode ? (
          <div className="space-y-3 overflow-y-scroll no-scrollbar">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray-700 rounded "></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-700 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-scroll no-scrollbar" >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="aspect-square bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 overflow-y-scroll no-scrollbar">
        {error}
      </div>
    );
  }

  if (sidebarMode) {
    if (selectedPlaylist) {
      return (
        <div className="h-full overflow-y-scroll no-scrollbar">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a playlists
          </button>
          <PlaylistDetail playlistId={selectedPlaylist.id} isInSidebar={true} />
        </div>
      );
    }

    return (
      <div className="space-y-2 overflow-y-scroll no-scrollbar">
        <h3 className="text-white font-semibold mb-3">Tus Playlists</h3>
        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-scroll no-scrollbar">
          {playlists.map(playlist => (
            <button
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist)}
              className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-all group text-left"
            >
              <img
                src={playlist.images?.[0]?.url || '/default-playlist.png'}
                alt={playlist.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="overflow-hidden overflow-y-scroll no-scrollbar">
                <p className="text-white text-sm font-medium truncate group-hover:text-purple-400">
                  {playlist.name}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {playlist.tracks?.total || 0} canciones
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Vista normal (no sidebar)
  return (
    <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4  overflow-y-scroll no-scrollbar bg-red-500 ">
      {playlists.map(playlist => (
        <Link
          key={playlist.id}
          to={`/playlist/${playlist.id}`}
          className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all group overflow-y-scroll no-scrollbar"
        >
          <div className="aspect-square">
            <img
              src={playlist.images?.[0]?.url || '/default-playlist.png'}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-white font-bold truncate group-hover:text-purple-400">
              {playlist.name}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {playlist.tracks?.total || 0} canciones
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PlaylistGrid;