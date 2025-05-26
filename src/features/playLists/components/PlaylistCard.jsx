import { Link } from 'react-router-dom';
import VisibilityIcon from '../../../shared/components/ui/VisibilityIcon';

const PlaylistCard = ({ playlist, isSidebar, onClick }) => {
  if (isSidebar) {
    return (
      <button
        onClick={() => onClick(playlist)}
        className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-all group text-left"
      >
        <img
          src={playlist.images?.[0]?.url || '/default-playlist.png'}
          alt={playlist.name}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="flex-1 min-w-0 ">
          <div className="flex items-center gap-2 place-content-between">
            <p className="text-white text-sm font-medium truncate group-hover:text-purple-400">
              {playlist.name}
            </p>
            <VisibilityIcon 
              isPublic={playlist.public}
              isCollaborative={playlist.collaborative}
              size="small" 
            />
          </div>
          <p className="text-gray-400 text-xs truncate">
            {playlist.tracks?.total || 0} canciones • {playlist.owner.display_name}
          </p>
        </div>
      </button>
    );
  }

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all group p-4 "
    >
      <div className="aspect-square relative ">
        <img
          src={playlist.images?.[0]?.url || '/default-playlist.png'}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2">
          <VisibilityIcon 
            isPublic={playlist.public}
            isCollaborative={playlist.collaborative}
          />
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-white font-bold truncate group-hover:text-purple-400">
          {playlist.name}
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          {playlist.tracks?.total || 0} canciones
        </p>
      </div>
    </Link>
  );
};

export default PlaylistCard;