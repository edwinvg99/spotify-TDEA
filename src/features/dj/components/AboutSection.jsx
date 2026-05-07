import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

const upcomingEvents = [
  {
    name: "Neon Pulse",
    genre: "Techno · House",
    date: "14 JUN 2025",
    city: "Medellín",
    featured: true,
  },
  {
    name: "Urban Vibez",
    genre: "Hip-Hop · Trap",
    date: "21 JUN 2025",
    city: "Bogotá",
    featured: false,
  },
  {
    name: "Sunset Sessions",
    genre: "Afrobeats · R&B",
    date: "28 JUN 2025",
    city: "Cali",
    featured: false,
  },
];

const stats = [
  { label: "Eventos activos", value: "120+" },
  { label: "Artistas", value: "300+" },
  { label: "Ciudades", value: "18" },
];

const AboutSection = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const eventsRef = useRef(null);

  useEffect(() => {
    animate(badgeRef.current, {
      opacity: [0, 1],
      translateY: ["-12px", "0px"],
      duration: 600,
      ease: "outExpo",
    });

    const chars = titleRef.current?.querySelectorAll(".char");
    if (chars?.length) {
      animate(chars, {
        opacity: [0, 1],
        translateY: ["60px", "0px"],
        rotateZ: ["4deg", "0deg"],
        duration: 700,
        delay: stagger(40, { start: 200 }),
        ease: "outExpo",
      });
    }

    animate(subtitleRef.current, {
      opacity: [0, 1],
      translateY: ["20px", "0px"],
      duration: 700,
      delay: 600,
      ease: "outExpo",
    });

    animate(statsRef.current?.querySelectorAll(".stat-item") ?? [], {
      opacity: [0, 1],
      translateY: ["16px", "0px"],
      duration: 500,
      delay: stagger(100, { start: 750 }),
      ease: "outExpo",
    });

    animate(ctaRef.current, {
      opacity: [0, 1],
      translateY: ["16px", "0px"],
      duration: 500,
      delay: 1050,
      ease: "outExpo",
    });

    animate(eventsRef.current?.querySelectorAll(".event-item") ?? [], {
      opacity: [0, 1],
      translateX: ["30px", "0px"],
      duration: 500,
      delay: stagger(100, { start: 400 }),
      ease: "outExpo",
    });
  }, []);

  const beatlogChars = "BeatLog".split("").map((c, i) => (
    <span key={i} className="char inline-block" style={{ opacity: 0 }}>
      {c}
    </span>
  ));

  const taglineChars = "EVENTS".split("").map((c, i) => (
    <span key={i} className="char inline-block text-purple-400" style={{ opacity: 0 }}>
      {c}
    </span>
  ));

  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-14">
        {/* Columna izquierda */}
        <div className="flex-1 space-y-5">
          <div ref={badgeRef} className="flex items-center gap-2" style={{ opacity: 0 }}>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-300 text-xs sm:text-sm font-semibold tracking-widest uppercase">
              La plataforma de eventos musicales
            </span>
          </div>

          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight pb-1"
          >
            <span className="inline">{beatlogChars}</span>{" "}
            <span className="inline">
              {taglineChars}
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-gray-400 text-base sm:text-lg max-w-md"
            style={{ opacity: 0 }}
          >
            Conectamos artistas, DJs y organizadores con el público. Descubre
            los mejores eventos de música electrónica, urbana y más, en toda
            Colombia.
          </p>

          {/* Estadísticas de plataforma */}
          <div ref={statsRef} className="flex flex-wrap gap-6 text-sm pt-1">
            {stats.map((s) => (
              <div key={s.label} className="stat-item" style={{ opacity: 0 }}>
                <p className="text-2xl sm:text-3xl font-black text-white leading-none">
                  {s.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div
            ref={ctaRef}
            className="flex flex-wrap gap-3 pt-2"
            style={{ opacity: 0 }}
          >
            <button className="px-7 py-3 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/40 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
              Explorar Eventos
            </button>
            <button className="px-7 py-3 rounded-full font-bold text-purple-300 border border-purple-500/40 hover:bg-purple-500/10 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
              Publicar mi Evento
            </button>
          </div>
        </div>

        {/* Columna derecha — Próximos Eventos */}
        <div ref={eventsRef} className="md:w-80 lg:w-96 space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Próximos Eventos
          </p>
          {upcomingEvents.map((event) => (
            <div
              key={event.name}
              className={`event-item flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                event.featured
                  ? "bg-gradient-to-r from-purple-900/40 to-pink-900/20 border-purple-500/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                {event.featured && (
                  <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                    DESTACADO
                  </span>
                )}
                <div>
                  <p className="text-white font-bold text-sm sm:text-base">
                    {event.name}
                  </p>
                  <p className="text-gray-500 text-xs">{event.genre}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-purple-400 font-mono text-xs font-semibold">
                  {event.date}
                </p>
                <p className="text-gray-600 text-xs">{event.city}</p>
              </div>
            </div>
          ))}

          <button className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold text-gray-400 border border-white/5 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-300">
            Ver todos los eventos →
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
