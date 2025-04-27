import AboutSection from "../dj/AboutSection";
import EventSlider from "../dj/EventSlider";
import SongList from "../dj/SongList";

const MainContent = () => (
  <div className="p-8 space-y-8">
    <AboutSection />
    <EventSlider />
    <SongList />
  </div>
);

export default MainContent;