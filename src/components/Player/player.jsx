import AudioPlayer from './AudioPlayer';

const Player = ({ track, onNext, onPrevious }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Info de la canción */}
        <div className="flex items-center w-1/4">
          {track && (
            <>
              <img 
                src={track.album?.images?.[0]?.url} 
                alt={track.name} 
                className="w-14 h-14 rounded mr-4"
              />
              <div>
                <p className="text-white font-medium">{track.name}</p>
                <p className="text-gray-400 text-sm">
                  {track.artists?.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Reproductor de audio */}
        <div className="flex-1 flex justify-center">
          {track?.preview_url && (
            <AudioPlayer 
              url={track.preview_url}
              onNext={onNext}
              onPrevious={onPrevious}
            />
          )}
        </div>

        {/* Espacio para mantener el layout centrado */}
        <div className="w-1/4"></div>
      </div>
    </div>
  );
};

export default Player;