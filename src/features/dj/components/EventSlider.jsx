import { useState, useEffect } from "react";

const events = [
  {
    id: 1,
    title: "Sunset Beats Festival",
    subtitle: "Los mejores DJs internacionales",
    date: "15 JUL 2024",
    location: "Playa del Sol",
    image: "/assets/event1.png",
  },
  {
    id: 2,
    title: "BeatLog Night Party",
    subtitle: "Musica electronica en el mejor club",
    date: "20 AGO 2024",
    location: "Club BeatLog",
    image: "/assets/event2.png",
  },
  {
    id: 3,
    title: "Urban Beats Festival",
    subtitle: "Los mejores beats y DJs locales",
    date: "10 SEP 2024",
    location: "Plaza Central",
    image: "/assets/event3.png",
  },
];

const EventSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div className="relative h-[280px] sm:h-[380px] md:h-[480px] lg:h-[560px]">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-10 md:p-16 lg:p-20">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600/80 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
                  {event.date} &mdash; {event.location}
                </span>

                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight">
                  {event.title}
                </h2>

                <p className="text-base sm:text-lg md:text-xl text-gray-300 font-medium max-w-lg">
                  {event.subtitle}
                </p>

                <div className="pt-2">
                  <button className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                    Ver Evento
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 border border-white/20"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 border border-white/20"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-5 left-6 sm:left-10 md:left-16 lg:left-20 flex gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-8 bg-emerald-500"
                  : "w-4 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSlider;
