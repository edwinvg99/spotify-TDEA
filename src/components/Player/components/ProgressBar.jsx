const ProgressBar = ({ 
    progress, 
    duration, 
    formatTime, 
    handleSeek, 
    handleDragStart, 
    handleDragEnd, 
    progressBarStyle, 
    sidebarMode 
  }) => (
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
  
  export default ProgressBar;