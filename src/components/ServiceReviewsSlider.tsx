import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Review {
  id: string;
  client_name: string;
  rating: number;
  review_text: string;
  review_date: string;
}

interface ServiceReviewsSliderProps {
  reviews: Review[];
}

export default function ServiceReviewsSlider({ reviews }: ServiceReviewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      nextReview();
    }, 8000);

    return () => clearInterval(interval);
  }, [reviews.length, currentIndex]);

  const nextReview = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
      setIsTransitioning(false);
    }, 500);
  };

  const prevReview = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToReview = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-nude-50 via-white to-nude-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500/10 backdrop-blur-md rounded-full border border-gold-500/30 mb-6">
            <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
            <span className="text-sm text-gold-600 font-semibold tracking-wide">Отзиви от клиенти</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-600 mb-4">
            Какво споделят нашите клиенти
          </h2>
          <div className="h-1 w-24 bg-gold-shimmer mx-auto"></div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-8 left-8 text-gold-400/20">
              <Quote className="w-24 h-24" />
            </div>

            <div
              className={`relative z-10 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="flex justify-center mb-6">
                {Array.from({ length: currentReview.rating }).map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-gold-500 fill-gold-500" />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center mb-8 font-light italic">
                "{currentReview.review_text}"
              </p>

              <div className="text-center">
                <p className="font-semibold text-lg text-charcoal-600 mb-1">
                  {currentReview.client_name}
                </p>
                <p className="text-sm text-gray-500">{formatDate(currentReview.review_date)}</p>
              </div>
            </div>

            {reviews.length > 1 && (
              <>
                <button
                  onClick={prevReview}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-charcoal-600 hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextReview}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-charcoal-600 hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToReview(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? 'w-12 bg-gold-500 shadow-gold-glow'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
