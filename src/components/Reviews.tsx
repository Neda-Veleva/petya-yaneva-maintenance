import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  client_name: string;
  avatar_url?: string;
  rating: number;
  review_text: string;
  review_date: string;
  services?: {
    name: string;
  };
}

interface ReviewsBlockContent {
  title?: string;
  subtitle?: string;
  stats?: Array<{ label: string; value: string }>;
  reviews_count?: number;
  button_text?: string;
  button_url?: string;
  final_rating_text?: string;
  final_opinion_text?: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blockContent, setBlockContent] = useState<ReviewsBlockContent>({
    title: 'Отзиви от клиенти',
    subtitle: 'Вижте какво споделят нашите клиенти за техния опит с нас',
    stats: [
      { label: 'Доволни клиенти', value: '500+' },
      { label: 'Среден рейтинг', value: '5.0' },
      { label: 'Положителни отзиви', value: '98%' },
      { label: 'Години опит', value: '5+' }
    ],
    reviews_count: 6,
    button_text: 'Виж всички',
    button_url: '/reviews',
    final_rating_text: 'Базирано на 500+ отзива',
    final_opinion_text: 'Вашето мнение е важно за нас! Споделете вашия опит и помогнете на други клиенти да направят избор.'
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load block content from page_blocks
      const { data: pageTypeData } = await supabase
        .from('page_types')
        .select('id')
        .eq('slug', 'home')
        .single();

      let reviewsCount = 6;
      
      if (pageTypeData) {
        const { data: blockData } = await supabase
          .from('page_blocks')
          .select('content')
          .eq('page_type_id', pageTypeData.id)
          .eq('block_key', 'reviews')
          .eq('is_visible', true)
          .single();

        if (blockData?.content) {
          const loadedContent = blockData.content as ReviewsBlockContent;
          setBlockContent(loadedContent);
          reviewsCount = loadedContent.reviews_count || 6;
        }
      }

      // Load reviews
      const { data: reviewsData } = await supabase
        .from('service_reviews')
        .select('*, services(name)')
        .order('review_date', { ascending: false })
        .limit(reviewsCount);

      if (reviewsData) {
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(reviews.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentReviews = () => {
    const start = currentSlide * itemsPerSlide;
    return reviews.slice(start, start + itemsPerSlide);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-6">
            {blockContent.title || 'Отзиви от клиенти'}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {blockContent.subtitle || 'Вижте какво споделят нашите клиенти за техния опит с нас'}
          </p>
        </div>

        {blockContent.stats && blockContent.stats.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {blockContent.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-nude-50 to-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl font-serif text-gold-500 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {reviews.length > 0 ? (
          <>
            <div className="relative mb-12">
              <div className="grid md:grid-cols-3 gap-8">
                {getCurrentReviews().map((review) => (
                  <div
                    key={review.id}
                    className="bg-gradient-to-br from-nude-50 via-white to-nude-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        {review.avatar_url ? (
                          <img
                            src={review.avatar_url}
                            alt={review.client_name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-semibold border-2 border-gold-400">
                            {review.client_name.charAt(0).toUpperCase()}
                          </div>
                        )}
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

                    <p className="text-gray-700 leading-relaxed mb-4">{review.review_text}</p>

                    {review.services && (
                      <div className="pt-4 border-t border-nude-200">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-gold-600 bg-gold-50 rounded-full">
                          {review.services.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-charcoal-600 hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-charcoal-600 hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {totalSlides > 1 && (
              <div className="flex justify-center gap-3 mb-12">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? 'w-12 bg-gold-500 shadow-gold-glow'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}

            {blockContent.button_text && blockContent.button_url && (
              <div className="text-center mb-16">
                <Link
                  to={blockContent.button_url}
                  className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {blockContent.button_text}
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Все още няма отзиви</p>
          </div>
        )}

        <div className="mt-16 text-center bg-gradient-to-r from-gold-50 via-nude-50 to-gold-50 rounded-3xl p-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 fill-gold-500 text-gold-500" />
              <span className="text-5xl font-serif text-gold-600">{calculateAverageRating()}</span>
            </div>
            {blockContent.final_rating_text && (
              <p className="text-gray-700 text-lg mb-4">
                {blockContent.final_rating_text}
              </p>
            )}
            {blockContent.final_opinion_text && (
              <p className="text-gray-600">
                {blockContent.final_opinion_text}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
