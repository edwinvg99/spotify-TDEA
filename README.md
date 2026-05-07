# 🎵 BeatLog

Aplicación web personal de música construida con **React + Vite**, integrada con la **API y SDK de Spotify**. Permite reproducir música, explorar playlists, ver estadísticas de escucha y descubrir las playlists de otros usuarios. Cuenta con autenticación dual (Firebase + Spotify OAuth) y un reproductor completo con el SDK oficial de Spotify.

> Desarrollado por **Edwin VG** — [github.com/edwinvg99](https://github.com/edwinvg99)

---

## 🚀 Características

- 🔐 **Autenticación dual** — Firebase Auth + OAuth de Spotify
- 🎧 **Reproductor completo** — Reproducir, pausar, siguiente/anterior, volumen y barra de progreso
- 📱 **Panel móvil flotante** — Acceso al reproductor desde cualquier pantalla sin interrumpir la música
- 📋 **Playlists** — Exploración y reproducción desde contexto
- 📊 **Estadísticas personales** — Artistas, géneros y historial de reproducción
- 👥 **Comunidad** — Ve las playlists públicas de otros usuarios de la app
- 👤 **Perfil editable** — Con foto de perfil y datos de usuario
- 🎪 **Sección de eventos** — Plantilla para promoción de eventos musicales
- 📐 **Diseño responsive** — Mobile-first, funciona en cualquier dispositivo

---

## 💻 Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 6 |
| Estilos | Tailwind CSS v4 |
| Auth | Firebase Authentication |
| Base de datos | Firebase Firestore |
| Almacenamiento | Firebase Storage |
| Ruteo | React Router v7 |
| Música | Spotify Web API + Playback SDK |
| Notificaciones | React Toastify |
| Deploy | Railway |

---

## 🛠️ Instalación local

```bash
# Clona el repositorio
git clone https://github.com/edwinvg99/spotify-TDEA.git
cd spotify-TDEA

# Instala dependencias
npm install

# Crea el archivo de variables de entorno
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
VITE_SPOTIFY_CLIENT_ID=tu_client_id
VITE_REDIRECT_URI=http://127.0.0.1:8000/callback
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

```bash
# Servidor de desarrollo
npm run dev
```

---

## 🚢 Deploy en Railway

```bash
# Build
npm run build

# Start (Railway usa $PORT automáticamente)
npm run start
```

En Railway > Variables, agrega todas las variables del `.env` y cambia `VITE_REDIRECT_URI` a la URL de tu app en Railway. Recuerda también agregar esa URL como Redirect URI en el [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

---

## 📁 Estructura principal

```
src/
├── features/
│   ├── authFirebase/     # Login, registro, contexto Firebase
│   ├── authSpotify/      # OAuth Spotify, SDK context
│   ├── dashboard/        # Panel principal, MySpotify, OtherUsersPlaylists
│   ├── dj/               # Sección de eventos
│   ├── playLists/        # Grid y detalle de playlists
│   ├── player/           # Reproductor, volumen, progreso, drawer móvil
│   └── userProfile/      # Perfil, búsqueda de usuarios
└── shared/
    ├── components/        # Navbar, Footer, layout general
    └── hooks/             # useSpotifySDK
```
