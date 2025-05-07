const SearchBar = ({ searchTerm, setSearchTerm, isSidebar }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar playlist..."
        className={`
          bg-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 
          focus:ring-purple-400 placeholder-gray-400
          ${isSidebar ? 'px-3 py-1 w-40' : 'px-4 py-2 w-64'}
        `}
      />
      
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               className={`${isSidebar ? 'h-4 w-4' : 'h-5 w-5'}`} 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;