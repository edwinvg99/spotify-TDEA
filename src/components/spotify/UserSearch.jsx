import { useState } from 'react';

const UserSearch = ({ sidebarMode = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Construir la URL de búsqueda de Spotify
    const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}/users`;
    
    // Abrir en una nueva pestaña
    window.open(spotifySearchUrl, '_blank');
  };


  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Buscar Usuarios</h3>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar usuarios de Spotify..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          Buscar
        </button>
      </form>
      <p className="text-gray-600 text-sm mt-2 ml-2">
        Se abrirá Spotify para buscar y seguir usuarios
      </p>
    </div>
  );
};

export default UserSearch;