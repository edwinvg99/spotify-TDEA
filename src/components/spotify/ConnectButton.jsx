const ConnectButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className=" bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition "
  >
    Conectar con Spotify
  </button>
);

export default ConnectButton;