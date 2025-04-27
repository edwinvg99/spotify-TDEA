const ConnectButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition"
  >
    Conectar con Spotify
  </button>
);

export default ConnectButton;