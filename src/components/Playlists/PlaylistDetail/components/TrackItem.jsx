const TrackItem = ({ track, index, currentTrack, isInSidebar, onClick }) => {
    return (
      <button
        onClick={() => onClick(track)}
        className={`w-full ${
          isInSidebar
            ? "flex items-center gap-3 p-2"
            : "grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-4 py-2"
        } hover:bg-gray-800 rounded group ${
          currentTrack?.uri === track.uri ? "bg-gray-800" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {!isInSidebar && (
            <span className="w-5 text-gray-400 text-sm">{index + 1}</span>
          )}
          <img
            src={track.album.images?.[0]?.url || "/default-song.png"}
            alt={track.name}
            className="w-10 h-10 rounded"
          />
        </div>
  
        <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
          <p
            className={`text-sm font-medium truncate ${
              currentTrack?.uri === track.uri ? "text-green-500" : "text-white"
            }`}
          >
            {track.name}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
  
        {!isInSidebar && (
          <div className="flex items-center">
            <p className="text-gray-400 text-sm truncate">{track.album.name}</p>
          </div>
        )}
  
        <div className="flex items-center">
          <span className="text-gray-400 text-sm">
            {formatDuration(track.duration_ms)}
          </span>
        </div>
      </button>
    );
  };
  
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };
  
  export default TrackItem;