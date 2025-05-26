import VisibilityIcon from "../../../shared/components/ui/VisibilityIcon";

const PlaylistHeader = ({ playlist, isInSidebar }) => {
  const headerClass = isInSidebar
    ? "flex items-center gap-4 "
    : "flex items-center gap-8";

  const imageClass = isInSidebar
    ? "w-16 h-16 rounded shadow-lg"
    : "w-48 h-48 rounded-lg shadow-xl";

  const titleClass = isInSidebar ? "text-lg font-bold" : "text-3xl font-bold";

  return (
    <div className={headerClass}>
      <img
        src={playlist.images?.[0]?.url || "/default-playlist.png"}
        alt={playlist.name}
        className={imageClass}
      />

      <div className="flex-1 ">
        <div className="flex items-center gap-3 ">
          <h2 className={titleClass}>{playlist.name}</h2>
          <VisibilityIcon isPublic={playlist.public} />
        </div>

        {playlist.description && (
          <p className="text-sm text-gray-400 mt-2 italic line-clamp-2">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistHeader;
