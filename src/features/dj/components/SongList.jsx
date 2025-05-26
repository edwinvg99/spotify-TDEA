import SongCard from "./SongCard";

const songs = [
  {
    title: "Galactic Groove",
    artist: "DJ Nova",
    album: "Cosmic Beats",
    duration: "3:45",
    coverImage: "/assets/song1.png",
  },
  {
    title: "Night Pulse",
    artist: "DJ Nova",
    album: "Electric Vibes",
    duration: "4:10",
    coverImage: "/assets/song2.png",
  },
  {
    title: "Electric Dreams",
    artist: "DJ Nova",
    album: "Neon Nights",
    duration: "5:02",
    coverImage: "/assets/song3.jpg",
  },
];

const SongList = () => (
  <section className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg overflow-y-scroll no-scrollbar">
    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
      Canciones Destacadas
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {songs.map((song, idx) => (
        <SongCard key={idx} song={song} />
      ))}
    </div>
  </section>
);

export default SongList;
