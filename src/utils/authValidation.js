// export const validateAuthResponse = (searchParams) => {
//   const code = searchParams.get('code');
//   const state = searchParams.get('state');
//   const error = searchParams.get('error');
//   const savedState = sessionStorage.getItem('auth_state');
//   const timestamp = sessionStorage.getItem('auth_timestamp');

//   // Limpiar estado anterior
//   const clearAuthState = () => {
//     sessionStorage.removeItem('auth_state');
//     sessionStorage.removeItem('auth_timestamp');
//   };

//   if (error) {
//     clearAuthState();
//     throw new Error(`Error de Spotify: ${error}`);
//   }

//   if (!code) {
//     clearAuthState();
//     throw new Error('No se recibió código de autorización');
//   }

//   // Validar timestamp si existe
//   if (timestamp) {
//     const elapsed = Date.now() - parseInt(timestamp);
//     if (elapsed > 300000) { // 5 minutos
//       clearAuthState();
//       throw new Error('La sesión de autorización ha expirado');
//     }
//   }

//   // Solo validar estado si existe uno guardado y no es undefined
//   if (savedState && state && savedState !== state) {
//     clearAuthState();
//     throw new Error('Estado de autenticación inválido');
//   }

//   // Si todo está bien, limpiar estado y retornar código
//   clearAuthState();
//   return code;
// };

// export const initializeAuthFlow = () => {
//   const state = crypto.randomUUID();
//   sessionStorage.setItem('auth_state', state);
//   sessionStorage.setItem('auth_timestamp', Date.now().toString());
//   return state;
// };