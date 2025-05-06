import { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { useSpotifySDK } from '../../hooks/useSpotifySDK';
import { useSpotify } from '../../context/SpotifyContext';
import TrackInfo from './components/TrackInfo';             // Cambiado
import PlayButton from './components/PlayButton';           // Cambiado
import ProgressBar from './components/ProgressBar';         // Cambiado
import PrevNextButtons from './components/PrevNextButtons'; // Cambiado

// Memoizar los componentes para evitar re-renders innecesarios
const MemoizedTrackInfo = memo(TrackInfo);
const MemoizedPlayButton = memo(PlayButton);
const MemoizedProgressBar = memo(ProgressBar);
const MemoizedPrevNextButtons = memo(PrevNextButtons);

const SpotifyPlayer = ({ sidebarMode = true, standalone = false }) => {
  const { token } = useSpotify();
  
  // SDK hooks
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

  // Estados locales
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Memoized values
  const progressPercentage = useMemo(() => 
    (progress / duration) * 100, 
    [progress, duration]
  );

  const progressBarStyle = useMemo(() => ({
    '--progress-percentage': `${progressPercentage}%`
  }), [progressPercentage]);

  // Callbacks
  const handleSeek = useCallback((e) => {
    const position = parseInt(e.target.value);
    setProgress(position);
    seekTo(position);
  }, [seekTo]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, []);

  // Effects
  useEffect(() => {
    if (!isDragging) {
      setProgress(sdkProgress);
    }
  }, [sdkProgress, isDragging]);

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

  // Memoizar handlers y valores calculados
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

  // Si está en modo sidebar, mostrar versión compacta
  if (sidebarMode) {
    return (
      <div className="bg-gray-900/95 rounded-lg p-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MemoizedTrackInfo currentTrack={currentTrack} sidebarMode={true} />
          </div>
          <MemoizedProgressBar {...playerProps} />
          <div className="flex justify-center items-center gap-4">
            <MemoizedPrevNextButtons {...playerProps} />
          </div>
        </div>
      </div>
    );
  }

  // Vista normal del player
  if (!standalone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 z-[9999]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto sm:flex-1">
          <MemoizedTrackInfo currentTrack={currentTrack} sidebarMode={false} />
        </div>
        <div className="flex flex-col items-center gap-2 w-full sm:flex-1 sm:max-w-xl">
          <div className="flex items-center gap-4">
            <MemoizedPrevNextButtons {...playerProps} />
          </div>
          <MemoizedProgressBar {...playerProps} />
        </div>
        <div className="hidden sm:block sm:flex-1"></div>
      </div>
    </div>
  );
};

export default memo(SpotifyPlayer);