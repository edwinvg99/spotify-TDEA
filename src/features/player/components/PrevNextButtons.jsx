import PlayButton from "./PlayButton";

const PrevNextButtons = ({
  previousTrack,
  nextTrack,
  isPlaying,
  togglePlay,
  sidebarMode,
}) => (
  <>
    <button
      onClick={previousTrack}
      className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
    >
      <svg
        className={`w-${sidebarMode ? 4 : 5} h-${sidebarMode ? 4 : 5}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        />
      </svg>
    </button>

    <PlayButton
      isPlaying={isPlaying}
      togglePlay={togglePlay}
      sidebarMode={sidebarMode}
    />

    <button
      onClick={nextTrack}
      className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
    >
      <svg
        className={`w-${sidebarMode ? 4 : 5} h-${sidebarMode ? 4 : 5}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    </button>
  </>
);

export default PrevNextButtons;
