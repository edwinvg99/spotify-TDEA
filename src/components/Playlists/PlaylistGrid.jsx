// src/components/PlaylistGrid.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpotify } from '../../context/SpotifyContext'; // Usa el contexto
import { PlaylistSkeleton } from '../common/LoadingSkeletons';

const PlaylistGrid = () => {
  const { token } = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        setLoading(false);
        // No establecer error aquí si la falta de token es el estado normal antes de login
        // setError('No Spotify token available.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
           // Aquí podrías forzar el logout si no lo hace el contexto global
           // logout();
           // throw new Error('Sesión expirada al cargar playlists.');
           // O simplemente dejar que el dashboard superior maneje el 401
           console.warn("Token expirado al cargar playlists. Esperando manejo global.");
           setLoading(false); // Deja de cargar si el token no es válido
           // No establecer error aquí, el error global del contexto/dashboard lo manejará
           return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          console.error('API Error al cargar playlists:', response.status, errorBody);
          throw new Error(`Error al cargar playlists: ${errorBody.error?.message || response.statusText}`);
        }

        const data = await response.json();
        // Asegurarse de que data.items es un array antes de setear
        if (Array.isArray(data.items)) {
             setPlaylists(data.items);
        } else {
            // Manejar caso inesperado si data.items no es un array
            console.error('API response did not return an array of items:', data);
            setPlaylists([]); // Setea a array vacío para evitar errores
            setError('Unexpected API response format.');
        }

        setLoading(false);

      } catch (error) {
        console.error('Error en fetchPlaylists:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    // Llama a fetchPlaylists solo si el token existe
    if (token) {
      fetchPlaylists();
    } else {
      // Limpiar si el token se pierde
      setPlaylists([]);
      setLoading(false);
      setError(null);
    }

  }, [token]); // Dependencia: re-ejecutar si el token del contexto cambia

  const filteredPlaylists = playlists.filter(playlist =>
    // Añadir verificación para playlist.name antes de toLowerCase
    playlist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false // Retorna false si playlist.name es null/undefined
  );

  // Estados de UI (Loading, Error, Empty State)
  if (loading) {
    return <PlaylistSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!playlists || playlists.length === 0) {
      return (
          <div className="text-white text-center py-8">
              <p>No se encontraron playlists.</p>
          </div>
      );
  }


  return (
    <div className="p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar playlist..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPlaylists.map(playlist => (
          // Asegurarse de que playlist.id existe
          playlist.id ? (
            <Link
              to={`/playlist/${playlist.id}`}
              key={playlist.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:bg-gray-700 transition-colors duration-200 block"
            >
              <div className="aspect-square w-full">
                {/* Verificación para playlist.images[0] */}
                <img
                  src={playlist.images?.[0]?.url || '/default-playlist.png'} // Uso seguro de ?.[]
                  alt={`Portada de ${playlist.name || 'Playlist'}`} // Fallback en alt
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                {/* Verificación para playlist.name */}
                <h3 className="text-white font-bold text-lg truncate">{playlist.name || 'Unnamed Playlist'}</h3>
                <p className="text-gray-400 text-sm mt-1">
                   {/* Verificación para playlist.owner y playlist.tracks */}
                   Por {playlist.owner?.display_name || 'Unknown'} • {playlist.tracks?.total ?? 0} canciones {/* Uso de ?? para default 0 */}
                </p>
              </div>
            </Link>
           ) : null // No renderizar si playlist.id no existe
        ))}
      </div>
       {playlists.length > 0 && filteredPlaylists.length === 0 && (
           <div className="text-white text-center py-8">
               <p>No se encontraron resultados para "{searchTerm}".</p>
           </div>
       )}
    </div>
  );
};

export default PlaylistGrid;