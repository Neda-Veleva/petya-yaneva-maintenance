import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Review {
  id: string;
  client_name: string;
  avatar_url: string | null;
  review_text: string;
  rating: number;
  review_date: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const { data } = await supabase
      .from('service_reviews')
      .select('*')
      .order('review_date', { ascending: false });

    if (data) {
      setReviews(data);
    }

    setLoading(false);
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-gold-400 fill-gold-400' : 'text-gray-600'
        }`}
      />
    ));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600">
      <Header />

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(212,175,55,0.05),transparent_50%)]"></div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-8">
            <Star className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Отзиви</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Какво Казват Клиентите
          </h1>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Вашето доверие е нашата най-голяма награда
          </p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="group relative bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-6 right-6 w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    <Quote className="w-8 h-8 text-gold-400" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      {review.avatar_url ? (
                        <img
                          src={review.avatar_url}
                          alt={review.client_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/30"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center border-2 border-gold-500/30">
                          <span className="text-2xl font-bold text-gold-400">
                            {review.client_name.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {review.client_name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">{renderStars(review.rating)}</div>

                    <p className="text-gray-300 leading-relaxed text-sm line-clamp-6">
                      {review.review_text}
                    </p>

                    <div className="mt-6 pt-6 border-t border-gold-500/10">
                      <p className="text-xs text-gray-500">
                        {new Date(review.review_date).toLocaleDateString('bg-BG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-20">
              <Star className="w-16 h-16 text-gold-500/30 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Все още няма отзиви</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-12 border border-gold-500/20 shadow-2xl">
            <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-gold-400" />
            </div>
            <h2 className="font-serif text-3xl text-white mb-4">
              Станете част от семейството ни
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Присъединете се към стотиците доволни клиенти
            </p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Запази час сега
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
