import { useState, useEffect } from "react";
import { useSpotify } from "../../authSpotify/context/SpotifyContext";
import UserSearch from "../../userProfile/components/UserSearch";
import OtherUsersPlaylists from "../../dashboard/components/OtherUsersPlaylists";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-800 rounded-xl p-4 sm:p-5 hover:bg-gray-700/80 transition-colors">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="p-2.5 sm:p-3 bg-purple-600/80 rounded-lg shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-gray-400 text-xs sm:text-sm truncate">{title}</p>
        <p className="text-white text-xl sm:text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`bg-gray-800 rounded-xl p-4 sm:p-5 ${className}`}>
    <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{title}</h2>
    {children}
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
          fetch("https://api.spotify.com/v1/me/playlists", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [playlistsRes, artistsRes, recentRes] = responses;

        const playlistsData =
          playlistsRes.status === "fulfilled"
            ? await playlistsRes.value.json()
            : { total: 0 };

        const artistsData =
          artistsRes.status === "fulfilled"
            ? await artistsRes.value.json()
            : { items: [] };

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

        let recentTracks = [];
        if (recentRes.status === "fulfilled") {
          const recentData = await recentRes.value.json();
          recentTracks = recentData.items || [];
        }

        setStats({
          playlists: playlistsData.total || 0,
          topArtists: artistsData.items || [],
          topGenres,
          recentTracks,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (error) {
    return (
      <div className="w-full space-y-4 pb-8">
        <div className="bg-red-900/20 border border-red-500/60 rounded-xl p-4 text-red-100 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full space-y-4 pb-8 animate-pulse">
        <div className="h-7 bg-gray-800 rounded-lg w-32"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>
          ))}
        </div>
        <div className="h-32 bg-gray-800 rounded-xl"></div>
        <div className="h-64 bg-gray-800 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Mi Spotify</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          title="Playlists"
          value={stats.playlists}
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          }
        />

        {stats.topGenres.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-5 hover:bg-gray-700/80 transition-colors">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Géneros favoritos</p>
            <div className="flex flex-wrap gap-1.5">
              {stats.topGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 bg-purple-600/70 rounded-full text-white text-xs capitalize"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Artists + History */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {stats.topArtists.length > 0 && (
          <SectionCard title="Artistas más escuchados">
            <div className="space-y-3">
              {stats.topArtists.slice(0, 5).map((artist) => (
                <div key={artist.id} className="flex items-center gap-3 min-w-0">
                  {artist.images?.[0]?.url && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{artist.name}</p>
                    <p className="text-gray-400 text-xs truncate">{artist.genres?.[0] || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {stats.recentTracks.length > 0 && (
          <SectionCard title="Historial de reproducción">
            <div className="space-y-2">
              {stats.recentTracks.slice(0, 5).map(({ track, played_at }, index) => {
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
                    className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors min-w-0"
                  >
                    {track.album?.images?.[0]?.url && (
                      <img
                        src={track.album.images[0].url}
                        alt={track.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{track.name}</p>
                      <p className="text-gray-400 text-xs truncate">
                        {track.artists?.map((a) => a.name).join(", ")}
                      </p>
                    </div>
                    {formattedTime && (
                      <span className="text-xs text-gray-500 shrink-0 tabular-nums">{formattedTime}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}
      </div>

      {/* User Search */}
      <UserSearch />

      {/* Other users playlists */}
      <OtherUsersPlaylists />
    </div>
  );
};

export default MySpotify;
