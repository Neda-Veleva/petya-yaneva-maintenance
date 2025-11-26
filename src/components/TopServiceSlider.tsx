import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';

interface TopService {
  id: string;
  name: string;
  description: string;
  price: string | null;
  image_url: string;
  cta_text: string;
  order_position: number;
}

interface IntroSlide {
  title: string;
  description: string | null;
  image_url: string | null;
}

interface TopServiceSliderProps {
  introSlide: IntroSlide;
  topServices: TopService[];
}

export default function TopServiceSlider({ introSlide, topServices }: TopServiceSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSlides = 1 + topServices.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsTransitioning(false);
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const isIntroSlide = currentSlide === 0;
  const currentService = !isIntroSlide ? topServices[currentSlide - 1] : null;

  const currentImage = isIntroSlide
    ? (introSlide.image_url || 'https://images.pexels.com/photos/5177992/pexels-photo-5177992.jpeg?auto=compress&cs=tinysrgb&w=1920')
    : currentService?.image_url;

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
            isTransitioning ? 'opacity-0 scale-110' : 'opacity-30 scale-100'
          }`}
        >
          <img
            src={currentImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-500/60 via-charcoal-600/50 to-black/70"></div>
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gold-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-32 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-32 h-px bg-gradient-to-l from-transparent via-gold-500/50 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-6 space-y-8 max-w-5xl mx-auto py-12">
        <div className="flex justify-center">
          <div
            className={`relative transition-all duration-700 ${
              isTransitioning ? 'scale-0 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'
            }`}
          >
            <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-2xl animate-pulse"></div>
            {isIntroSlide ? (
              <Sparkles className="relative w-16 h-16 text-gold-400 animate-pulse" />
            ) : (
              <Tag className="relative w-16 h-16 text-gold-400 animate-pulse" />
            )}
          </div>
        </div>

        <div
          className={`space-y-6 transition-all duration-[1000ms] ${
            isTransitioning
              ? 'opacity-0 translate-y-10 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          {isIntroSlide ? (
            <>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight">
                <span className="block bg-gold-shimmer bg-clip-text text-transparent animate-shimmer">
                  {introSlide.title}
                </span>
              </h1>

              <div className="flex justify-center">
                <div className="h-px w-24 bg-gold-shimmer animate-shimmer"></div>
              </div>

              {introSlide.description && (
                <p className="text-lg md:text-xl text-gray-200 font-light tracking-wide max-w-2xl mx-auto">
                  {introSlide.description}
                </p>
              )}
            </>
          ) : currentService && (
            <>
              <div className="inline-flex items-center px-4 py-2 bg-gold-500/20 rounded-full border border-gold-400/50">
                <span className="text-sm font-semibold text-gold-300 tracking-wide uppercase">Топ услуга</span>
              </div>

              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                <span className="block bg-gold-shimmer bg-clip-text text-transparent animate-shimmer">
                  {currentService.name}
                </span>
              </h2>

              <div className="flex justify-center">
                <div className="h-px w-24 bg-gold-shimmer animate-shimmer"></div>
              </div>

              {currentService.description && (
                <p className="text-lg md:text-xl text-gray-200 font-light tracking-wide max-w-2xl mx-auto">
                  {currentService.description}
                </p>
              )}

              {currentService.price && (
                <div className="pt-2">
                  <span className="text-4xl md:text-5xl font-serif bg-gold-shimmer bg-clip-text text-transparent font-bold">
                    {currentService.price}
                  </span>
                </div>
              )}

              <div className="pt-6">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold-shimmer text-charcoal-600 rounded-full font-bold transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 group"
                >
                  <span>{currentService.cta_text}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </>
          )}
        </div>

        {totalSlides > 1 && (
          <div className="flex justify-center gap-3 pt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
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
        )}
      </div>

      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold-500/40"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold-500/40"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold-500/40"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold-500/40"></div>
    </section>
  );
}
