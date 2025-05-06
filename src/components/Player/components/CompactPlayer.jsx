import TrackInfo from './TrackInfo';
import PrevNextButtons from '../PrevNextButtons';
import ProgressBar from './ProgressBar';

const CompactPlayer = ({ 
  currentTrack,
  isPlaying,
  togglePlay,
  progress,
  duration,
  progressBarStyle,
  handleSeek,
  handleDragStart,
  handleDragEnd,
  formatTime,
  previousTrack,
  nextTrack 
}) => (
  <div className="bg-gray-900/95 rounded-lg p-2">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <TrackInfo currentTrack={currentTrack} sidebarMode={true} />
      </div>

      <ProgressBar
        progress={progress}
        duration={duration}
        formatTime={formatTime}
        handleSeek={handleSeek}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        progressBarStyle={progressBarStyle}
        sidebarMode={true}
      />

      <div className="flex justify-center items-center gap-4">
        <PrevNextButtons
          previousTrack={previousTrack}
          nextTrack={nextTrack}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          sidebarMode={true}
        />
      </div>
    </div>
  </div>
);

export default CompactPlayer;