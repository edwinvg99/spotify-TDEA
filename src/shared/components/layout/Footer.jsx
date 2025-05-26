const Footer = () => (
  <footer className="bg-black bg-opacity-80 text-white text-center py-4 mt-8">
    <div>
      <span className="font-bold text-purple-400">DJ Nova</span> &copy; {new Date().getFullYear()} | Sígueme en
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ml-2 text-purple-400 hover:underline">Instagram</a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="ml-2 text-purple-400 hover:underline">Twitter</a>
    </div>
  </footer>
);

export default Footer;