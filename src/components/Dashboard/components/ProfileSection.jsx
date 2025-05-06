import { useNavigate } from 'react-router-dom';
import { useSpotify } from '../../../context/SpotifyContext';

const ProfileSection = ({ profile, sidebarMode }) => {
  const navigate = useNavigate();
  const { logout } = useSpotify();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (!profile) return null;

  if (sidebarMode) {
    return (
      <div className="px-4 pb-4 border-b border-gray-600">
        <div className="flex items-center justify-between gap-4 pt-4">
          {profile.images?.[0]?.url && (
            <img
              src={profile.images[0].url}
              alt="Foto de perfil"
              className="rounded-full w-14 h-14 object-cover shadow-md border-2 border-purple-600"
            />
          )}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-white leading-tight">
              {profile.display_name}
            </p>
            <p className="text-sm text-gray-400 leading-tight">{profile.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-red-700 hover:text-white text-purple text-xs py-1 px-3 rounded-full shadow transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Tu Perfil</h2>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {profile.images?.[0]?.url && (
          <img
            src={profile.images[0].url}
            alt="Foto de perfil"
            className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover shadow-lg border-2 border-purple-600"
          />
        )}
        <div className="text-center sm:text-left">
          <p className="text-xl sm:text-2xl font-bold text-white">
            {profile.display_name}
          </p>
          <p className="text-gray-400 mt-1">{profile.email}</p>
          {profile.country && (
            <p className="text-gray-400 mt-1">País: {profile.country}</p>
          )}
          <button
            onClick={handleLogout}
            className="mt-4 bg-white text-black hover:bg-red-700 hover:text-white text-sm py-2 px-4 rounded-full shadow transition-colors duration-300"
            >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;