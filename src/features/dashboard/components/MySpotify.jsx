import { useState, useEffect } from "react";
import { useSpotify } from "../../authSpotify/context/SpotifyContext";
import UserSearch from "../../userProfile/components/UserSearch";
import OtherUsersPlaylists from "../../dashboard/components/OtherUsersPlaylists";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-purple-600 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const MySpotify = () => {
  const { token } = useSpotify();
  const [stats, setStats] = useState({
    playlists: 0,
    topArtists: [],
    topGenres: [],
    recentTracks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.allSettled([
          // Fetch playlists
          fetch("https://api.spotify.com/v1/me/playlists", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Fetch top artists
          fetch(
            "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          // Fetch recently played - opcional
          fetch(
            "https://api.spotify.com/v1/me/player/recently-played?limit=10",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const [playlistsRes, artistsRes, recentRes] = responses;

        // Procesar playlists
        const playlistsData =
          playlistsRes.status === "fulfilled"
            ? await playlistsRes.value.json()
            : { total: 0 };

        // Procesar artistas
        const artistsData =
          artistsRes.status === "fulfilled"
            ? await artistsRes.value.json()
            : { items: [] };

        // Procesar géneros
        const genres =
          artistsData.items?.reduce((acc, artist) => {
            artist.genres?.forEach((genre) => {
              acc[genre] = (acc[genre] || 0) + 1;
            });
            return acc;
          }, {}) || {};

        const topGenres = Object.entries(genres)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([genre]) => genre);

        // Procesar historial reciente (opcional)
        let recentTracks = [];
        if (recentRes.status === "fulfilled") {
          const recentData = await recentRes.value.json();
          recentTracks = recentData.items || [];
        }

        setStats({
          playlists: playlistsData.total || 0,
          topArtists: artistsData.items || [],
          topGenres: topGenres,
          recentTracks: recentTracks,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-100">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 pb-24 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-8">Mi Spotify</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Card de Playlists */}
        <StatCard
          title="Playlists"
          value={stats.playlists}
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          }
        />

        {/* Card de Géneros Favoritos */}
        {stats.topGenres.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h2 className="text-xl font-bold text-white mb-4">
              Géneros favoritos
            </h2>
            <div className="flex flex-wrap gap-2">
              {stats.topGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-purple-600 rounded-full text-white text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Artists */}
        {stats.topArtists.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Artistas más escuchados
            </h2>
            <div className="space-y-4">
              {stats.topArtists.slice(0, 5).map((artist) => (
                <div key={artist.id} className="flex items-center gap-4">
                  {artist.images?.[0]?.url && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">{artist.name}</p>
                    <p className="text-sm text-gray-400">
                      {artist.genres?.[0] || ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historial reciente */}
        {stats.recentTracks.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700/50 transition-all">
            <h2 className="text-xl font-bold text-white mb-4">
              Historial de reproducción
            </h2>
            <div className="space-y-4">
              {stats.recentTracks
                .slice(0, 5)
                .map(({ track, played_at }, index) => {
                  // Formatear la fecha de manera segura
                  const formattedTime = played_at
                    ? new Date(played_at).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "";

                  return (
                    <div
                      key={`${track.id}-${index}`}
                      className="flex items-center gap-4 hover:bg-gray-700/50 p-2 rounded-lg transition-all"
                    >
                      {track.album?.images?.[0]?.url && (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className="w-12 h-12 rounded shadow-lg"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium line-clamp-1">
                          {track.name}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-1">
                          {track.artists?.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                      {formattedTime && (
                        <span className="text-xs text-gray-500">
                          {formattedTime}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/*  sección de búsqueda de usuarios */}
      <div className="mt-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <UserSearch />
        </div>
      </div>

      {/*  sección de playlist de usuarios */}
      <div className="mt-8">
        <OtherUsersPlaylists />
      </div>
    </div>
  );
};

export default MySpotify;
