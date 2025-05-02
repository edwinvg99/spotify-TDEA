// src/components/PlaylistDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSpotify } from "../../context/SpotifyContext";
import { useSpotifySDK } from "../../hooks/useSpotifySDK";
import { TracksSkeleton } from "../common/LoadingSkeletons";
import VisibilityBadge from "../common/VisibilityBadge";

const PlaylistDetail = ({ playlistId, isInSidebar = false }) => {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSpotify();
  const params = useParams();
  const { playNewTrack, currentTrack, isReady } = useSpotifySDK(token);

  // Usar el playlistId de props o de los parámetros de la URL
  const id = playlistId || params.playlistId;

  const handlePlayTrack = async (track) => {
    if (!isReady) {
      console.log("El reproductor no está listo aún");
      return;
    }
    try {
      await playNewTrack(track.uri);
    } catch (error) {
      console.error("Error reproduciendo track:", error);
    }
  };

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      if (!token || !id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar la playlist");
        }

        const data = await response.json();
        setPlaylist(data);
        setTracks(data.tracks.items);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [token, id]);

  if (loading) {
    return <TracksSkeleton />;
  }

  if (error) {
    return (
      <div className={`text-red-500 ${isInSidebar ? "p-2" : "p-6"}`}>
        {error}
      </div>
    );
  }

  if (!playlist) return null;

  const containerClass = isInSidebar
    ? "text-white p-2 space-y-4"
    : "text-white p-6 space-y-6";

  const headerClass = isInSidebar
    ? "flex items-center gap-4"
    : "flex items-center gap-8";

  const imageClass = isInSidebar
    ? "w-16 h-16 rounded shadow-lg"
    : "w-48 h-48 rounded-lg shadow-xl";

  const titleClass = isInSidebar ? "text-lg font-bold" : "text-3xl font-bold";

  return (
    <div
      className={`${containerClass} h-full flex flex-col overflow-y-scroll no-scrollbar`}
    >
      {/* Header estático */}
      <div className="flex-shrink-0">
        <div className={headerClass}>
          {/* Imagen de la playlist */}
          <img
            src={playlist.images?.[0]?.url || "/default-playlist.png"}
            alt={playlist.name}
            className={imageClass}
          />

          <div className="flex-1">
            {/* Título y badge de visibilidad */}
            <div className="flex items-center gap-3">
              <h2 className={titleClass}>{playlist.name}</h2>
              <VisibilityBadge isPublic={playlist.public} />
            </div>

            {/* Descripción corta */}
            {playlist.description && (
              <p className="text-sm text-gray-400 mt-2 italic line-clamp-2">
                {playlist.description}
              </p>
            )}

            {/* Información del creador y datos */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
              {/* Creador */}
              <p className="flex items-center text-gray-300">
                <span className="font-semibold text-white hover:underline">
                  {playlist.owner.display_name}
                </span>
              </p>

              {/* Seguidores */}
              {playlist.followers && (
                <p className="flex items-center text-emerald-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {playlist.followers.total.toLocaleString()} seguidores
                </p>
              )}

              {/* Canciones */}
              <p className="flex items-center text-sky-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                {playlist.tracks.total} canciones
              </p>

              {/* Fecha */}
              <p className="flex items-center text-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Actualizada:{" "}
                {new Date(
                  playlist.tracks.items[0]?.added_at || playlist.snapshot_id
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Descripción completa fuera del sidebar */}
        {!isInSidebar && playlist.description && (
          <div className="bg-gray-800/50 p-4 rounded-lg mt-6">
            <p className="text-gray-300">{playlist.description}</p>
          </div>
        )}

        {/* Encabezado de la lista de canciones */}
        {!isInSidebar && (
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-4 py-2 border-b border-gray-800 text-gray-400 text-sm mt-6">
            <div className="w-10">#</div>
            <div>Título</div>
            <div>Álbum</div>
            <div>Duración</div>
          </div>
        )}
      </div>

      {/* Lista de canciones con scroll */}
      <div
        className={`
        flex-1 overflow-y-scroll no-scrollbar mt-4
        ${
          isInSidebar
            ? "max-h-[calc(100vh-350px)]"
            : "max-h-[calc(100vh-400px)]"
        }
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
      `}
      >
        {tracks.map((item, index) => (
          <button
            key={item.track.id + index}
            onClick={() => handlePlayTrack(item.track)}
            className={`w-full ${
              isInSidebar
                ? "flex items-center gap-3 p-2"
                : "grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-4 py-2"
            } hover:bg-gray-800 rounded group ${
              currentTrack?.uri === item.track.uri ? "bg-gray-800" : ""
            }`}
          >
            {/* Número e imagen */}
            <div className="flex items-center gap-3">
              {!isInSidebar && (
                <span className="w-5 text-gray-400 text-sm">{index + 1}</span>
              )}
              <img
                src={item.track.album.images?.[0]?.url || "/default-song.png"}
                alt={item.track.name}
                className="w-10 h-10 rounded"
              />
            </div>

            {/* Título, artistas y álbum */}
            <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
              <p
                className={`text-sm font-medium truncate ${
                  currentTrack?.uri === item.track.uri
                    ? "text-green-500"
                    : "text-white"
                }`}
              >
                {item.track.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {item.track.artists.map((artist) => artist.name).join(", ")}
                {item.track.album?.name && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="text-gray-500">
                      {item.track.album.name}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Álbum (solo visible cuando no es sidebar) */}
            {!isInSidebar && (
              <div className="flex items-center">
                <p className="text-gray-400 text-sm truncate">
                  {item.track.album.name}
                </p>
              </div>
            )}

            {/* Duración */}
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">
                {Math.floor(item.track.duration_ms / 60000)}:
                {String(
                  Math.floor((item.track.duration_ms % 60000) / 1000)
                ).padStart(2, "0")}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetail;
