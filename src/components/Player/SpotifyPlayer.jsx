import { useEffect, useState, useCallback } from 'react';
import { useSpotifySDK } from '../../hooks/useSpotifySDK';
import { useSpotify } from '../../context/SpotifyContext';

const SpotifyPlayer = ({ sidebarMode = false, standalone = true }) => {
  const { token } = useSpotify();
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    progress: sdkProgress, 
    duration,
    seekTo,
    isReady,
    nextTrack,
    previousTrack
  } = useSpotifySDK(token);

  // Estado local para el progreso
  const [progress, setProgress] = useState(0);
  // Estado para manejar si el usuario está arrastrando el control deslizante
  const [isDragging, setIsDragging] = useState(false);

  // Actualizar el progreso cuando cambie en el SDK, solo si no está arrastrando
  useEffect(() => {
    if (!isDragging) {
      setProgress(sdkProgress);
    }
  }, [sdkProgress, isDragging]);

  // Memoizar los handlers para evitar recreaciones innecesarias
  const handleSeek = useCallback((e) => {
    const position = parseInt(e.target.value);
    setProgress(position);
    seekTo(position);
    
    // Emitir un evento para notificar el cambio manual
    const event = new CustomEvent('spotify-seek', { 
      detail: { position, percentage: (position / duration) * 100 } 
    });
    window.dispatchEvent(event);
  }, [seekTo, duration]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Actualizar el progreso cada segundo mientras se reproduce
  useEffect(() => {
    if (!isPlaying || !isReady || isDragging) return;

    const intervalId = setInterval(() => {
      setProgress(prev => {
        if (prev >= duration) {
          return 0;
        }
        return Math.min(prev + 1000, duration);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, isReady, duration, isDragging]);

  // Formatear tiempo de manera consistente
  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, []);

  if (!currentTrack || !isReady) return null;

  // Calcular el porcentaje de progreso
  const progressPercentage = (progress / duration) * 100;
  
  // Definir variables CSS para el gradiente
  const progressBarStyle = {
    '--progress-percentage': `${progressPercentage}%`
  };

  // Componentes de UI reutilizables
  const TrackInfo = () => (
    <>
      <img
        src={currentTrack.album?.images?.[0]?.url || '/default-song.png'}
        alt={currentTrack.name}
        className={sidebarMode ? "w-10 h-10 rounded" : "w-14 h-14 rounded shadow-lg"}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-white ${sidebarMode ? "text-sm" : ""} font-medium truncate`}>
          {currentTrack.name}
        </p>
        <p className="text-gray-400 text-xs truncate">
          {currentTrack.artists?.map(artist => artist.name).join(', ')}
        </p>
      </div>
    </>
  );

  const PlayButton = () => (
    <button
      onClick={togglePlay}
      className={`rounded-full bg-white hover:bg-gray-200 transition-colors p-${sidebarMode ? 2 : 2}`}
    >
      {isPlaying ? (
        <svg className={`w-${sidebarMode ? 4 : 6} h-${sidebarMode ? 4 : 6}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10 9v6m4-6v6M9 9h1v6H9zm5 0h1v6h-1z" />
        </svg>
      ) : (
        <svg className={`w-${sidebarMode ? 4 : 6} h-${sidebarMode ? 4 : 6}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
      )}
    </button>
  );
  

  const ProgressBar = () => (
    <div className="w-full flex items-center gap-2">
      <span className={`text-xs text-white w-${sidebarMode ? 8 : 10}`}>
        {formatTime(progress)}
      </span>
      <div className="flex-1 relative">
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={handleSeek}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          className="custom-progress-bar w-full z-10 relative"
          style={progressBarStyle}
        />
      </div>
      <span className={`text-xs text-white w-${sidebarMode ? 8 : 10}`}>
        {formatTime(duration)}
      </span>
    </div>
  );

  const PrevNextButtons = () => (
    <>
      <button
        onClick={previousTrack}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
      >
        <svg className={`w-${sidebarMode ? 4 : 5} h-${sidebarMode ? 4 : 5}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      <PlayButton />

      <button
        onClick={nextTrack}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
      >
        <svg className={`w-${sidebarMode ? 4 : 5} h-${sidebarMode ? 4 : 5}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );

  // Si está en modo sidebar, mostrar versión compacta
  if (sidebarMode) {
    return (
      <div className="bg-gray-900/95 rounded-lg p-2">
        <div className="flex flex-col gap-2">
          {/* Info de la canción */}
          <div className="flex items-center gap-2">
            <TrackInfo />
          </div>

          {/* Barra de progreso */}
          <ProgressBar />

          {/* Controles de reproducción */}
          <div className="flex justify-center items-center gap-4">
            <PrevNextButtons />
          </div>
        </div>
      </div>
    );
  }

  // Si no es standalone, no mostrar la versión grande
  if (!standalone) return null;

  // Vista normal del player
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 z-[9999]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Información de la canción */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <TrackInfo />
        </div>

        {/* Controles centrales */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
          <PlayButton />
          {/* Barra de progreso */}
          <ProgressBar />
        </div>

        {/* Espacio para mantener el layout centrado */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;