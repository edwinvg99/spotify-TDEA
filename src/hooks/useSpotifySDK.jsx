import { useState, useEffect, useCallback } from 'react';

export const useSpotifySDK = (token) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!token) return;
  
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
  
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });
  
      setPlayer(player);
  
      player.addListener('ready', ({ device_id }) => {
        console.log('Dispositivo listo:', device_id);
        localStorage.setItem('spotify_device_id', device_id);
        setIsReady(true); // Marca como listo cuando el dispositivo está listo
      });
  
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Dispositivo no listo:', device_id);
        setIsReady(false); // Marca como no listo cuando el dispositivo no está disponible
      });
  
      player.addListener('player_state_changed', (state) => {
        if (!state) return;
  
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(state.paused === false);  // Sincroniza el estado de reproducción
        setProgress(state.position);
        setDuration(state.duration);
      });
  
      player.connect();
    };
  
    return () => {
      if (player) player.disconnect();
      document.body.removeChild(script);
    };
  }, [token]);
  
//   console.log('player', player);
// console.log('isReady', isReady);
// console.log('isPlaying', isPlaying);

  

  useEffect(() => {
    if (!isPlaying) return; // No actualices el progreso si está pausada
  
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= duration) {
          clearInterval(interval);
          return 0;
        }
        return prev + 1000;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [isPlaying, duration]);
  

  const playNewTrack = useCallback(async (uri) => {
    if (!player || !isReady) return;

    try {
      const device_id = localStorage.getItem('spotify_device_id');
      if (!device_id) {
        console.error('No se encontró ID del dispositivo');
        return;
      }
        
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      setIsPlaying(true);
    } catch (error) {
      console.error('Error reproduciendo track:', error);
    }
  }, [player, isReady, token]);

  const togglePlay = () => {
    if (!player) return;
  
    player.getCurrentState().then(state => {
      if (!state) return;
  
      if (state.paused) {
        player.resume();
      } else {
        player.pause();
      }
    });
  };
  
  
  
  
  
  

  const seekTo = useCallback(async (positionMs) => {
    if (!player) return;

    try {
      await player.seek(positionMs);
      setProgress(positionMs);
    } catch (error) {
      console.error('Error al buscar posición:', error);
    }
  }, [player]);
  
    // Implementación de nextTrack que faltaba
    const nextTrack = useCallback(async () => {
      if (!player) return;
  
      try {
        await player.nextTrack();
        console.log('Cambiando a siguiente canción');
      } catch (error) {
        console.error('Error al cambiar a la siguiente canción:', error);
      }
    }, [player]);
  
    // Implementación de previousTrack que faltaba
    const previousTrack = useCallback(async () => {
      if (!player) return;
  
      try {
        await player.previousTrack();
        console.log('Cambiando a canción anterior');
      } catch (error) {
        console.error('Error al cambiar a la canción anterior:', error);
      }
    }, [player]);

  return {
    currentTrack,
    isPlaying,
    progress,
    duration,
    playNewTrack,
    togglePlay,
    seekTo,
    isReady,
    nextTrack,    
    previousTrack  
    
    
    
    
  };
};
