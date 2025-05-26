import AboutSection from "../../../features/dj/components/AboutSection";
import EventSlider from "../../../features/dj/components/EventSlider";
import SongList from "../../../features/dj/components/SongList";

const MainContent = () => (
  <div className="p-8 space-y-8">
    <AboutSection />
    <EventSlider />
    <SongList />
  </div>
);

export default MainContent;
