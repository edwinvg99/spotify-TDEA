const lineup = [
  { name: "DJ Nova", genre: "Tech House", time: "22:00", headliner: true },
  { name: "Kara Syn", genre: "Drum & Bass", time: "20:30", headliner: false },
  { name: "Maxo",     genre: "Techno",      time: "00:00", headliner: false },
];



const AboutSection = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0d0d1a] to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent" />

      {/* Líneas decorativas */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />

      <div className="relative px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 max-w-7xl mx-auto">

        {/* Badge de evento */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Próximo Evento
          </span>
        </div>

        {/* Título principal */}
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
            NEON{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              OVERDRIVE
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Una noche de sonido inmersivo, luces y energía sin límites.
          </p>
        </div>

        {/* Info del evento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
          {[
            { label: "Fecha", value: "15 · JUN · 2025" },
            { label: "Lugar", value: "Club Nexus, Medellín" },
            { label: "Puertas", value: "20:00 hrs" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                {item.label}
              </p>
              <p className="text-white font-bold text-sm sm:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Lineup */}
        <div className="mb-10">
          <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-4">
            Line-up
          </p>
          <div className="space-y-3 max-w-lg mx-auto">
            {lineup.map((artist) => (
              <div
                key={artist.name}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                  artist.headliner
                    ? "bg-gradient-to-r from-purple-900/40 to-pink-900/20 border-purple-500/50"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {artist.headliner && (
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                      HEADLINER
                    </span>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">
                      {artist.name}
                    </p>
                    <p className="text-gray-500 text-xs">{artist.genre}</p>
                  </div>
                </div>
                <span className="text-purple-400 font-mono text-sm font-semibold">
                  {artist.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/40 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 text-sm sm:text-base">
            Conseguir Entradas
          </button>
          <button className="px-8 py-3.5 rounded-full font-bold text-purple-300 border border-purple-500/40 hover:bg-purple-500/10 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
            Ver Todos los Eventos
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
