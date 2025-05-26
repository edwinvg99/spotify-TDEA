// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { useSpotify } from "../../authSpotify/context/SpotifyContext";
import PlaylistGrid from "../../playLists/components/PlaylistGrid";
import SpotifyPlayer from "../../player/SpotifyPlayer";
import ProfileSection from "../../userProfile/components/ProfileSection";
import { DashboardSkeleton } from "../../../shared/components/ui/LoadingSkeletons";
import PlaylistLogger from "../../authSpotify/components/PlaylistLogger";

const Dashboard = ({ sidebarMode }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useSpotify();

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al cargar el perfil");

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (!profile) return null;

  if (sidebarMode) {
    return (
      <div className="h-full flex flex-col overflow-y-scroll no-scrollbar">
        <ProfileSection profile={profile} logout={logout} sidebarMode={true} />
        <PlaylistLogger />
        <div className="flex-1 overflow-y-scroll no-scrollbar">
          <div className="p-4">
            <PlaylistGrid sidebarMode={true} />
          </div>
        </div>

        <div className="mt-auto border-t border-gray-800">
          <div className="p-4">
            <SpotifyPlayer sidebarMode={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" space-y-4  bg-slate-900 w-full h-full">
      <ProfileSection profile={profile} logout={logout} sidebarMode={false} />
      <PlaylistLogger />

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Tus Playlists
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <PlaylistGrid />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
