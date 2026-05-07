import AboutSection from "../../../features/dj/components/AboutSection";
import EventSlider from "../../../features/dj/components/EventSlider";
import SongList from "../../../features/dj/components/SongList";
import HomeBackground from "../../../features/dj/components/HomeBackground";

const MainContent = () => (
  <div className="relative min-h-screen">
    <HomeBackground />
    <div className="relative z-10 p-8 space-y-8">
      <AboutSection />
      <EventSlider />
      <SongList />
    </div>
  </div>
);

export default MainContent;
