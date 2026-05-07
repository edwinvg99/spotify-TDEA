import { useState } from "react";

const UserSearch = ({ sidebarMode = false }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}/users`;
    window.open(spotifySearchUrl, "_blank");
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-5 rounded-xl">
      <h3 className="text-white text-sm sm:text-base font-semibold mb-3">Buscar Usuarios</h3>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar usuarios de Spotify..."
          className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-gray-700 text-white text-sm placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          type="submit"
          className="min-h-11 px-5 py-2.5 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default UserSearch;
