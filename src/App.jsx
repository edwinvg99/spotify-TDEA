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
import MobilePlayerDrawer from "./features/player/components/MobilePlayerDrawer";

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
  const [asideExpanded, setAsideExpanded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
            if (token) navigate("/", { replace: true });
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

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-800 via-gray-900 to-purple-950">
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="*" element={<Login />} />
        </Routes>
        <ToastContainer />
      </div>
    );
  }

  // Ancho del aside según estado expandido
  const asideWidthClass = asideExpanded ? "lg:w-[42%]" : "lg:w-[25%]";
  const mainPadClass = token && !isMobile
    ? asideExpanded ? "lg:pr-[42%]" : "lg:pr-[25%]"
    : "";

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-950 via-gray-900 to-purple-950">
      <div className={`flex-1 flex flex-col transition-all duration-300 ${mainPadClass}`}>
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

      {/* Aside desktop */}
      {token && !isMobile && (
        <aside
          className={`fixed right-0 top-0 h-screen ${asideWidthClass} bg-gray-950 border-l border-purple-900/60 overflow-hidden transition-all duration-300 z-30`}
        >
          <button
            onClick={() => setAsideExpanded((v) => !v)}
            className="absolute top-3 left-3 z-10 p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
            aria-label={asideExpanded ? "Colapsar panel" : "Expandir panel"}
            title={asideExpanded ? "Colapsar" : "Expandir"}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${asideExpanded ? "rotate-0" : "rotate-180"}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
          <div className="h-full w-full overflow-y-auto px-4 py-6 pt-12 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-gray-800">
            <Dashboard sidebarMode={true} />
          </div>
        </aside>
      )}

      {/* Botón flotante + panel full-screen mobile */}
      {token && isMobile && <MobilePlayerDrawer />}
    </div>
  );
}

export default App;
