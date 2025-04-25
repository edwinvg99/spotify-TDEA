// src/components/Player/AudioPlayer.jsx
import { useState, useEffect, useRef } from 'react';

const AudioPlayer = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    console.log('Track recibido:', track);
    
    if (!track?.preview_url) {
      console.warn('Preview URL no disponible para:', track?.name);
      return;
    }

    try {
      // Crear nuevo elemento de audio
      const audio = new Audio(track.preview_url);
      audioRef.current = audio;

      // Configurar eventos
      audio.addEventListener('loadeddata', () => {
        console.log('Audio cargado exitosamente');
      });

      audio.addEventListener('playing', () => {
        console.log('Audio reproduciendo');
        setIsPlaying(true);
      });

      audio.addEventListener('pause', () => {
        console.log('Audio pausado');
        setIsPlaying(false);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('error', (e) => {
        console.error('Error al cargar el audio:', e);
      });

      // Limpiar al desmontar
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error al inicializar el audio:', error);
    }
  }, [track]);

  const togglePlay = async () => {
    console.log('Toggle play llamado');
    
    if (!audioRef.current) {
      console.warn('No hay audio disponible');
      return;
    }

    try {
      if (isPlaying) {
        console.log('Pausando audio...');
        audioRef.current.pause();
      } else {
        console.log('Iniciando reproducción...');
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Reproducción iniciada con éxito');
            })
            .catch(error => {
              console.error('Error al reproducir:', error);
            });
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error en togglePlay:', error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Info de la canción */}
        <div className="flex items-center space-x-4">
          <img 
            src={track?.album?.images?.[0]?.url} 
            alt={track?.name}
            className="w-14 h-14 rounded"
          />
          <div>
            <p className="text-white font-medium">{track?.name}</p>
            <p className="text-gray-400 text-sm">
              {track?.artists?.map(artist => artist.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Controles de reproducción */}
        <div className="flex items-center space-x-6">
          <button
            onClick={togglePlay}
            className="bg-white rounded-full p-2 hover:scale-110 transition"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="flex-1 mx-6">
          <div className="h-1 bg-gray-600 rounded-full">
            <div 
              className="h-full bg-white rounded-full"
              style={{ 
                width: `${(currentTime / 30) * 100}%` // Las previews son de 30 segundos
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
