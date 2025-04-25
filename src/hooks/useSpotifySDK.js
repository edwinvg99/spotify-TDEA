import { useState, useEffect, useRef } from 'react';

export const useSpotifySDK = (token, initialVolume = 50) => {
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef(null);
  const initializingRef = useRef(false);
  const progressInterval = useRef(null);

  const updateProgress = async () => {
    if (!playerRef.current) return;

    try {
      const state = await playerRef.current.getCurrentState();
      if (state) {
        const progressPercent = (state.position / state.duration) * 100;
        setProgress(progressPercent);
      }
    } catch (error) {
      console.error('Error actualizando progreso:', error);
    }
  };

  const startProgressInterval = () => {
    // Limpiar intervalo existente si hay alguno
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    // Crear nuevo intervalo que actualiza cada 1000ms (1 segundo)
    progressInterval.current = setInterval(updateProgress, 1000);
  };

  const stopProgressInterval = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Modificar el listener de estado del player
  useEffect(() => {
    if (!playerRef.current) return;

    playerRef.current.addListener('player_state_changed', state => {
      if (state) {
        setIsPlaying(!state.paused);
        
        if (state.duration > 0) {
          const progressPercent = (state.position / state.duration) * 100;
          setProgress(progressPercent);
        }

        // Si está reproduciendo, iniciar intervalo de progreso
        if (!state.paused) {
          startProgressInterval();
        } else {
          stopProgressInterval();
        }
      }
    });

    return () => {
      stopProgressInterval();
      if (playerRef.current) {
        playerRef.current.removeListener('player_state_changed');
      }
    };
  }, [playerRef.current]);

  // Limpiar intervalo cuando el componente se desmonta
  useEffect(() => {
    return () => {
      stopProgressInterval();
    };
  }, []);

  useEffect(() => {
    if (!token || initializingRef.current) return;

    const initializePlayer = async () => {
      try {
        const initSpotifyPlayer = () => {
          const player = new window.Spotify.Player({
            name: 'Spotify Clone Player',
            getOAuthToken: cb => { cb(token); },
            volume: initialVolume / 100,
            enableMediaSession: true,
            // Agregar configuración para manejar errores y eventos
            errorListener: (error) => {
              // Ignorar errores específicos de cpapi.spotify.com
              if (error.message?.includes('cpapi.spotify.com')) {
                return;
              }
              console.error('Player Error:', error);
            }
          });

          // Agregar listeners mejorados
          player.addListener('ready', ({ device_id }) => {
            console.log('Player listo:', device_id);
            setDeviceId(device_id);

            // Activar este dispositivo y manejar errores silenciosamente
            fetch('https://api.spotify.com/v1/me/player', {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                device_ids: [device_id],
                play: false
              })
            }).catch(() => {
              // Ignorar errores de activación del dispositivo
            });
          });

          player.addListener('initialization_error', ({ message }) => {
            if (!message.includes('cpapi.spotify.com')) {
              console.error('Error de inicialización:', message);
            }
          });

          player.addListener('authentication_error', ({ message }) => {
            console.error('Error de autenticación:', message);
          });

          player.addListener('account_error', ({ message }) => {
            console.error('Error de cuenta:', message);
          });

          // Conectar el player y manejar errores
          player.connect().then(success => {
            if (success) {
              playerRef.current = player;
            } else {
              console.error('Error conectando el player');
            }
          }).catch(error => {
            // Ignorar errores específicos de cpapi.spotify.com
            if (!error.message?.includes('cpapi.spotify.com')) {
              console.error('Error conectando:', error);
            }
          });
        };

        // Asignar la función de callback global
        window.onSpotifyWebPlaybackSDKReady = initSpotifyPlayer;

        // Si el SDK ya está cargado, inicializar directamente
        if (window.Spotify) {
          initSpotifyPlayer();
          return;
        }

        // Si no está cargado, cargar el script
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        // Manejar errores de carga del script
        script.onerror = (error) => {
          console.error('Error cargando Spotify SDK:', error);
          initializingRef.current = false;
        };

        document.body.appendChild(script);
      } catch (error) {
        if (!error.message?.includes('cpapi.spotify.com')) {
          console.error('Error inicializando reproductor:', error);
        }
        initializingRef.current = false;
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      window.onSpotifyWebPlaybackSDKReady = null;
      initializingRef.current = false;
    };
  }, [token, initialVolume]);

  const stopCurrentTrack = async () => {
    if (!playerRef.current || !deviceId) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/pause`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsPlaying(false);
      stopProgressInterval();
    } catch (error) {
      console.error('Error deteniendo reproducción:', error);
    }
  };

  const playNewTrack = async (trackUri) => {
    if (!deviceId) return;

    try {
      // Primero detener la reproducción actual
      await stopCurrentTrack();

      // Luego reproducir la nueva canción
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_id: deviceId,
          uris: [trackUri]
        })
      });

      setIsPlaying(true);
      startProgressInterval();
    } catch (error) {
      console.error('Error reproduciendo nueva track:', error);
    }
  };

  return {
    deviceId,
    isPlaying,
    progress,
    playerRef,
    setIsPlaying,
    setProgress,
    playNewTrack,  // Exportamos la nueva función
    stopCurrentTrack
  };
};