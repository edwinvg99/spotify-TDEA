import { useState, useEffect, useRef } from 'react';
import { useSpotify } from '../../context/SpotifyContext';
import { useSpotifySDK } from '../../hooks/useSpotifySDK';
import { PlayerControls } from './PlayerControls';
import { PlayerSkeleton } from '../common/LoadingSkeletons';
import { ErrorMessage } from '../common/ErrorMessage';

const SpotifyPlayer = ({ track }) => {
  const [volume, setVolume] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSpotify();
  const { 
    deviceId, 
    isPlaying, 
    progress,
    playerRef,
    setIsPlaying,
    setProgress
  } = useSpotifySDK(token, volume);
  const previousTrackRef = useRef(null);

  const playTrack = async () => {
    if (!deviceId || !track) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [track.uri],
          position_ms: 0
        })
      });

      setIsPlaying(true);
      previousTrackRef.current = track.uri;
    } catch (error) {
      console.error('Error reproduciendo track:', error);
      // Solo mostrar el error si realmente hay un problema
      if (error.status !== 404) {
        setError('Error al reproducir la canción. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para manejar cambios de track
  useEffect(() => {
    if (!track?.uri || !deviceId) return;

    // Si es una track diferente o no hay track previa, reproducir
    if (previousTrackRef.current !== track.uri) {
      playTrack();
    }
  }, [track?.uri, deviceId]);

  // Función para reintentar la reproducción
  const handleRetry = async () => {
    setError(null);
    await playTrack();
  };

  if (isLoading) {
    return <PlayerSkeleton />;
  }

  // Solo mostrar el error si no está reproduciendo
  if (error && !isPlaying) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <ErrorMessage 
          error={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Info de la canción */}
        {track && (
          <div className="flex items-center space-x-4">
            <img 
              src={track.album?.images[0]?.url} 
              alt={track.name}
              className="w-14 h-14 rounded"
            />
            <div>
              <p className="text-white font-medium">{track.name}</p>
              <p className="text-gray-400 text-sm">
                {track.artists?.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Controles de reproducción */}
        <PlayerControls 
          isPlaying={isPlaying}
          onTogglePlay={playTrack}
        />

        {/* Barra de progreso */}
        <div className="flex-1 mx-6">
          <div className="h-1 bg-gray-600 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;