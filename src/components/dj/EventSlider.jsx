import { useState } from "react";

const events = [
  {
    title: "Sunset Beats Festival",
    date: "2024-07-15",
    image: "/assets/event1.png",
    description: "Un festival inolvidable en la playa con los mejores DJs internacionales.",
  },
  {
    title: "Neon Night Club",
    date: "2024-08-10",
    image: "/assets/event2.png",
    description: "Una noche llena de luces y música electrónica en el club más top.",
  },
  {
    title: "Electro City Parade",
    date: "2024-09-05",
    image: "/assets/event3.png",
    description: "Desfile urbano con sets en vivo y mucha energía.",
  },
];

const EventSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % events.length);
  const prev = () => setCurrent((current - 1 + events.length) % events.length);

  const event = events[current];

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Próximos Eventos</h2>
      <div className="relative bg-gray-900 rounded-xl shadow-lg overflow-hidden h-96 flex items-center justify-center">
        {/* Imagen de fondo con mayor oscurecimiento */}
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover brightness-30"
        />
        {/* Contenido centrado */}
        <div className="relative z-10 text-center px-4">
          <h3 className="text-4xl font-extrabold text-white drop-shadow-lg mb-3">
            {event.title}
          </h3>
          <p className="text-lg text-gray-200 mb-2">{event.date}</p>
          <p className="text-gray-300 max-w-2xl mx-auto">{event.description}</p>
        </div>
        {/* Botones */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-purple-700 hover:bg-purple-900 text-white rounded-full p-3 shadow-lg z-20"
        >
          &#8592;
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-700 hover:bg-purple-900 text-white rounded-full p-3 shadow-lg z-20"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
};

export default EventSlider;
