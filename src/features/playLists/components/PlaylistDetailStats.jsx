const PlaylistStats = ({ playlist }) => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
      {/* Creador */}
      <p className="flex items-center text-gray-300">
        <span className="font-bold text-white hover:underline">
          {playlist.owner.display_name}
        </span>
      </p>

      {/* Seguidores */}
      {playlist.followers && (
        <StatsItem
          icon="followers"
          text={`${playlist.followers.total.toLocaleString()} seguidores`}
          color="green"
        />
      )}

      {/* Canciones */}
      <StatsItem
        icon="songs"
        text={`${playlist.tracks.total} canciones`}
        color="blue"
      />

      {/* Fecha */}
      <StatsItem
        icon="calendar"
        text={`Actualizada: ${formatDate(
          playlist.tracks.items[0]?.added_at || playlist.snapshot_id
        )}`}
        color="purple"
      />
    </div>
  );
};

const StatsItem = ({ icon, text, color }) => {
  const icons = {
    followers:
      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    songs:
      "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  };

  return (
    <p className={`flex items-center text-${color}-400`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 mr-1 text-${color}-400`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={icons[icon]}
        />
      </svg>
      {text}
    </p>
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default PlaylistStats;
