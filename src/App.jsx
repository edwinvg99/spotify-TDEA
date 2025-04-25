import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpotifyProvider } from './context/SpotifyContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PlaylistGrid from './components/Playlists/PlaylistGrid';
import PlaylistDetail from './components/Playlists/PlaylistDetail';

function App() {
  return (
    <SpotifyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/playlists" element={<PlaylistGrid />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
          
        </Routes>
      </Router>
    </SpotifyProvider>
  );
}

export default App;