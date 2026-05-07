// Re-exporta el contexto compartido del SDK.
// Todos los componentes que llamen useSpotifySDK(_token) reciben
// el mismo estado — el SDK se inicializa una sola vez en SpotifySDKProvider.
export { useSpotifySDKContext as useSpotifySDK } from "../../features/authSpotify/context/SpotifySDKContext";
