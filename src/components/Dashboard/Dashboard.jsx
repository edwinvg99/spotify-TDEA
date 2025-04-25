// src/components/Dashboard.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSpotify } from '../../context/SpotifyContext';
import PlaylistGrid from '../Playlists/PlaylistGrid'; // Importa el componente de grid de playlists
import { ProfileSkeleton, PlaylistSkeleton } from '../common/LoadingSkeletons';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  // Usaremos un estado de carga general para el dashboard
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null); // Error específico del dashboard (ej: error al obtener perfil)
  const navigate = useNavigate();
  const location = useLocation();
  // Obtenemos token, funciones y estados de carga/error del contexto
  const { token, exchangeCodeForToken, logout, loading: spotifyContextLoading, contextError: spotifyContextError } = useSpotify();
  const processedCode = useRef(null); // Ref para rastrear el código ya procesado

  useEffect(() => {
    const handleAuthFlow = async () => {
      setDashboardLoading(true); // Inicia carga del dashboard
      setDashboardError(null); // Limpia errores previos

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const receivedState = params.get('state');
      const errorParam = params.get('error'); // Capturar errores de Spotify (ej: denied)

      // 1. Manejar errores de Spotify (ej: usuario deniega permisos)
      if (errorParam) {
        console.error('Error de autorización de Spotify:', errorParam);
        setDashboardError(`Autorización fallida: ${errorParam}. Por favor, vuelve a intentar.`);
        sessionStorage.removeItem('auth_state');
        setDashboardLoading(false);
        setTimeout(() => navigate('/'), 5000); // Redirigir después de 5 segundos
        return; // Salir del efecto
      }

      // 2. Si hay código en la URL y no ha sido procesado aún Y no estamos ya cargando desde el contexto
      // Añadir spotifyContextLoading para no re-procesar mientras el contexto ya trabaja
      if (code && processedCode.current !== code && !spotifyContextLoading) {
        const savedState = sessionStorage.getItem('auth_state');

        // Verificar que el estado coincida
        if (savedState && savedState === receivedState) {
          processedCode.current = code; // Marca este código como procesado
          sessionStorage.removeItem('auth_state');

          try {
             // exchangeCodeForToken ya maneja su propio loading y error dentro del contexto
             await exchangeCodeForToken(code);
             // La URL se limpia DENTRO de exchangeCodeForToken ahora.
             // La siguiente parte del efecto se ejecutará cuando el contexto 'token' cambie.
          } catch (error) {
             // Si exchangeCodeForToken falla, ya registra contextError y llama a logout
             // El Dashboard reaccionará a contextError y a la ausencia de token
             setDashboardError(spotifyContextError || error.message); // Usar error del contexto si está disponible
             setDashboardLoading(false);
             setTimeout(() => navigate('/'), 5000); // Redirigir si falla el intercambio
             return; // Salir si falla el intercambio
          }
        } else {
          // Mismatch de state - posible ataque CSRF o problema en la redirección
          console.error('Estados no coinciden:', { savedState, receivedState });
          setDashboardError('Error de seguridad: validación de estado fallida.');
          sessionStorage.removeItem('auth_state');
          logout(); // Limpiar cualquier sesión dudosa
          setDashboardLoading(false);
          setTimeout(() => navigate('/'), 5000);
          return; // Salir
        }
      }

      // 3. Si tenemos un token válido Y el perfil aún no se ha cargado Y el contexto no está cargando algo
      if (token && !profile && !spotifyContextLoading) {
         console.log('Token presente, intentando cargar perfil...');
         setDashboardError(null); // Limpiar errores de fetch de perfil previos
         try {
            // Endpoint para obtener el perfil del usuario - URL CORRECTA
            const profileUrl = 'https://api.spotify.com/v1/me';
            const response = await fetch(profileUrl, {
               headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
               // Token expirado o inválido
               console.error('Spotify token expirado o inválido al cargar perfil.');
               // Esto debería ser manejado por un interceptor o lógica global en el futuro,
               // pero por ahora forzamos logout.
               logout();
               throw new Error('Sesión expirada. Por favor, vuelve a conectar.');
            }

            if (!response.ok) {
               const errorData = await response.json();
               const errorMessage = errorData.error?.message || 'Error desconocido al obtener el perfil.';
               console.error('Error al obtener perfil:', response.status, errorData);
               throw new Error(`Error al obtener perfil: ${response.status} - ${errorMessage}`);
            }

            // Éxito al obtener el perfil
            const data = await response.json();
            setProfile(data);
            console.log('Perfil cargado:', data);
            // Después de obtener el perfil, el Dashboard está listo.
            setDashboardLoading(false);

         } catch (error) {
            console.error('Error en handleAuthFlow al obtener perfil:', error);
            setDashboardError(error.message); // Mostrar error del dashboard
            logout(); // Forzar logout si falla la obtención del perfil (token inválido, etc.)
            setProfile(null); // Limpiar perfil
            setDashboardLoading(false);
            // Redirigir al login si hay un error después de intentar obtener el perfil
            setTimeout(() => navigate('/'), 5000);
         }
      } else if (!token && !code && !spotifyContextLoading) {
         // 4. Si no hay token, ni código en URL, ni está en proceso de obtener token
         // Y el contexto no está cargando nada: no está autenticado.
         console.log('No hay token ni código, redirigiendo al login.');
         setDashboardLoading(false); // Desactiva carga si no hay token
         navigate('/'); // Redirige al Login
      } else if (token && profile && !spotifyContextLoading) {
         // 5. Si ya tenemos token y perfil y no estamos cargando nada del contexto:
         // Estamos en el estado normal de "logueado". Simplemente desactivar carga.
          console.log('Token y perfil presentes. Dashboard listo.');
          setDashboardLoading(false);
      }
       // Note: Si spotifyContextLoading es true, el efecto no hace nada y espera a que cambie.
       // Los mensajes de carga/error del contexto se pueden mostrar globalmente si lo deseas.
    };

    handleAuthFlow();

  }, [location.search, navigate, token, exchangeCodeForToken, logout, profile, spotifyContextLoading, spotifyContextError]);
  // Dependencias: Incluir todos los valores externos que usa el efecto.
  // profile se añade porque la lógica de "obtener perfil" depende de si profile es null.
  // spotifyContextLoading/Error se añaden para que el efecto reaccione a cambios en el contexto.


  // Mostrar estados de carga/error combinados
  if (dashboardLoading || spotifyContextLoading) {
       return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">Cargando...</div>;
  }

   if (dashboardError || spotifyContextError) {
       return (
           <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-red-500 text-xl p-4 text-center">
               <p>Error: {dashboardError || spotifyContextError}</p>
               {/* Opcional: Botón para reintentar o ir a login */}
               {!token && ( // Si no hay token, sugiere ir al login
                  <button
                     onClick={() => navigate('/')}
                     className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                      Ir a Login
                  </button>
               )}
           </div>
       );
  }
  
  if (dashboardLoading || spotifyContextLoading) {
   return (
     <div className="min-h-screen bg-gray-900">
       <div className="p-6 border-b border-gray-800">
         <h1 className="text-2xl font-bold mb-4 text-white">Tu Perfil de Spotify</h1>
         <ProfileSkeleton />
       </div>
       <div>
         <h2 className="text-2xl font-bold p-6 pb-0 text-white">Tus Playlists</h2>
         <PlaylistSkeleton />
       </div>
     </div>
   );
 }

  // Si llegamos aquí, tenemos token y perfil. Mostrar el contenido del dashboard.
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sección de Perfil */}
      <div className="p-6 border-b border-gray-800"> {/* Añade un borde para separar */}
        <h1 className="text-2xl font-bold mb-4">Tu Perfil de Spotify</h1>
        {profile && ( // Asegúrate de que el perfil exista antes de mostrar
          <div className="flex items-center gap-4">
             {profile.images && profile.images[0] && (
                <img src={profile.images[0].url} alt="Foto de perfil" className="rounded-full w-16 h-16 object-cover" />
             )}
             <div>
                <p className="text-xl font-semibold">{profile.display_name}</p>
                <p className="text-gray-400 text-sm">{profile.email}</p>
                <p className="text-gray-400 text-sm">País: {profile.country}</p>
             </div>
              {/* Botón de Cerrar Sesión */}
             <button
               onClick={logout}
               className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
             >
               Cerrar Sesión
             </button>
          </div>
        )}
        {/* TODO: Añadir estadísticas de perfil (artistas/géneros más escuchados, etc.) aquí */}
      </div>

      {/* Sección de Playlists */}
      <div>
         <h2 className="text-2xl font-bold p-6 pb-0">Tus Playlists</h2>
         {/* Renderiza el componente PlaylistGrid */}
         <PlaylistGrid />
      </div>

      {/* TODO: Añadir otras secciones del dashboard (Feed, etc.) aquí */}
    </div>
  );
};

export default Dashboard;