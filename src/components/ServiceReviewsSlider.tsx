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

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      nextReview();
    }, 8000);

    return () => clearInterval(interval);
  }, [reviews.length, currentIndex]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
  };

  if (reviews.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const visibleReviews = reviews.length >= 3
    ? [
        reviews[currentIndex],
        reviews[(currentIndex + 1) % reviews.length],
        reviews[(currentIndex + 2) % reviews.length],
      ]
    : reviews.length === 2
    ? [reviews[currentIndex], reviews[(currentIndex + 1) % reviews.length]]
    : [reviews[0]];

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-6">Отзиви от клиенти</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 fill-gold-500 text-gold-500" />
            <span className="text-3xl font-serif text-gold-600">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-gray-700 text-lg">
            Базирано на <span className="font-semibold text-gold-600">{reviews.length} {reviews.length === 1 ? 'отзив' : 'отзива'}</span>
          </p>
        </div>

        <div className="relative">
          <div className={`grid ${reviews.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : reviews.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
            {visibleReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="bg-gradient-to-br from-nude-50 via-white to-nude-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-white font-serif text-xl">
                      {review.client_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-gray-900">{review.client_name}</h3>
                      <p className="text-xs text-gray-500">{formatDate(review.review_date)}</p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-gold-400/30" />
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-charcoal-600 hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextReview}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-charcoal-600 hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {reviews.length > 3 && (
          <div className="flex justify-center gap-3 mt-12">
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
    </section>
  );
}
