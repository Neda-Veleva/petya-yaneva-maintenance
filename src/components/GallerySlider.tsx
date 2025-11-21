import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1674049406467-824ea37c7184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9ucyUyMGNsb3NldXB8ZW58MXx8fHwxNzYzMTMzNDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Близък план на удължени мигли',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNoJTIwZXh0ZW5zaW9ucyUyMGFwcGxpY2F0aW9ufGVufDF8fHx8MTc2MzEzNDA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Резултат от ламиниране на мигли',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXAlMjBsYXNoZXN8ZW58MXx8fHwxNzYzMTM0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Удължаване на мигли с обем',
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Класически сет мигли',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1730226995154-efe9e13db300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9ucyUyMHZvbHVtZXxlbnwxfHx8fDE3NjMxMzQwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Процес на боядисване на мигли',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1566321995371-a789682812f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwc29mdHxlbnwxfHx8fDE3NjMxMzM3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Красиви резултати след процедура',
  },
];

export default function GallerySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slidesToShow = 5;
  const maxIndex = galleryImages.length - slidesToShow;

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return maxIndex;
      return prev - 1;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const handleInteraction = () => {
    setIsAutoPlaying(false);
  };

  return (
    <section id="gallery" className="py-24 bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">Галерия</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Надникнете в артистичния ни подход към трансформациите на мигли
          </p>
          <Link
            to="/gallery"
            className="inline-block text-gold-600 hover:text-gold-700 font-medium transition-colors duration-300 border-b-2 border-gold-400 hover:border-gold-600"
          >
            Виж цялата галерия →
          </Link>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 5)}%)`,
              }}
            >
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="w-full md:w-1/5 flex-shrink-0 px-2"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nude-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              handleInteraction();
              prevSlide();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-10"
            aria-label="Предишно изображение"
          >
            <ChevronLeft className="w-6 h-6 text-gold-600" />
          </button>

          <button
            onClick={() => {
              handleInteraction();
              nextSlide();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-10"
            aria-label="Следващо изображение"
          >
            <ChevronRight className="w-6 h-6 text-gold-600" />
          </button>

          <div className="flex items-center justify-center space-x-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  handleInteraction();
                  goToSlide(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gold-500'
                    : 'w-2 bg-nude-300 hover:bg-gold-400'
                }`}
                aria-label={`Към слайд ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
