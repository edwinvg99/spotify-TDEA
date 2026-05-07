import { useState } from "react";
import { useSpotifySDKContext } from "../../authSpotify/context/SpotifySDKContext";
import Dashboard from "../../dashboard/components/Dashboard";

// Logo SVG oficial de Spotify (logomark)
const SpotifyLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="currentColor"
      d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.6 121.3c-1.5 2.5-4.8 3.3-7.3 1.8-20-12.2-45.2-15-74.9-8.2-2.9.7-5.7-1.1-6.4-4-.7-2.9 1.1-5.7 4-6.4 32.5-7.4 60.4-4.2 82.8 9.5 2.5 1.5 3.3 4.8 1.8 7.3zm10.3-22.9c-1.9 3.1-6 4.1-9.1 2.2-22.9-14.1-57.8-18.2-84.9-9.9-3.5 1.1-7.2-.9-8.3-4.4-1.1-3.5.9-7.2 4.4-8.3 30.9-9.4 69.3-4.8 95.7 11.3 3.1 1.9 4.1 6 2.2 9.1zm.9-23.8C108 57.3 63.4 55.8 37.8 63.5c-4.2 1.3-8.6-1.1-9.9-5.3-1.3-4.2 1.1-8.6 5.3-9.9 29.5-9 78.6-7.3 109.6 10.9 3.8 2.2 5 7 2.7 10.8-2.2 3.7-7 5-10.7 2.6z"
    />
  </svg>
);

const MobilePlayerDrawer = () => {
  const [open, setOpen] = useState(false);
  const { currentTrack, isPlaying } = useSpotifySDKContext();

  return (
    <>
      {/* ── Botón flotante ─────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir reproductor de Spotify"
        className={`
          fixed bottom-6 right-5 z-40
          w-14 h-14 rounded-full
          bg-[#1ed760] text-black
          shadow-lg shadow-black/40
          flex items-center justify-center
          transition-transform duration-200
          hover:scale-110 active:scale-95
          ${isPlaying ? "animate-pulse-slow" : ""}
        `}
      >
        <SpotifyLogo className="w-8 h-8" />
      </button>

      {/* ── Panel full-screen ──────────────────────────────────────────── */}
      {/* Siempre montado en el DOM → la música nunca se interrumpe al cerrar */}
      <div
        aria-hidden={!open}
        className={`
          fixed inset-0 z-50
          flex flex-col
          bg-gray-950
          transition-transform duration-300 ease-in-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Cabecera del panel */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-5 pb-3 border-b border-gray-800/60">
          <div className="flex items-center gap-2">
            <SpotifyLogo className="w-6 h-6 text-[#1ed760]" />
            <span className="text-white font-bold text-base">Mi Spotify</span>
          </div>

          {/* Info de canción en curso (si hay) */}
          {currentTrack && (
            <div className="flex-1 mx-4 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {currentTrack.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.artists?.map((a) => a.name).join(", ")}
              </p>
            </div>
          )}

          {/* Botón cerrar */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar panel"
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Contenido: Dashboard completo en modo sidebar */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <Dashboard sidebarMode={true} />
        </div>
      </div>

      {/* Backdrop semi-transparente detrás del botón cuando el panel está cerrado */}
      {/* (ninguno — el panel es full screen, no necesita overlay) */}
    </>
  );
};

export default MobilePlayerDrawer;
