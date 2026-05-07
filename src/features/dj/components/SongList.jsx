const artists = [
  {
    name: "DJ Nova",
    role: "Tech House / Headliner",
    image: "/assets/song1.png",
    followers: "12.4K",
  },
  {
    name: "Kara Syn",
    role: "Drum & Bass",
    image: "/assets/song2.png",
    followers: "8.7K",
  },
  {
    name: "Maxo",
    role: "Techno",
    image: "/assets/song3.jpg",
    followers: "5.2K",
  },
];

const SongList = () => (
  <section>
    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
      Artistas Destacados
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {artists.map((artist, idx) => (
        <div
          key={idx}
          className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base sm:text-lg truncate">
              {artist.name}
            </h3>
            <p className="text-gray-400 text-sm truncate">{artist.role}</p>
            <p className="text-purple-400 text-xs font-semibold mt-1">
              {artist.followers} seguidores
            </p>
          </div>
          <button className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-all duration-300">
            Seguir
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default SongList;
