import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSpotify } from "./SpotifyContext";

const SpotifySDKContext = createContext(null);

const spotifyFetch = (method, path, token, body = null) =>
  fetch(`https://api.spotify.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

export const SpotifySDKProvider = ({ children }) => {
  const { token } = useSpotify();

  const [isReady, setIsReady]       = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [duration, setDuration]     = useState(0);
  const [volume, setVolume]         = useState(0.5);

  const tokenRef      = useRef(token);
  const isPlayingRef  = useRef(false);
  const playerRef     = useRef(null);
  const autoNextRef   = useRef(false);

  useEffect(() => { tokenRef.current = token; },      [token]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // ─── SDK init ──────────────────────────────────────────────────────────────
  // Se ejecuta una sola vez (por token). En React StrictMode los efectos se
  // invocan dos veces; el flag `mounted` garantiza que solo el ciclo vigente
  // pueda modificar estado/localStorage.
  useEffect(() => {
    if (!token) return;

    let mounted = true; // false tras el cleanup → ignora callbacks de players stale

    // Script: añadir solo si todavía no está en el DOM
    if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
      const s = document.createElement("script");
      s.src   = "https://sdk.scdn.co/spotify-player.js";
      s.async = true;
      document.body.appendChild(s);
    }

    // Funciones con nombre para poder hacer removeListener en el cleanup
    function onReady({ device_id }) {
      if (!mounted) return; // ignora ready stale de un player ya desconectado
      localStorage.setItem("spotify_device_id", device_id);
      setIsReady(true);
    }

    function onNotReady() {
      if (!mounted) return;
      localStorage.removeItem("spotify_device_id");
      setIsReady(false);
    }

    function onStateChanged(state) {
      if (!mounted || !state) return;
      setCurrentTrack(state.track_window.current_track);
      setIsPlaying(!state.paused);
      setProgress(state.position);
      setDuration(state.duration);
      autoNextRef.current = false;
    }

    function initPlayer() {
      if (!mounted)        return; // cleanup ya corrió antes de que el SDK cargara
      if (playerRef.current) return; // player ya existe en este ciclo

      const player = new window.Spotify.Player({
        name: "Spotify Web Player",
        getOAuthToken: (cb) => cb(tokenRef.current),
        volume: 0.5,
      });

      playerRef.current = player;

      player.addListener("ready",                onReady);
      player.addListener("not_ready",            onNotReady);
      player.addListener("player_state_changed", onStateChanged);
      player.addListener("autoplay_failed", () =>
        console.warn("Autoplay bloqueado — requiere interacción del usuario.")
      );

      player.connect().then((ok) => {
        if (!ok) console.error("No se pudo conectar el SDK de Spotify.");
      });
    }

    // El SDK llama esta función global al cargar
    window.onSpotifyWebPlaybackSDKReady = initPlayer;

    // Si el SDK ya estaba cargado en window (hot-reload en dev), disparar manualmente
    if (window.Spotify && !playerRef.current) initPlayer();

    return () => {
      mounted = false; // cualquier callback async pendiente queda anulado

      if (playerRef.current) {
        // Quitar listeners ANTES de disconnect para evitar eventos stale
        playerRef.current.removeListener("ready",                onReady);
        playerRef.current.removeListener("not_ready",            onNotReady);
        playerRef.current.removeListener("player_state_changed", onStateChanged);
        playerRef.current.disconnect();
        playerRef.current = null;
      }

      localStorage.removeItem("spotify_device_id");
      setIsReady(false);
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Progreso suave entre eventos del SDK ────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(
      () => setProgress((p) => (p >= duration ? p : p + 1000)),
      1000
    );
    return () => clearInterval(id);
  }, [isPlaying, duration]);

  // ── Auto-siguiente al terminar la canción (fallback sin context_uri) ────
  useEffect(() => {
    if (!isPlaying || !duration || progress < duration || autoNextRef.current) return;
    autoNextRef.current = true;
    spotifyFetch("POST", "me/player/next", tokenRef.current).catch(console.error);
  }, [progress, duration, isPlaying]);

  // ─── Controles via REST API ─────────────────────────────────────────────

  const playNewTrack = useCallback(async (uri, contextUri = null) => {
    const token     = tokenRef.current;
    const device_id = localStorage.getItem("spotify_device_id");

    if (!device_id) {
      console.warn("Dispositivo no listo todavía — espera un momento.");
      return;
    }

    const body = contextUri
      ? { context_uri: contextUri, offset: { uri } }
      : { uris: [uri] };

    const doPlay = (id) =>
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    // Busca "Spotify Web Player" en los dispositivos registrados en la API de Spotify.
    // Más fiable que localStorage porque confirma que el backend ya reconoce el device.
    const findOurDevice = async () => {
      try {
        const r = await fetch("https://api.spotify.com/v1/me/player/devices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) return null;
        const data = await r.json();
        return data.devices?.find((d) => d.name === "Spotify Web Player") ?? null;
      } catch {
        return null;
      }
    };

    try {
      let res = await doPlay(device_id);

      if (res.status === 404) {
        // Primero verificar si el device ya existe con otro ID en la API
        let device = await findOurDevice();

        if (!device && playerRef.current) {
          // Si no está registrado, intentar reconectar el SDK
          playerRef.current.connect();

          // Polling a la API de Spotify (no localStorage) cada 500 ms hasta 6 s
          const MAX_WAIT = 6000;
          const INTERVAL = 500;
          let elapsed = 0;
          while (elapsed < MAX_WAIT) {
            await new Promise((r) => setTimeout(r, INTERVAL));
            elapsed += INTERVAL;
            device = await findOurDevice();
            if (device) break;
          }
        }

        if (!device) {
          console.error("El dispositivo no se pudo registrar en Spotify.");
          return;
        }

        // Actualizar localStorage con el ID fresco
        localStorage.setItem("spotify_device_id", device.id);
        setIsReady(true);
        res = await doPlay(device.id);
      }

      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        console.error("Error al reproducir:", err.error?.message ?? res.status);
        return;
      }

      setIsPlaying(true);
    } catch (err) {
      console.error("Error reproduciendo track:", err);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    const token = tokenRef.current;
    try {
      if (isPlayingRef.current) {
        await spotifyFetch("PUT", "me/player/pause", token);
        setIsPlaying(false);
      } else {
        await spotifyFetch("PUT", "me/player/play", token);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error en togglePlay:", err);
    }
  }, []);

  const seekTo = useCallback(async (positionMs) => {
    try {
      await spotifyFetch("PUT", `me/player/seek?position_ms=${positionMs}`, tokenRef.current);
      setProgress(positionMs);
    } catch (err) {
      console.error("Error buscando posición:", err);
    }
  }, []);

  const nextTrack = useCallback(async () => {
    try {
      await spotifyFetch("POST", "me/player/next", tokenRef.current);
    } catch (err) {
      console.error("Error siguiente canción:", err);
    }
  }, []);

  const previousTrack = useCallback(async () => {
    try {
      await spotifyFetch("POST", "me/player/previous", tokenRef.current);
    } catch (err) {
      console.error("Error canción anterior:", err);
    }
  }, []);

  const setVolumeLevel = useCallback(async (value) => {
    try {
      await spotifyFetch(
        "PUT",
        `me/player/volume?volume_percent=${Math.round(value * 100)}`,
        tokenRef.current
      );
      setVolume(value);
    } catch (err) {
      console.error("Error ajustando volumen:", err);
    }
  }, []);

  return (
    <SpotifySDKContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isReady,
        progress,
        duration,
        volume,
        playNewTrack,
        togglePlay,
        seekTo,
        nextTrack,
        previousTrack,
        setVolumeLevel,
      }}
    >
      {children}
    </SpotifySDKContext.Provider>
  );
};

export const useSpotifySDKContext = () => {
  const ctx = useContext(SpotifySDKContext);
  if (!ctx) throw new Error("useSpotifySDKContext debe usarse dentro de SpotifySDKProvider");
  return ctx;
};
