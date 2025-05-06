const TrackInfo = ({ currentTrack, sidebarMode }) => {
  // Si no hay track, no renderizamos nada
  if (!currentTrack) return null;

  return (
    <>
      <img
        src={currentTrack?.album?.images?.[0]?.url || '/default-song.png'}
        alt={currentTrack?.name || 'Sin título'}
        className={sidebarMode ? "w-10 h-10 rounded" : "w-14 h-14 rounded shadow-lg"}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-white ${sidebarMode ? "text-sm" : ""} font-medium truncate`}>
          {currentTrack?.name || 'Sin título'}
        </p>
        <p className="text-gray-400 text-xs truncate">
          {currentTrack?.artists?.map(artist => artist.name).join(', ') || 'Artista desconocido'}
        </p>
      </div>
    </>
  );
};

export default TrackInfo;