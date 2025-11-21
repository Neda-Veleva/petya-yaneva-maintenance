import { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, Tag, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1674049406467-824ea37c7184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9ucyUyMGNsb3NldXB8ZW58MXx8fHwxNzYzMTMzNDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Красотата е в',
    titleGold: 'детайлите',
    subtitle: 'Открийте света на луксозната грижа за мигли',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxleWVsYXNoJTIwZXh0ZW5zaW9uc3xlbnwxfHx8fDE3NjMxMzM0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Специална',
    titleGold: 'промоция',
    subtitle: 'Класически екстеншъни',
    promotion: {
      oldPrice: '80лв',
      newPrice: '60лв',
    },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583001308122-223faf90e14a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxleWVsYXNoJTIwZXh0ZW5zaW9uc3xlbnwxfHx8fDE3NjMxMzM0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Удължаване на мигли',
    titleGold: 'очна линия',
    subtitle: 'Дефинирайте погледа си с елегантност',
    service: true,
  },
];

export default function IntroHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images with crossfade */}
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
              index === currentSlide
                ? 'opacity-40 scale-100'
                : 'opacity-0 scale-110'
            }`}
          >
            <img
              src={s.image}
              alt="Luxury lashes"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-500/80 via-charcoal-600/70 to-black/90"></div>
      </div>

      {/* Animated background gradient lights */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gold-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Decorative gold lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-32 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-32 h-px bg-gradient-to-l from-transparent via-gold-500/50 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className={`relative transition-all duration-700 ${
              isTransitioning ? 'scale-0 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'
            }`}
          >
            <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-2xl animate-pulse"></div>
            {slide.promotion ? (
              <Tag className="relative w-12 h-12 text-gold-400 animate-pulse" />
            ) : (
              <Sparkles className="relative w-12 h-12 text-gold-400 animate-pulse" />
            )}
          </div>
        </div>

        {/* Main headline with sexy slide animation */}
        <div
          className={`space-y-4 transition-all duration-[1000ms] ${
            isTransitioning
              ? 'opacity-0 translate-y-10 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight">
            {slide.title}
            <span className="block mt-2 bg-gold-shimmer bg-clip-text text-transparent animate-shimmer">
              {slide.titleGold}
            </span>
          </h1>

          <div className="flex justify-center">
            <div className="h-px w-24 bg-gold-shimmer animate-shimmer"></div>
          </div>

          <p className="text-lg md:text-xl text-gray-200 font-light tracking-wide max-w-2xl mx-auto">
            {slide.subtitle}
          </p>
        </div>

        {/* Content: Promotion or CTA */}
        <div
          className={`pt-10 transition-all duration-[1000ms] delay-200 ${
            isTransitioning
              ? 'opacity-0 translate-y-10'
              : 'opacity-100 translate-y-0'
          }`}
        >
          {slide.promotion ? (
            <div className="inline-block">
              <div className="relative bg-charcoal-400/60 backdrop-blur-xl border-2 border-gold-500/40 rounded-2xl px-8 py-6 shadow-gold-glow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent animate-shimmer"></div>

                <div className="relative flex items-center gap-6">
                  <span className="text-2xl text-gray-400 line-through font-light">
                    {slide.promotion.oldPrice}
                  </span>
                  <span className="text-5xl md:text-6xl font-serif bg-gold-shimmer bg-clip-text text-transparent font-bold">
                    {slide.promotion.newPrice}
                  </span>
                </div>
              </div>

              <a
                href="#services"
                className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-full font-semibold transition-all duration-300 hover:shadow-gold-glow group"
              >
                <span>Виж повече</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ) : slide.service ? (
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-full font-semibold transition-all duration-300 hover:shadow-gold-glow group"
            >
              <span>Виж повече</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          ) : null}
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-3 pt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setIsTransitioning(false);
                }, 800);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? 'w-12 bg-gold-shimmer shadow-gold-glow'
                  : 'w-6 bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#main-hero" className="flex flex-col items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold-500/40"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold-500/40"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold-500/40"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold-500/40"></div>
    </section>
  );
}
