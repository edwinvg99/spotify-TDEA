import TrackInfo from "./TrackInfo";
import PrevNextButtons from "../PrevNextButtons";
import ProgressBar from "./ProgressBar";

const FullPlayer = ({
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
  nextTrack,
}) => (
  <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 z-[9999]">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto sm:flex-1">
        <TrackInfo currentTrack={currentTrack} sidebarMode={false} />
      </div>

      <div className="flex flex-col items-center gap-2 w-full sm:flex-1 sm:max-w-xl">
        <div className="flex items-center gap-4">
          <PrevNextButtons
            previousTrack={previousTrack}
            nextTrack={nextTrack}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            sidebarMode={false}
          />
        </div>
        <ProgressBar
          progress={progress}
          duration={duration}
          formatTime={formatTime}
          handleSeek={handleSeek}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          progressBarStyle={progressBarStyle}
          sidebarMode={false}
        />
      </div>

      <div className="hidden sm:block sm:flex-1"></div>
    </div>
  </div>
);

export default FullPlayer;
