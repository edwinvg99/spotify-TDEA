import { useEffect, useRef } from "react";
import { animate } from "animejs";

const orbs = [
  { size: 600, x: "15%", y: "10%", color: "rgba(16,185,129,0.12)", speed: 0.018 },
  { size: 500, x: "70%", y: "60%", color: "rgba(20,184,166,0.09)", speed: 0.012 },
  { size: 400, x: "50%", y: "30%", color: "rgba(52,211,153,0.10)", speed: 0.022 },
  { size: 300, x: "85%", y: "15%", color: "rgba(6,182,212,0.08)", speed: 0.015 },
  { size: 350, x: "10%", y: "75%", color: "rgba(34,197,94,0.07)", speed: 0.020 },
];

const HomeBackground = () => {
  const containerRef = useRef(null);
  const orbRefs = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // entrada suave de los orbs
    orbRefs.current.forEach((orb, i) => {
      if (!orb) return;
      animate(orb, {
        opacity: [0, 1],
        scale: [0.6, 1],
        duration: 1800,
        delay: i * 200,
        ease: "outExpo",
      });
    });

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      };
    };

    const tick = () => {
      orbRefs.current.forEach((orb, i) => {
        if (!orb) return;
        const { speed } = orbs[i];
        const dx = mousePos.current.x * rect.width * speed * 80;
        const dy = mousePos.current.y * rect.height * speed * 80;
        orb.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    // Guarda rect una sola vez
    const rect = container.getBoundingClientRect();

    container.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          ref={(el) => (orbRefs.current[i] = el)}
          className="absolute rounded-full blur-3xl opacity-0"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            transform: "translate(0, 0)",
            transition: `transform ${0.8 + i * 0.1}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

export default HomeBackground;
