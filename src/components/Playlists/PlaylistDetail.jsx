// src/components/PlaylistDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSpotify } from '../../context/SpotifyContext';
import { useSpotifySDK } from '../../hooks/useSpotifySDK';

const PlaylistDetail = ({ playlistId, isInSidebar = false }) => {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSpotify();
  const params = useParams();
  const { playNewTrack, currentTrack, isReady } = useSpotifySDK(token);

  // Usar el playlistId de props o de los parámetros de la URL
  const id = playlistId || params.playlistId;

  const handlePlayTrack = async (track) => {
    if (!isReady) {
      console.log('El reproductor no está listo aún');
      return;
    }
    try {
      await playNewTrack(track.uri);
    } catch (error) {
      console.error('Error reproduciendo track:', error);
    }
  };

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      if (!token || !id) return;

      try {
        setLoading(true);
        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Error al cargar la playlist');
        }

        const data = await response.json();
        setPlaylist(data);
        setTracks(data.tracks.items);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [token, id]);

  if (loading) {
    return (
      <div className={`animate-pulse ${isInSidebar ? 'p-2' : 'p-6'}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`bg-gray-700 rounded ${isInSidebar ? 'w-16 h-16' : 'w-48 h-48'}`}></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 ${isInSidebar ? 'p-2' : 'p-6'}`}>
        {error}
      </div>
    );
  }

  if (!playlist) return null;

  const containerClass = isInSidebar 
    ? 'text-white p-2 space-y-4' 
    : 'text-white p-6 space-y-6';

  const headerClass = isInSidebar
    ? 'flex items-center gap-4'
    : 'flex items-center gap-8';

  const imageClass = isInSidebar
    ? 'w-16 h-16 rounded shadow-lg'
    : 'w-48 h-48 rounded-lg shadow-xl';

  const titleClass = isInSidebar
    ? 'text-lg font-bold'
    : 'text-3xl font-bold';

  return (
    <div className={ `${containerClass} overflow-y-scroll no-scrollbar `}>
      <div className={headerClass}>
        <img
          src={playlist.images?.[0]?.url || '/default-playlist.png'}
          alt={playlist.name}
          className={imageClass}
        />
        <div>
          <h2 className={titleClass}>{playlist.name}</h2>
          <p className="text-gray-400">
            {playlist.tracks.total} canciones • {playlist.owner.display_name}
          </p>
        </div>
      </div>

      <div className={`${isInSidebar ? 'max-h-[calc(100vh-350px)]' : ''} `}>
        {tracks.map((item, index) => (
          <button
            key={item.track.id + index}
            onClick={() => handlePlayTrack(item.track)}
            className={`w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded group ${
              currentTrack?.uri === item.track.uri ? 'bg-gray-800' : ''
            }`}
          >
            <img
              src={item.track.album.images?.[0]?.url || '/default-song.png'}
              alt={item.track.name}
              className="w-10 h-10 rounded"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className={`text-sm font-medium truncate ${
                currentTrack?.uri === item.track.uri ? 'text-green-500' : 'text-white'
              }`}>
                {item.track.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {item.track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
            {!isInSidebar && (
              <span className="text-gray-400 text-sm">
                {Math.floor(item.track.duration_ms / 60000)}:
                {String(Math.floor((item.track.duration_ms % 60000) / 1000)).padStart(2, '0')}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetail;