import Dashboard from '../Dashboard/Dashboard';
import SpotifyPlayer from '../Player/SpotifyPlayer';

const Mysounds = () => {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Mis Sonidos</h1>
      <div className="max-w-7xl mx-auto">
        <Dashboard sidebarMode={false} />
      </div>
      {/* Agregamos el SpotifyPlayer con standalone={true} */}
      <SpotifyPlayer standalone={true} sidebarMode={false} />
    </div>
  );
};

export default Mysounds;