const SongCard = ({ song }) => {
  return (
    <div className="group relative bg-gradient-to-br from-purple-900/20 to-black rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02]">
      {/* Contenedor de imagen */}
      <div className="relative aspect-square">
        <img  
          src={song.coverImage}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-300 "
        />
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Botón de reproducción */}
        <button className="absolute bottom-4 right-4 bg-purple-600 p-3 rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-700 hover:scale-110">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Información de la canción */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1">{song.title}</h3>
        <p className="text-sm sm:text-base text-gray-400 line-clamp-1">{song.artist}</p>
        
        {/* Estadísticas de la canción */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{song.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z" />
            </svg>
            <span>{song.plays}</span>
          </div>
        </div>

        {/* Etiquetas */}
        <div className="flex flex-wrap gap-2 pt-2">
          {song.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
