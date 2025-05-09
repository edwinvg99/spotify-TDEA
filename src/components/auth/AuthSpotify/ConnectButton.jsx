import { memo } from 'react';

const ConnectButton = ({ onClick, isAuthenticating }) => {
  return (
    <button
      onClick={onClick}
      disabled={isAuthenticating}
      className={`
        bg-green-500 hover:bg-green-600 text-white font-bold 
        py-2 px-3 rounded-full transition-colors
        ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isAuthenticating ? 'Conectando...' : 'Conectar con Spotify'}
    </button>
  );
};

export default memo(ConnectButton);