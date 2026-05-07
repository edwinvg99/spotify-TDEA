import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { useSpotifySDK } from "../../shared/hooks/useSpotifySDK";
import TrackInfo from "../player/components/TrackInfo";
import PlayButton from "../player/components/PlayButton";
import ProgressBar from "../player/components/ProgressBar";
import PrevNextButtons from "../player/components/PrevNextButtons";
import VolumeControl from "../player/components/VolumeControl";

const MemoizedTrackInfo = memo(TrackInfo);
const MemoizedPlayButton = memo(PlayButton);
const MemoizedProgressBar = memo(ProgressBar);
const MemoizedPrevNextButtons = memo(PrevNextButtons);
const MemoizedVolumeControl = memo(VolumeControl);

const SpotifyPlayer = ({ sidebarMode = true, standalone = false }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    progress: sdkProgress,
    duration,
    seekTo,
    isReady,
    nextTrack,
    previousTrack,
    volume,
    setVolumeLevel,
  } = useSpotifySDK();

  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const progressPercentage = useMemo(
    () => (duration > 0 ? (progress / duration) * 100 : 0),
    [progress, duration]
  );

  const progressBarStyle = useMemo(
    () => ({ "--progress-percentage": `${progressPercentage}%` }),
    [progressPercentage]
  );

  const handleSeek = useCallback(
    (e) => {
      const position = parseInt(e.target.value);
      setProgress(position);
      seekTo(position);
    },
    [seekTo]
  );

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!isDragging) setProgress(sdkProgress);
  }, [sdkProgress, isDragging]);

  useEffect(() => {
    if (!isPlaying || !isReady || isDragging) return;
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev >= duration) return prev;
        return Math.min(prev + 1000, duration);
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isPlaying, isReady, duration, isDragging]);

  const playerProps = useMemo(
    () => ({
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
      sidebarMode,
    }),
    [
      currentTrack, isPlaying, togglePlay, progress, duration,
      progressBarStyle, handleSeek, handleDragStart, handleDragEnd,
      formatTime, previousTrack, nextTrack, sidebarMode,
    ]
  );

  if (sidebarMode) {
    return (
      <div className="bg-gray-900/95 rounded-xl p-3 space-y-2">
        {/* Info de canción */}
        <div className="flex items-center gap-2">
          <MemoizedTrackInfo currentTrack={currentTrack} sidebarMode={true} />
        </div>

        {/* Barra de progreso */}
        <MemoizedProgressBar {...playerProps} />

        {/* Controles: anterior / play / siguiente */}
        <div className="flex justify-center items-center gap-4">
          <MemoizedPrevNextButtons {...playerProps} />
        </div>

        {/* Control de volumen */}
        <MemoizedVolumeControl volume={volume} setVolumeLevel={setVolumeLevel} />
      </div>
    );
  }

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

        <div className="hidden sm:flex sm:flex-1 justify-end pr-2">
          <MemoizedVolumeControl volume={volume} setVolumeLevel={setVolumeLevel} />
        </div>
      </div>
    </div>
  );
};

export default memo(SpotifyPlayer);
