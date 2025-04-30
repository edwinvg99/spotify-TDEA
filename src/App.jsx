import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSpotify } from "./context/SpotifyContext";
import Navbar from "./components/layout/Navbar";
import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import Dashboard from "./components/Dashboard/Dashboard";
import Footer from "./components/layout/Footer";
import PlaylistDetail from "./components/Playlists/PlaylistDetail";
import MySpotify from "./components/spotify/MySpotify";

function App() {
  const { token, exchangeCodeForToken, loading } = useSpotify();
  const location = useLocation();
  const navigate = useNavigate();
  const [processingAuth, setProcessingAuth] = useState(false);
  const processedCodeRef = useRef(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (location.pathname === '/callback' && !processingAuth) {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        
        if (code && code !== processedCodeRef.current) {
          setProcessingAuth(true);
          processedCodeRef.current = code;
          
          try {
            const token = await exchangeCodeForToken(code);
            if (token) {
              navigate('/', { replace: true });
            }
          } catch (error) {
            console.error('Error en callback:', error);
            navigate('/', { replace: true });
          } finally {
            setProcessingAuth(false);
          }
        }
      }
    };

    handleCallback();
  }, [location, exchangeCodeForToken, navigate, processingAuth]);

  if (loading || processingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Contenedor principal que se desplazará */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        token ? "pr-[25%]" : ""
      }`}>
        <Navbar />
        <Header />
        <div className="flex-1 pb-24">
          <Routes>
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="/my-spotify" element={<MySpotify />} />
            <Route path="*" element={<MainContent />} />
          </Routes>
        </div>
        <Footer />
        {/* Eliminamos el SpotifyPlayer de aquí */}
      </div>

      {/* Sidebar fijo */}
      {token && (
        <aside 
          className="w-1/4 bg-gray-950 border-l border-purple-900 fixed right-0 top-0 h-screen overflow-hidden pb-6"
        >
          <div className="h-full overflow-y-auto">
            <Dashboard sidebarMode={true} />
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;