const SongCard = ({ song }) => (
  <div className="bg-gray-800 rounded-xl shadow-md p-4 flex items-center hover:scale-105 transition-transform gap-4">
    {/* Imagen de portada */}
    <img src={song.cover} alt={song.title} className="w-28 h-28 object-cover rounded-lg" />

    {/* Información de la canción */}
    <div className="flex flex-col flex-1">
      <h4 className="text-2xl font-bold text-white">{song.title}</h4>
      <p className="text-purple-400 text-sm mt-1">
        Artista: <span className="text-gray-300">{song.artist}</span>
      </p>
      <p className="text-purple-400 text-sm">
        Álbum: <span className="text-gray-300">{song.album}</span>
      </p>
      <p className="text-purple-400 text-sm">
        Duración: <span className="text-gray-300">{song.duration}</span>
      </p>
    </div>

    {/* Botón de Play Mejorado */}
    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  </div>
);

export default SongCard;
