import { useEffect, useState, useRef } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useSpotify } from "./features/authSpotify/context/SpotifyContext";
import { useAuth } from "./features/authFirebase/context/AuthContext";
import Navbar from "./shared/components/layout/Navbar";
import Header from "./shared/components/layout/Header";
import MainContent from "./shared/components/layout/MainContent";
import Dashboard from "./features/dashboard/components/Dashboard";
import Footer from "./shared/components/layout/Footer";
import PlaylistDetail from "./features/playLists/components/PlaylistDetail";
import MySpotify from "./features/dashboard/components/MySpotify";
import Mysounds from "./features/dashboard/components/Mysounds";
import MyProfile from "./features/userProfile/components/MyProfile";
import PlaylistLogger from "./features/authSpotify/components/PlaylistLogger";

import Login from "./features/authFirebase/components/loginApp";
import SignUp from "./features/authFirebase/components/registerApp";
import { ToastContainer } from "react-toastify";

function App() {
  const { token, exchangeCodeForToken, loading: spotifyLoading } = useSpotify();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [processingAuth, setProcessingAuth] = useState(false);
  const processedCodeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar modo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Manejar callback de Spotify
  useEffect(() => {
    const handleCallback = async () => {
      if (location.pathname === "/callback" && !processingAuth) {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");

        if (code && code !== processedCodeRef.current) {
          setProcessingAuth(true);
          processedCodeRef.current = code;

          try {
            const token = await exchangeCodeForToken(code);
            if (token) {
              navigate("/", { replace: true });
            }
          } catch (error) {
            console.error("Error en callback:", error);
            navigate("/", { replace: true });
          } finally {
            setProcessingAuth(false);
          }
        }
      }
    };

    handleCallback();
  }, [location, exchangeCodeForToken, navigate, processingAuth]);

  // Redirigir a login si no hay usuario autenticado y no es una ruta de auth
  useEffect(() => {
    if (!authLoading && !user) {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login", { replace: true });
      }
    }
  }, [user, authLoading, location.pathname, navigate]);

  if (authLoading || spotifyLoading || processingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar formulario de login/registro a pantalla completa
  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="*" element={<Login />} />
        </Routes>
        <ToastContainer />
      </div>
    );
  }

  // Interfaz para usuario autenticado
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          token && !isMobile ? "lg:pr-[25%]" : "w-full"
        }`}
      >
        <Navbar />

        <div className="flex-1 pb-24 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="/my-spotify" element={<MySpotify />} />
            <Route path="/my-perfil" element={<MyProfile />} />

            <Route
              path="/mysounds"
              element={
                <div className="w-full max-w-7xl mx-auto">
                  <Mysounds />
                </div>
              }
            />
            <Route path="*" element={<MainContent />} />
          </Routes>
          <ToastContainer />
        </div>

        <Footer />
      </div>

      {token && !isMobile && (
        <aside className="fixed right-0 top-0 h-screen w-full lg:w-1/4 bg-gray-950 border-l border-purple-900 overflow-hidden transition-all duration-300 z-30">
          <div className="h-full w-full overflow-y-auto px-4 sm:px-6 lg:px-4 py-6 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-gray-800">
            <Dashboard sidebarMode={true} />
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
