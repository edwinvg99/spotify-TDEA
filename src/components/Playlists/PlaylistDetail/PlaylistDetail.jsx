// src/components/PlaylistDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSpotify } from "../../../context/SpotifyContext";
import { useSpotifySDK } from "../../../hooks/useSpotifySDK";
import { TracksSkeleton } from "../../common/LoadingSkeletons";
import PlaylistHeader from "./components/PlaylistHeader";
import PlaylistStats from "./components/PlaylistStats";
import TrackItem from "./components/TrackItem";

const PlaylistDetail = ({ playlistId, isInSidebar = false }) => {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { token } = useSpotify();
  const params = useParams();
  const { playNewTrack, currentTrack, isReady } = useSpotifySDK(token);

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

  if (loading) return <TracksSkeleton />;
  if (error) return <div className={`text-red-500 ${isInSidebar ? "p-2" : "p-6"}`}>{error}</div>;
  if (!playlist) return null;

  const containerClass = isInSidebar
    ? "text-white p-2 space-y-4"
    : "text-white p-6 space-y-6";

  return (
    <div className={`${containerClass} h-full flex flex-col overflow-y-scroll no-scrollbar`}>
      <div className="flex-shrink-0 ">
        <PlaylistHeader playlist={playlist} isInSidebar={isInSidebar} />
        <PlaylistStats playlist={playlist} />

        {!isInSidebar && (
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-4 py-2 border-b border-gray-800 text-gray-400 text-sm mt-6">
            <div className="w-10">#</div>
            <div>Título</div>
            <div>Álbum</div>
            <div>Duración</div>
          </div>
        )}
      </div>

      <div className={`
        flex-1 overflow-y-scroll no-scrollbar mt-4
        ${isInSidebar ? "max-h-[calc(100vh-350px)]" : "max-h-[calc(100vh-400px)]"}
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
      `}>
        {tracks.map((item, index) => (
          <TrackItem
            key={item.track.id + index}
            track={item.track}
            index={index}
            currentTrack={currentTrack}
            isInSidebar={isInSidebar}
            onClick={handlePlayTrack}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetail;
