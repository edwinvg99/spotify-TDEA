const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

export const spotifyService = {
  async getUserProfile(token) {
    const response = await fetch(`${SPOTIFY_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async getUserPlaylists(token) {
    const response = await fetch(`${SPOTIFY_BASE_URL}/me/playlists`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async getPlaylistTracks(token, playlistId) {
    const response = await fetch(`${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};