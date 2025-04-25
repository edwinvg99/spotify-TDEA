// src/components/PlaylistDetail.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpotify } from '../../context/SpotifyContext';
import SpotifyPlayer from '../Player/SpotifyPlayer';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { token } = useSpotify();
  const [playlist, setPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!token || !playlistId) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Error al cargar la playlist');
        }

        const data = await response.json();
        setPlaylist(data);
        console.log('Playlist cargada:', data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, token]);

  const handlePlayTrack = async (track) => {
    console.log('Reproduciendo track:', track);
    if (!track.id) {
      console.warn('Track no tiene ID:', track);
      return;
    }

    try {
      // Limpiar timeout anterior si existe
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      // Inicializar AudioContext si no existe
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        await audioContextRef.current.resume();
      }

      // Esperar un momento antes de establecer la track
      retryTimeoutRef.current = setTimeout(() => {
        setCurrentTrack(track);
      }, 500);

    } catch (error) {
      console.error('Error al inicializar audio:', error);
    }
  };

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6 text-white min-h-screen bg-gray-900 flex items-center justify-center">
        <p>Cargando playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 text-white min-h-screen bg-gray-900 flex items-center justify-center">
        <p>No se encontró la playlist</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900 pb-24">
      {/* Botón Volver */}
      <button
        onClick={() => navigate('/callback')}
        className="mb-4 px-4 py-2 text-sm text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
      >
        ← Volver al Inicio
      </button>

      {/* Información de la playlist */}
      {playlist && (
        <div className="flex items-start space-x-6 mb-8">
          <img 
            src={playlist.images?.[0]?.url} 
            alt={playlist.name}
            className="w-48 h-48 shadow-lg rounded"
          />
          <div>
            <p className="text-sm uppercase font-bold text-gray-400">Playlist</p>
            <h1 className="text-4xl font-bold mt-2">{playlist.name}</h1>
            <p className="text-gray-400 mt-2">{playlist.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              {playlist.tracks?.total} canciones
            </p>
          </div>
        </div>
      )}

      {/* Lista de canciones */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        {playlist?.tracks?.items?.map((item, index) => {
          const track = item?.track;
          if (!track) return null;

          return (
            <div
              key={track.id}
              className="grid grid-cols-track-list gap-4 px-4 py-3 hover:bg-gray-700 items-center text-sm group"
            >
              <div className="flex items-center">
                <button
                  onClick={() => handlePlayTrack(track)}
                  className={`mr-2 ${
                    currentTrack?.id === track.id 
                      ? 'text-green-500' 
                      : 'text-white opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {currentTrack?.id === track.id ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                <span>{index + 1}</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={track.album?.images?.[track.album.images.length - 1]?.url || '/default-track.png'}
                  alt={`Portada del álbum ${track.album?.name || 'Album'}`}
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-white truncate">{track.name || 'Unnamed Track'}</p>
                  <p className="text-gray-400 truncate">
                    {track.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                  </p>
                </div>
              </div>
              <div className="text-gray-400 truncate hidden md:block">{track.album?.name || 'Unknown Album'}</div>
              <div className="text-gray-400 text-sm hidden md:block">
                {item.added_at ? new Date(item.added_at).toLocaleDateString() : ''}
              </div>
              <div className="flex items-center justify-end text-gray-400">
                <span>{formatDuration(track?.duration_ms ?? 0)}</span>
              </div>
            </div>
          );
        })}

        {!loading && !error && playlist?.tracks?.items?.length === 0 && (
          <div className="p-4 text-center text-gray-400">Esta playlist no tiene canciones o no se pudieron cargar.</div>
        )}
      </div>

      {/* Reproductor */}
      {currentTrack && <SpotifyPlayer track={currentTrack} />}

      {/* Mensaje de interacción si es necesario */}
      {!audioContextRef.current && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
          Haz clic en una canción para comenzar la reproducción
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;