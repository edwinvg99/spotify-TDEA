# 🎵 Spotify TDEA

Una App que integra Spotify desarrollado con **React** y **Vite**, que se integra con la **API de Spotify**, permitiendo la reproducción de música, visualizacion de playlists y perfiles de usuario. Cuenta con **autenticación dual** (Spotify y Firebase) y un reproductor de música con el **SDK oficial de Spotify**.



## 📋 Tabla de Contenidos

- [🚀 Características](#-características)
- [💻 Tecnologías](#-tecnologías)
- [🔐 Componentes principales](#-autenticación)
- [🛠️ Instalación](#️-instalación)

---

## 🚀 Características

- 🔐 **Autenticación dual**: Firebase Auth + OAuth de Spotify  
- 👤 **Perfil de usuario**: Visualización y edición  
- 🎶 **Exploración de música**: Playlists y canciones  
- ▶️ **Reproductor de música**: con el SDK de Spotify  
- 📱 **Diseño responsivo**: Adaptado a móviles y escritorio  
- ⏱️ **Interfaz en tiempo real**: Progreso de reproducción  
- 📊 **Estadísticas de Spotify**: Artistas y géneros favoritos  
- 🎧 **Galería de eventos DJ**: Sección para promoción de eventos  

---

## 💻 Tecnologías

- **Frontend**: React 18 + Vite  
- **Estilos**: TailwindCSS  
- **Autenticación**: Firebase Authentication  
- **Base de datos**: Firebase Firestore  
- **Almacenamiento**: Firebase Storage  
- **Ruteo**: React Router v6  
- **Notificaciones**: React Toastify  
- **APIs**: Spotify Web API, Spotify Web Playback SDK  

---


### 📁 Componentes Principales

#### 🔐 Autenticación
- `AuthContext.jsx`: Contexto central para autenticación con Firebase  
- `loginApp.jsx`: Formulario de inicio de sesión  
- `registerApp.jsx`: Registro con carga de foto  
- `signInGoogleApp.jsx`: Autenticación con Google  

#### 👤 Perfil
- `MyProfile.jsx`: Ver y editar perfil  
- `ProfileSection.jsx`: Vista del perfil en el dashboard  

#### 🎵 Música
- `SpotifyPlayer.jsx`: Reproductor principal  
- `PlayButton.jsx`: Botón de reproducción/pausa  
- `ProgressBar.jsx`: Barra de progreso  
- `TrackInfo.jsx`: Información de la canción actual  

#### 📋 Playlists
- `PlaylistGrid.jsx`: Cuadrícula de playlists  
- `PlaylistDetail.jsx`: Vista detallada de una playlist  
- `PlaylistCard.jsx`: Tarjeta individual  

#### 🎛️ Dashboard
- `Dashboard.jsx`: Panel principal de usuario  
- `MySpotify.jsx`: Estadísticas personales  

#### 🎣 Hooks Personalizados
- `useSpotifySDK.jsx`: Integración con el SDK  
- `useAuth.jsx`: Acceso al contexto de autenticación  

#### 🌐 Contextos
- `SpotifyContext.jsx`: Manejo de datos y tokens de Spotify  
- `AuthContext.jsx`: Manejo global de sesión con Firebase  

---

## 🛠️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/edwinvg99/spotify-TDEA.git
cd spotify-clone-tdea

# Instala dependencias
npm install

# Crea un archivo .env en la raíz con las variables necesarias
VITE_SPOTIFY_CLIENT_ID=
VITE_SPOTIFY_CLIENT_SECRET=
VITE_REDIRECT_URI=http://127.0.0.1:8000/callback
VITE_SPOTIFY_SDK_SCRIPT=https://sdk.scdn.co/spotify-player.js
VITE_PLAYER_NAME=Spotify Clone TDEA

# Ejecuta el servidor de desarrollo
npm run dev