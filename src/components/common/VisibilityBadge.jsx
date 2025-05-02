const VisibilityBadge = ({ isPublic, isCollaborative, size = 'normal' }) => {
  let status = isCollaborative ? 'collaborative' : isPublic ? 'public' : 'private';
  
  const getStatusConfig = (status) => {
    switch(status) {
      case 'collaborative':
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-400',
          label: 'Colaborativa',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className={size === 'small' ? 'h-2.5 w-2.5' : 'h-3 w-3'} viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          )
        };
      case 'public':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          label: 'Pública',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className={`${size === 'small' ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'private':
        return {
          bg: 'bg-purple-500/20',
          text: 'text-purple-400',
          label: 'Privada',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className={`${size === 'small' ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${
      size === 'small' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
    }`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default VisibilityBadge;