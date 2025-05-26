const Header = () => (
  <header className="relative bg-gradient-to-r from-purple-800 via-black to-gray-900 h-64 flex items-center justify-center mb-8">
    <img
      src="/assets/dj-banner.jpeg"
      alt="DJ Banner"
      className="absolute inset-0 w-full h-full object-cover opacity-30"
    />
    <div className="relative z-10 text-center">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
        DJ Nova
      </h1>
      <p className="text-xl text-purple-200 mt-4">
        ¡Siente el ritmo, vive la experiencia!
      </p>
    </div>
  </header>
);

export default Header;
