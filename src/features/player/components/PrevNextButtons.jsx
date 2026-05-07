import PlayButton from "./PlayButton";

const PrevNextButtons = ({
  previousTrack,
  nextTrack,
  isPlaying,
  togglePlay,
  sidebarMode,
}) => {
  const iconClass = sidebarMode ? "w-4 h-4" : "w-5 h-5";

  return (
    <>
      <button
        onClick={previousTrack}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white active:scale-95"
        aria-label="Anterior"
      >
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
        </svg>
      </button>

      <PlayButton
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        sidebarMode={sidebarMode}
      />

      <button
        onClick={nextTrack}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white active:scale-95"
        aria-label="Siguiente"
      >
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
        </svg>
      </button>
    </>
  );
};

export default PrevNextButtons;
