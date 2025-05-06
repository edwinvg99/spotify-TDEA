import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSpotify } from "./context/SpotifyContext";
import Navbar from "./components/layout/Navbar";
import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import Dashboard from "./components/Dashboard/Dashboard";
import Footer from "./components/layout/Footer";
import PlaylistDetail from "./components/Playlists/PlaylistDetail/PlaylistDetail";
import MySpotify from "./components/spotify/MySpotify";
import Mysounds from "./components/spotify/Mysounds";

function App() {
  const { token, exchangeCodeForToken, loading } = useSpotify();
  const location = useLocation();
  const navigate = useNavigate();
  const [processingAuth, setProcessingAuth] = useState(false);
  const processedCodeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar modo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px es el breakpoint lg de Tailwind
    };

    // Verificar inicialmente
    checkMobile();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkMobile);

    // Limpiar listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Efecto para redireccionar cuando el token cambie a null (logout)
  useEffect(() => {
    if (!token && !loading && !processingAuth) {
      navigate('/', { replace: true });
    }
  }, [token, loading, processingAuth, navigate]);

  if (loading || processingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Contenedor principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        token && !isMobile ? "lg:pr-[25%]" : "w-full"
      }`}>
        <Navbar />
        <div className="flex-1 pb-24 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="/my-spotify" element={<MySpotify />} />
            <Route path="/Mysounds" element={
              <div className="w-full max-w-7xl mx-auto">
                <Mysounds />
              </div>
            } />
            <Route path="*" element={<MainContent />} />
          </Routes>
        </div>
        <Footer />
      </div>

      {/* Sidebar fijo con estilos responsive */}
      {token && !isMobile && (
        <aside className="
          fixed right-0 top-0 h-screen
          w-full lg:w-1/4 
          bg-gray-950 border-l border-purple-900
          overflow-hidden transition-all duration-300
          z-30
        ">
          <div className="
            h-full w-full overflow-y-auto
            px-4 sm:px-6 lg:px-4
            py-6
            scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-gray-800
          ">
            <Dashboard sidebarMode={true} />
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;