import { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { useSpotifySDK } from '../../hooks/useSpotifySDK';
import { useSpotify } from '../../context/SpotifyContext';
import TrackInfo from './components/TrackInfo';             
import PlayButton from './components/PlayButton';           
import ProgressBar from './components/ProgressBar';         
import PrevNextButtons from './components/PrevNextButtons'; 

/**
 * Componentes memoizados para evitar re-renders innecesarios
 * cuando solo cambian las props de un componente específico
 */
const MemoizedTrackInfo = memo(TrackInfo);
const MemoizedPlayButton = memo(PlayButton);
const MemoizedProgressBar = memo(ProgressBar);
const MemoizedPrevNextButtons = memo(PrevNextButtons);

/**
 * Reproductor de Spotify integrado
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.sidebarMode - Si es true, muestra versión compacta para la barra lateral
 * @param {boolean} props.standalone - Si es true, muestra el reproductor completo
 */
const SpotifyPlayer = ({ sidebarMode = true, standalone = false }) => {
  // Obtener token de autenticación de Spotify
  const { token } = useSpotify();
  
  // Obtener funcionalidades del SDK de Spotify
  const { 
    currentTrack,   // Canción actual
    isPlaying,      // Estado de reproducción
    togglePlay,     // Función para alternar reproducción/pausa
    progress: sdkProgress, // Progreso reportado por el SDK
    duration,       // Duración total de la canción
    seekTo,         // Función para saltar a un punto específico
    isReady,        // Si el reproductor está listo
    nextTrack,      // Función para pasar a la siguiente canción
    previousTrack   // Función para volver a la canción anterior
  } = useSpotifySDK(token);

  // Estados locales para el control del progreso
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Calcular el porcentaje de progreso para la barra visual
  const progressPercentage = useMemo(() => 
    (progress / duration) * 100, 
    [progress, duration]
  );

  // Variable CSS para el estilo de la barra de progreso
  const progressBarStyle = useMemo(() => ({
    '--progress-percentage': `${progressPercentage}%`
  }), [progressPercentage]);

  /**
   * Maneja el cambio de posición cuando el usuario mueve el slider
   * @param {Event} e - Evento del input range
   */
  const handleSeek = useCallback((e) => {
    const position = parseInt(e.target.value);
    setProgress(position);
    seekTo(position);
  }, [seekTo]);

  // Funciones para control del arrastre de la barra de progreso
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  /**
   * Formatea milisegundos a formato MM:SS
   * @param {number} ms - Tiempo en milisegundos
   * @returns {string} - Tiempo formateado (MM:SS)
   */
  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, []);

  // Sincronizar el progreso local con el progreso del SDK cuando no se está arrastrando
  useEffect(() => {
    if (!isDragging) {
      setProgress(sdkProgress);
    }
  }, [sdkProgress, isDragging]);

  // Actualizar el progreso localmente cada segundo mientras se reproduce
  useEffect(() => {
    if (!isPlaying || !isReady || isDragging) return;

    const intervalId = setInterval(() => {
      setProgress(prev => {
        if (prev >= duration) return 0;
        return Math.min(prev + 1000, duration);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, isReady, duration, isDragging]);

  // Agrupar todas las props para los componentes hijos en un solo objeto
  const playerProps = useMemo(() => ({
    currentTrack,
    isPlaying,
    togglePlay,
    progress,
    duration,
    progressBarStyle,
    handleSeek,
    handleDragStart,
    handleDragEnd,
    formatTime,
    previousTrack,
    nextTrack,
    sidebarMode
  }), [
    currentTrack,
    isPlaying,
    togglePlay,
    progress,
    duration,
    progressBarStyle,
    handleSeek,
    handleDragStart,
    handleDragEnd,
    formatTime,
    previousTrack,
    nextTrack,
    sidebarMode
  ]);

  // Versión compacta para la barra lateral
  if (sidebarMode) {
    return (
      <div className="bg-gray-900/95 rounded-lg p-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MemoizedTrackInfo currentTrack={currentTrack} sidebarMode={true} />
            {/* <MemoizedPlayButton isPlaying={isPlaying} togglePlay={togglePlay} sidebarMode={true} /> */}
          </div>
          <MemoizedProgressBar {...playerProps} />
          <div className="flex justify-center items-center gap-4">
            <MemoizedPrevNextButtons {...playerProps} />
          </div>
        </div>
      </div>
    );
  }

  // No mostrar nada si no es ni sidebar ni standalone
  if (!standalone) return null;

  // Versión completa para el reproductor principal
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 z-[9999]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Sección izquierda: Información de la canción */}
        <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto sm:flex-1">
          <MemoizedTrackInfo currentTrack={currentTrack} sidebarMode={false} />
        </div>
        
        {/* Sección central: Controles de reproducción */}
        <div className="flex flex-col items-center gap-2 w-full sm:flex-1 sm:max-w-xl">
          <div className="flex items-center gap-4">
            <MemoizedPrevNextButtons {...playerProps} />
            {/* <MemoizedPlayButton isPlaying={isPlaying} togglePlay={togglePlay} sidebarMode={false} /> */}
          </div>
          <MemoizedProgressBar {...playerProps} />
        </div>
        
        {/* Espacio reservado para mantener el diseño equilibrado */}
        <div className="hidden sm:block sm:flex-1"></div>
      </div>
    </div>
  );
};

export default memo(SpotifyPlayer);