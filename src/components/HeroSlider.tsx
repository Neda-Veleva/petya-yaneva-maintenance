import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';

interface FeaturedService {
  name: string;
  price: string;
  image: string;
  description: string;
  badge?: {
    icon: LucideIcon;
    text: string;
  };
  title?: string;
  subtitle?: string;
  heroText?: string;
}

interface HeroSliderProps {
  featuredServices: FeaturedService[];
  title?: string;
  subtitle?: string;
  badge?: {
    icon: LucideIcon;
    text: string;
  };
  heroText?: string;
}

export default function HeroSlider({ featuredServices, title, subtitle, badge, heroText }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentService = featuredServices[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredServices.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredServices.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredServices.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredServices.length);
  };

  const displayBadge = currentService.badge || badge;
  const displayTitle = currentService.title || title;
  const displaySubtitle = currentService.subtitle || subtitle;
  const displayHeroText = currentService.heroText || heroText;

  return (
    <div className="relative w-full h-full">
      {featuredServices.map((service, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/90 via-charcoal-600/80 to-charcoal-600/90"></div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-charcoal-600/80 hover:bg-charcoal-600 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gold-500/30"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gold-400" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-charcoal-600/80 hover:bg-charcoal-600 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gold-500/30"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gold-400" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {featuredServices.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gold-400 w-8'
                : 'bg-gold-400/40 hover:bg-gold-400/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center w-full">
          {displayBadge && (
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-8 transition-all duration-500">
              <displayBadge.icon className="w-4 h-4 text-gold-400 animate-pulse" />
              <span className="text-sm text-gold-400 font-medium tracking-wide">{displayBadge.text}</span>
            </div>
          )}

          {displayTitle && (
            <h1 className="font-serif text-6xl lg:text-7xl text-white mb-6 leading-none tracking-tight transition-all duration-500">
              {displayTitle}
            </h1>
          )}

          {displaySubtitle && (
            <h2 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer transition-all duration-500">
              {displaySubtitle}
            </h2>
          )}

          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          {displayHeroText && (
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light mb-12 transition-all duration-500">
              {displayHeroText}
            </p>
          )}

          <div className="bg-charcoal-600/70 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto border border-gold-500/20 transition-all duration-500">
            <h3 className="font-serif text-3xl lg:text-4xl text-white mb-3 leading-tight">
              {currentService.name}
            </h3>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {currentService.description}
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl font-serif text-gold-400 font-semibold">
                {currentService.price}
              </span>
              <a
                href="#contact"
                className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Запази час
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
