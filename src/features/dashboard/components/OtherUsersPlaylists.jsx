import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../authFirebase/services/firebase";
import { useAuth } from "../../authFirebase/context/AuthContext";

const PlaylistCard = ({ playlist, userName }) => {
  const handleOpenSpotify = () => {
    if (playlist.external_urls?.spotify) {
      window.open(playlist.external_urls.spotify, "_blank");
    }
  };

  return (
    <div
      className="bg-gray-900 rounded-lg overflow-hidden hover:bg-slate-700 transition-all group p-3 cursor-pointer"
      onClick={handleOpenSpotify}
    >
      <div className="aspect-square relative mb-2">
        <img
          src={playlist.images?.[0]?.url || "/default-playlist.png"}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute top-1 right-1">
          {playlist.public ? (
            <div className="bg-green-600 p-0.5 rounded-full">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="bg-gray-600 p-0.5 rounded-full">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium text-sm truncate group-hover:text-purple-400 mb-1">
          {playlist.name}
        </h3>
        <p className="text-gray-400 text-xs mb-1">
          {playlist.tracks?.total || 0} canciones
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <p className="text-purple-400 text-xs font-medium truncate">
            {userName}
          </p>
        </div>
        {playlist.description && (
          <p className="text-gray-500 text-xs mt-1 line-clamp-1">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  );
};

const OtherUsersPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOtherUsersPlaylists = async () => {
      try {
        setLoading(true);

        // Obtener todos los documentos de la colección Users
        const usersCollection = collection(db, "Users");
        const usersSnapshot = await getDocs(usersCollection);

        const allPlaylists = [];

        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          const userId = doc.id;

          // Excluir las playlists del usuario actual
          if (
            userId !== user?.uid &&
            userData.playlists &&
            Array.isArray(userData.playlists)
          ) {
            // Crear el nombre completo del usuario
            const userName =
              `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
              "Usuario";

            // Agregar cada playlist con la información del usuario
            userData.playlists.forEach((playlist) => {
              allPlaylists.push({
                ...playlist,
                userId: userId,
                userName: userName,
                userEmail: userData.email,
              });
            });
          }
        });

        // Ordenar por fecha de guardado (más recientes primero)
        allPlaylists.sort(
          (a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0)
        );

        setPlaylists(allPlaylists);

        console.log("=== PLAYLISTS DE OTROS USUARIOS ===");
        console.log(allPlaylists);
      } catch (error) {
        console.error("Error obteniendo playlists de otros usuarios:", error);
        setError("Error al cargar las playlists de otros usuarios");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOtherUsersPlaylists();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Playlists de otros usuarios
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-3 animate-pulse">
              <div className="aspect-square bg-gray-600 rounded-md mb-2"></div>
              <div className="h-3 bg-gray-600 rounded mb-1"></div>
              <div className="h-2 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Playlists de otros usuarios
        </h2>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-100">
          {error}
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Playlists de otros usuarios
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
          <p className="text-gray-400">
            No hay playlists de otros usuarios disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          Playlists de otros usuarios
        </h2>
        <span className="text-sm text-gray-400">
          {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}{" "}
          encontrada{playlists.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {playlists.map((playlist, index) => (
          <PlaylistCard
            key={`${playlist.userId}-${playlist.id}-${index}`}
            playlist={playlist}
            userName={playlist.userName}
          />
        ))}
      </div>
    </div>
  );
};

export default OtherUsersPlaylists;
