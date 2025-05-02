// // src/utils/sessionUtils.js

// /**
//  * Constantes de configuración
//  */
// const STORAGE_KEYS = {
//   ACCESS_TOKEN: 'spotify_token',
//   REFRESH_TOKEN: 'spotify_refresh_token',
//   DEVICE_ID: 'spotify_device_id',
//   AUTH_STATE: 'auth_state',
//   AUTH_TIMESTAMP: 'auth_timestamp'
// };

// const API_BASE_URL = 'https://api.spotify.com/v1';
// const AUTH_BASE_URL = 'https://accounts.spotify.com';

// /**
//  * Clase para gestionar las sesiones de Spotify y operaciones relacionadas
//  */
// class SpotifySessionManager {
//   /**
//    * Limpia todas las cookies relacionadas con Spotify
//    * @private
//    */
//   static _clearSpotifyCookies() {
//     try {
//       // Eliminar cookies con dominio spotify.com
//       document.cookie.split(";").forEach(c => {
//         document.cookie = c
//           .replace(/^ +/, "")
//           .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=.spotify.com");
//       });
      
//       // Limpiar todas las cookies del dominio actual
//       document.cookie.split(";").forEach(c => {
//         document.cookie = c
//           .replace(/^ +/, "")
//           .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
//       });
      
//       console.log('Cookies eliminadas correctamente');
//     } catch (error) {
//       console.error('Error al limpiar cookies:', error);
//     }
//   }

//   /**
//    * Limpia todos los datos de sesión relacionados con Spotify
//    * de localStorage y sessionStorage
//    * @private
//    */
//   static _clearAllStorageData() {
//     try {
//       // Limpiar localStorage
//       Object.values(STORAGE_KEYS).forEach(key => {
//         localStorage.removeItem(key);
//       });
      
//       // Limpiar sessionStorage
//       sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
//       sessionStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
      
//       console.log('Datos de almacenamiento local eliminados');
//     } catch (error) {
//       console.error('Error al limpiar almacenamiento:', error);
//     }
//   }

//   /**
//    * Cierra la sesión completa de Spotify y limpia datos locales
//    * @returns {Promise<boolean>} - Resultado de la operación
//    */
//   static async logout() {
//     console.log('Iniciando proceso de logout...');
    
//     try {
//       // 1. Limpiar almacenamiento local
//       this._clearAllStorageData();
      
//       // 2. Limpiar cookies
//       this._clearSpotifyCookies();
      
//       // 3. Forzar cierre de sesión en Spotify
//       window.location.href = `${AUTH_BASE_URL}/logout`;
      
//       // Esperar a que se complete el logout
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Redirigir de vuelta a la app
//       window.location.href = '/';
//       return true;
//     } catch (error) {
//       console.error('Error al cerrar sesión:', error);
//       return false;
//     }
//   }

//   /**
//    * Verifica si hay un token almacenado válido
//    * @returns {boolean}
//    */
//   static hasValidToken() {
//     const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
//     const timestamp = sessionStorage.getItem(STORAGE_KEYS.AUTH_TIMESTAMP);
    
//     if (!token) return false;
    
//     // Si tenemos timestamp, verificar que el token no haya expirado
//     // (considerando que expira en 1 hora)
//     if (timestamp) {
//       const now = Date.now();
//       const authTime = parseInt(timestamp, 10);
//       const HOUR_IN_MS = 3600 * 1000;
      
//       // Si pasó más de 1 hora, considerar inválido
//       if (now - authTime > HOUR_IN_MS) {
//         return false;
//       }
//     }
    
//     return true;
//   }

//   /**
//    * Verifica si el usuario ha completado el proceso de autenticación
//    * con redirección OAuth
//    * @returns {boolean}
//    */
//   static isAuthenticating() {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.has('code') || urlParams.has('error');
//   }

//   /**
//    * Renueva el token de acceso usando el refresh token
//    * @returns {Promise<boolean>} - Éxito o fracaso en la renovación
//    */
//   static async refreshToken() {
//     try {
//       const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
//       if (!refreshToken) {
//         console.warn('No hay refresh token disponible');
//         return false;
//       }

//       const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      
//       // Importante: En producción, esto debería hacerse desde el backend
//       // para no exponer el client secret en el frontend
//       const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

//       if (!clientId || !clientSecret) {
//         console.error('Credenciales de cliente no disponibles');
//         return false;
//       }

//       const response = await fetch(`${AUTH_BASE_URL}/api/token`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
//         },
//         body: new URLSearchParams({
//           grant_type: 'refresh_token',
//           refresh_token: refreshToken
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error('Error renovando token:', response.status, errorData);
//         return false;
//       }

//       const data = await response.json();
      
//       // Guardar nuevo token
//       localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
      
//       // Actualizar timestamp
//       sessionStorage.setItem(STORAGE_KEYS.AUTH_TIMESTAMP, Date.now().toString());
      
//       // Actualizar refresh token si se recibió uno nuevo
//       if (data.refresh_token) {
//         localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
//       }

//       console.log('Token renovado correctamente');
//       return true;
//     } catch (error) {
//       console.error('Error en proceso de renovación de token:', error);
//       return false;
//     }
//   }

//   /**
//    * Prepara y ejecuta una solicitud a la API de Spotify con el token actual
//    * @param {string} endpoint - Endpoint de la API (sin el prefijo)
//    * @param {Object} options - Opciones para fetch
//    * @returns {Promise<Response>} - Respuesta de la API
//    * @throws {Error} - Error si la solicitud falla
//    */
//   static async apiRequest(endpoint, options = {}) {
//     const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
//     if (!token) {
//       throw new Error('No hay token de acceso disponible');
//     }
    
//     const url = endpoint.startsWith('https://') 
//       ? endpoint 
//       : `${API_BASE_URL}/${endpoint.replace(/^\/+/, '')}`;
    
//     const fetchOptions = {
//       ...options,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//         ...options.headers
//       }
//     };
    
//     try {
//       const response = await fetch(url, fetchOptions);
      
//       // Manejar diferentes códigos de estado
//       if (response.status === 401) {
//         console.log('Token expirado, intentando renovar...');
//         const refreshed = await this.refreshToken();
        
//         if (refreshed) {
//           // Reintentar la petición con el nuevo token
//           return this.apiRequest(endpoint, options);
//         } else {
//           // Si no se pudo renovar, forzar logout
//           await this.logout();
//           throw new Error('Sesión expirada');
//         }
//       }
      
//       // Errores de permisos o de cuenta
//       if (response.status === 403) {
//         console.error('Error de permisos en API:', response.status);
//         await this.logout();
//         throw new Error('Error de permisos con tu cuenta de Spotify');
//       }
      
//       // Manejar otros errores
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
//       }
      
//       return response;
//     } catch (error) {
//       // Rethrow para manejar en componentes
//       console.error('Error en solicitud API:', error);
//       throw error;
//     }
//   }

//   /**
//    * Obtiene los datos de una respuesta de API parseados como JSON
//    * @param {string} endpoint - Endpoint de la API
//    * @param {Object} options - Opciones para fetch
//    * @returns {Promise<Object>} - Datos JSON de la respuesta
//    */
//   static async getJsonResponse(endpoint, options = {}) {
//     const response = await this.apiRequest(endpoint, options);
//     return response.json();
//   }
// }

// // Exportar la clase para uso en la aplicación
// export default SpotifySessionManager;

// // Exportar también métodos individuales para compatibilidad con código existente
// export const hasStoredToken = () => SpotifySessionManager.hasValidToken();
// export const isAuthenticating = () => SpotifySessionManager.isAuthenticating();
// export const forceSpotifyLogout = () => SpotifySessionManager.logout();
// export const refreshSpotifyToken = () => SpotifySessionManager.refreshToken();
// export const spotifyFetch = (endpoint, options) => SpotifySessionManager.apiRequest(endpoint, options);
// export const clearSpotifyCookies = () => SpotifySessionManager._clearSpotifyCookies();
// export const clearAllStorageData = () => SpotifySessionManager._clearAllStorageData();