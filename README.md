# Spotify TDEA

Esta aplicación es un "clon" de Spotify que  se desarrollo usando React + Vite. Permite conectarse con la API de Spotify, ver playlists y sus detalles, canciones etc y reproducir música usando el SDK oficial de Spotify.

## 🚀 Características Principales

- Autenticación con Spotify
- Visualización de datos del perfil del usuario
- Lista de playlists del usuario
- Reproducción de música
- Controles de reproducción (play, pause)
- Barra de progreso de reproducción

## 🏗️ Estructura del Proyecto

### 📁 Componentes Principales

- `Auth/`: Maneja la autenticación
  - `Login.jsx`: Pantalla de inicio de sesión con Spotify
  - `SpotifyAuth.jsx`: Lógica de autenticación OAuth

- `Dashboard/`: 
  - `Dashboard.jsx`: Pantalla principal que muestra el perfil y playlists

- `Player/`: 
  - `SpotifyPlayer.jsx`: Reproductor de música usando SDK de Spotify
  - `PlayerControls.jsx`: Controles de reproducción (play/pause)

- `Playlists/`:
  - `PlaylistGrid.jsx`: Cuadrícula de playlists del usuario
  - `PlaylistDetail.jsx`: Vista detallada de una playlist

### 🎣 Hooks Personalizados

- `useSpotifySDK.js`: 
  - Maneja la integración con el SDK de Spotify
  - Controla la reproducción de música
  - Maneja estados de reproducción y progreso

- `SpotifyContext.jsx`: 
  - Gestiona el estado global de la autenticación
  - Maneja el token de acceso
  - Provee el hook `useSpotify`

### 🌐 Conexión con Spotify

#### Autenticación
La conexión con Spotify se realiza en `SpotifyAuth.jsx` usando OAuth 2.0:
```javascript
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'streaming',
  // ...más scopes
];
```

#### Endpoints Principales
Los endpoints se manejan en `services/spotify.js`:
- `/me`: Obtener perfil de usuario
- `/me/playlists`: Obtener playlists
- `/playlists/{id}`: Obtener detalles de playlist
- `/me/player/play`: Controlar reproducción

### 🎵 SDK de Spotify

El SDK de Spotify (Web Playback SDK) se integra en `useSpotifySDK.js` y permite:
- Reproducir música directamente en el navegador
- Controlar la reproducción
- Obtener estados de reproducción
- Manejar eventos del reproductor

## 🚦 Estados y Manejo de Errores

- Loading states: Uso de esqueletos de carga (skeletons)
- Error handling: Mensajes de error amigables
- Estados de reproducción: Play, pause, loading

## 🔧 Variables de Entorno Necesarias

```env
VITE_SPOTIFY_CLIENT_ID=tu_client_id
VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret
VITE_REDIRECT_URI=http://127.0.0.1:8000/callback
```

## 📚 Tecnologías Utilizadas

- React + Vite
- Tailwind CSS para estilos
- React Router para navegación
- Spotify Web API
- Spotify Web Playback SDK

## 🏃‍♂️ Cómo Ejecutar el Proyecto

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Crea un archivo `.env` con las variables necesarias
4. Ejecuta: `npm run dev`
5. Abre: `http://127.0.0.1:8000`

## 🎯 Próximas Mejoras
- [ ] Priorizar lo solicitado en el docuemnto del profesor 
- [ ] Añadir búsqueda de canciones
- [ ] Mejorar manejo de errores
- [ ] Implementar controles de volumen, siguiente cancion y anterior
- [ ] Añadir modo offline
