const ProgressBar = ({
  progress,
  duration,
  formatTime,
  handleSeek,
  handleDragStart,
  handleDragEnd,
  progressBarStyle,
  sidebarMode,
}) => (
  <div className="w-full flex items-center gap-2 group">
    <span className="text-xs text-gray-400 w-8 text-right tabular-nums shrink-0">
      {formatTime(progress)}
    </span>

    <div className="flex-1 relative flex items-center">
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
        className="custom-progress-bar progress-bar-interactive w-full z-10 relative"
        style={progressBarStyle}
        aria-label="Progreso de reproducción"
      />
    </div>

    <span className="text-xs text-gray-500 w-8 tabular-nums shrink-0">
      {formatTime(duration)}
    </span>
  </div>
);

export default ProgressBar;
