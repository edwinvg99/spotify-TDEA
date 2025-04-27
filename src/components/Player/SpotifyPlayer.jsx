import { useEffect } from 'react';
import { useSpotifySDK } from '../../hooks/useSpotifySDK';
import { useSpotify } from '../../context/SpotifyContext';

const SpotifyPlayer = () => {
  const { token } = useSpotify();
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    progress, 
    duration,
    seekTo,
    isReady
  } = useSpotifySDK(token);

  const handleSeek = (e) => {
    const position = parseInt(e.target.value);
    seekTo(position);
  };

  if (!currentTrack || !isReady) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-[9999]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Información de la canción */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <img
            src={currentTrack.album?.images?.[0]?.url || '/default-song.png'}
            alt={currentTrack.name}
            className="w-14 h-14 rounded shadow-lg"
          />
          <div className="min-w-0">
            <h3 className="text-white font-medium text-sm truncate">
              {currentTrack.name}
            </h3>
            <p className="text-gray-400 text-xs truncate">
              {currentTrack.artists?.map(artist => artist.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Controles centrales */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-white hover:bg-gray-200 transition-colors"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M9 9h1v6H9zm5 0h1v6h-1z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
          </button>

          {/* Barra de progreso */}
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10">
              {Math.floor(progress / 1000 / 60)}:
              {String(Math.floor((progress / 1000) % 60)).padStart(2, '0')}
            </span>
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400 w-10">
              {Math.floor(duration / 1000 / 60)}:
              {String(Math.floor((duration / 1000) % 60)).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Espacio para mantener el layout centrado */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;