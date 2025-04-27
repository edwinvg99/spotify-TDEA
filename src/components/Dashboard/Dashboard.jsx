// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useSpotify } from '../../context/SpotifyContext';
import PlaylistGrid from '../Playlists/PlaylistGrid';

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
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Error al cargar el perfil');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  if (isLoading) {
    return (
      <div className="p-4 bg-yellow-400">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
          <div className="space-y-3 w-full">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  if (sidebarMode) {
    return (
      <div className="h-full pt-4 overflow-y-scroll  no-scrollbar ">
        <div className="flex justify-between items-center px-4 pb-4 border-b border-gray-800 overflow-y-scroll overflow-y-scroll no-scrollbar">
          {" "}
          {/* Eliminamos 'relative' ya que el botón no estará posicionado absolutamente */}
          {/* Contenido: Imagen y Datos del perfil */}
          {/* Eliminamos el pt-10 para que se alinee correctamente en la fila */}
          <div className="flex items-center gap-4">
            {/* Imagen de perfil */}
            {profile.images?.[0]?.url && (
              <img
                src={profile.images[0].url}
                alt="Foto de perfil"
                className="rounded-full w-14 h-14 object-cover shadow-md border-2 border-purple-600"
              />
            )}

            {/* Datos del perfil */}
            {/* Mantenemos flex-col para que nombre y email estén uno debajo del otro */}
            <div className="flex flex-col">
              <p className="text-base font-semibold text-white leading-tight">
                {profile.display_name}
              </p>
              <p className="text-sm text-gray-400 leading-tight">
                {profile.email}
              </p>
            </div>
          </div>
          {/* Botón de Salir */}
          {/* Quitamos las clases de posicionamiento absoluto (absolute, top-4, right-4) */}
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 rounded-full shadow transition-colors"
          >
            Salir
          </button>
        </div>

        <div className="p-4 overflow-y-scroll no-scrollbar">
          <PlaylistGrid sidebarMode={true} />
        </div>
      </div>
    );
  }

  // Vista completa para cuando no está en modo sidebar
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Tu Perfil</h2>
        <div className="flex items-start gap-6">
          {profile.images?.[0]?.url && (
            <img 
              src={profile.images[0].url} 
              alt="Foto de perfil" 
              className="rounded-full w-24 h-24 object-cover shadow-lg" 
            />
          )}
          <div>
            <p className="text-2xl font-bold text-white">{profile.display_name}</p>
            <p className="text-gray-400">{profile.email}</p>
            {profile.country && (
              <p className="text-gray-400">País: {profile.country}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Tus Playlists</h2>
        <PlaylistGrid />
      </div>
    </div>
  );
};

export default Dashboard;