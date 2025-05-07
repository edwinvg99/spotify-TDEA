// src/components/PlaylistGrid.jsx
import { useState, useEffect } from 'react';
import { useSpotify } from '../../../context/SpotifyContext';
import PlaylistDetail from '../PlaylistDetail/PlaylistDetail';
import SearchBar from './components/SearchBar';
import PlaylistCard from './components/PlaylistCard';
import LoadingState from './components/LoadingState';
import BackButton from './components/BackButton';

const PlaylistGrid = ({ sidebarMode = true }) => {
  const { token } = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar playlists basado en el término de búsqueda
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        let allPlaylists = [];
        let url = 'https://api.spotify.com/v1/me/playlists?limit=50';

        while (url) {
          const response = await fetch(url, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) throw new Error('Error al cargar las playlists');

          const data = await response.json();
          allPlaylists = [...allPlaylists, ...data.items];
          url = data.next;
        }

        setPlaylists(allPlaylists);
      } catch (error) {
        console.error('Error cargando playlists:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  if (loading) return <LoadingState sidebarMode={sidebarMode} />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  // Vista del sidebar con playlist seleccionada
  if (sidebarMode && selectedPlaylist) {
    return (
      <div className="h-full overflow-y-scroll no-scrollbar ">
        <BackButton onClick={() => setSelectedPlaylist(null)} />
        <PlaylistDetail playlistId={selectedPlaylist.id} isInSidebar={true} />
      </div>
    );
  }

  // Vista del sidebar
  if (sidebarMode) {
    return (
      <div className="space-y-2 overflow-y-scroll no-scrollbar">
        <div className="flex items-center justify-between mb-7 mt-3 ">
          <h3 className="text-white font-semibold">Tus Playlists</h3>
          <div className="relative mr-4 mb-[-2px]">
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              isSidebar={true} 
            />
          </div>
        </div>
        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-scroll no-scrollbar ">
          {filteredPlaylists.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isSidebar={true}
              onClick={setSelectedPlaylist}
            />
          ))}
          {filteredPlaylists.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No se encontraron playlists que coincidan con "{searchTerm}"
            </p>
          )}
        </div>
      </div>
    );
  }

  // Vista normal (no sidebar)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Tus Playlists</h2>
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          isSidebar={false} 
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPlaylists.map(playlist => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            isSidebar={false}
          />
        ))}
        {filteredPlaylists.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">
              No se encontraron playlists que coincidan con "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistGrid;