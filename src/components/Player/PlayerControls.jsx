export const PlayerControls = ({ isPlaying, onPrevious, onTogglePlay, onNext }) => (
  <div className="flex items-center space-x-4">
    <button
      onClick={onPrevious}
      className="text-white hover:text-green-500 transition"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
      </svg>
    </button>

    <button
      onClick={onTogglePlay}
      className="bg-green-600 rounded-full p-2 hover:scale-110 transition"
    >
      {isPlaying ? (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
        </svg>
      ) : (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </button>

    <button
      onClick={onNext}
      className="text-white hover:text-green-500 transition"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
      </svg>
    </button>
  </div>
);