import { useEffect, useState } from 'react';

interface ParallaxBackgroundProps {
  image: string;
  opacity?: number;
  speed?: number;
  isDark?: boolean;
}

export default function ParallaxBackground({
  image,
  opacity = 0.15,
  speed = 0.5,
  isDark = true
}: ParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 w-full h-[120%]"
        style={{
          transform: `translateY(${scrollY * speed}px)`,
          willChange: 'transform',
        }}
      >
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity }}
        />
      </div>
      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-gradient-to-b from-charcoal-600/80 via-charcoal-600/60 to-charcoal-600/80'
          : 'bg-gradient-to-b from-white/70 via-white/50 to-white/70'
      }`}></div>
    </div>
  );
}
