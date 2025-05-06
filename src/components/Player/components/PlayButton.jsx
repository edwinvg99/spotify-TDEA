const PlayButton = ({ isPlaying, togglePlay, sidebarMode }) => (
  <button
    onClick={togglePlay}
    className={`rounded-full bg-white hover:bg-gray-200 transition-colors p-${sidebarMode ? 2 : 3}`}
  >
    {isPlaying ? (
      <svg className={`w-${sidebarMode ? 4 : 6} h-${sidebarMode ? 4 : 6}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
      </svg>
    ) : (
      <svg className={`w-${sidebarMode ? 4 : 6} h-${sidebarMode ? 4 : 6}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    )}
  </button>
);

export default PlayButton;