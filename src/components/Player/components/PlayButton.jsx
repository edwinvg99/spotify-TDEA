import React from 'react';

/**
 * Botón para controlar la reproducción de audio
 * @param {boolean} isPlaying - Estado de reproducción actual
 * @param {function} togglePlay - Función para alternar reproducción/pausa
 * @param {boolean} sidebarMode - Modo compacto para sidebar
 */
const PlayButton = ({ isPlaying, togglePlay, sidebarMode }) => {
  // Usar clases condicionales explícitas en lugar de interpolación
  const buttonClasses = `rounded-full bg-white hover:bg-gray-200 transition-colors focus:outline-none ${
    sidebarMode ? 'p-2' : 'p-3'
  }`;
  
  const iconClasses = sidebarMode ? 'w-4 h-4' : 'w-6 h-6';

  // Manejador de evento con prevención de propagación
  const handleClick = (e) => {
    e.stopPropagation();
    togglePlay();
  };

  return (
    <button
      onClick={handleClick}
      className={buttonClasses}
      aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      type="button"
    >
      {isPlaying ? (
        <svg className={iconClasses} fill="black" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      ) : (
        <svg className={iconClasses} fill="black" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </button>
  );
};

export default PlayButton;