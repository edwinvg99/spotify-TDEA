const AboutSection = () => {
  return (
    <section className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-black"></div>
      
      {/* Contenedor principal */}
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Imagen del DJ */}
          <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3]">
            <img
              src="/assets/dj-banner.jpeg"
              alt="DJ Profile"
              className="w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* Contenido de texto */}
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Tu DJ Favorito
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                Con más de una década de experiencia en la escena musical, me especializo
                en crear experiencias únicas mezclando diferentes géneros y estilos.
              </p>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                Desde eventos corporativos hasta festivales masivos, cada set es una
                aventura sonora diseñada para hacer vibrar a la audiencia.
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="text-center p-3 bg-purple-900/30 rounded-lg backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">10+</div>
                <div className="text-sm sm:text-base text-gray-300">Años de experiencia</div>
              </div>
              <div className="text-center p-3 bg-purple-900/30 rounded-lg backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">500+</div>
                <div className="text-sm sm:text-base text-gray-300">Eventos</div>
              </div>
              <div className="text-center p-3 bg-purple-900/30 rounded-lg backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">50k+</div>
                <div className="text-sm sm:text-base text-gray-300">Seguidores</div>
              </div>
              <div className="text-center p-3 bg-purple-900/30 rounded-lg backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">1M+</div>
                <div className="text-sm sm:text-base text-gray-300">Reproducciones</div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                Contratar ahora
              </button>
              <button className="px-6 py-3 border-2 border-purple-600 text-purple-400 hover:bg-purple-600/10 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                Ver calendario
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;