import { useState } from 'react';

const events = [
  {
    id: 1,
    title: "Sunset Beats Festival",
    description: "Un festival inolvidable en la playa con los mejores DJs internacionales.",
    date: "2024-07-15",
    location: "Playa del Sol",
    image: "/assets/event1.png"
  },
  {
    id: 2,
    title: "Neon Night Party",
    description: "Una noche de música electrónica en el mejor club de la ciudad.",
    date: "2024-08-20",
    location: "Club Neon",
    image: "/assets/event2.png"
  },
  {
    id: 3,
    title: "Urban Beats Festival",
    description: "Festival urbano con los mejores beats y DJs locales.",
    date: "2024-09-10",
    location: "Plaza Central",
    image: "/assets/event3.png"
  }
];

const EventSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-2xl">
      {/* Container principal */}
      <div className="relative min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
        {/* Imágenes */}
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute w-full h-full transition-all duration-700 ease-in-out transform ${
              index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay con degradado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Contenido del evento */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{event.title}</h3>
              <p className="text-sm sm:text-base md:text-lg mb-2 text-gray-200">{event.description}</p>
              <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                <span className="bg-purple-600 px-3 py-1 rounded-full text-xs sm:text-sm">
                  {event.date}
                </span>
                <span className="text-xs sm:text-sm text-gray-300">
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-r-lg transition-all duration-300"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-l-lg transition-all duration-300"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores de posición */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-purple-600 scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSlider;