import { useState, useEffect } from 'react';
import { Tag, Clock, Sparkles, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface Promotion {
  id: string;
  service_name: string;
  old_price: string;
  new_price: string;
  description: string;
  image_url: string;
  is_active: boolean;
  order_position: number;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPromotions() {
      setLoading(true);
      const { data } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (data) {
        setPromotions(data);
      }
      setLoading(false);
    }

    loadPromotions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=compress&cs=tinysrgb&w=1920"
            alt="Промоции"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/90 via-charcoal-600/85 to-charcoal-600/90"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-8">
            <Tag className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Специални оферти</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Промоции
          </h1>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light">
            Открийте нашите текущи промоционални оферти и се насладете на луксозни услуги на изгодни цени
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600">Зареждане на промоции...</p>
              </div>
            </div>
          ) : promotions.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <Tag className="w-16 h-16 text-gray-400 mx-auto" />
                <h2 className="font-serif text-3xl text-gray-700">Няма активни промоции</h2>
                <p className="text-gray-600">Проверете отново скоро за нови оферти</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={promotion.image_url}
                      alt={promotion.service_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/90 via-charcoal-600/50 to-transparent"></div>

                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-gold-500 text-white rounded-full text-sm font-bold shadow-gold-glow">
                        ПРОМОЦИЯ
                      </div>
                    </div>
                  </div>

                  <div className="relative p-8 space-y-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/5 to-transparent animate-shimmer"></div>

                    <div className="relative space-y-4">
                      <h3 className="font-serif text-3xl text-charcoal-600 font-bold leading-tight">
                        {promotion.service_name}
                      </h3>

                      <p className="text-gray-600 leading-relaxed">
                        {promotion.description}
                      </p>

                      <div className="flex items-center gap-6 pt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl text-gray-400 line-through font-light">
                            {promotion.old_price}
                          </span>
                          <span className="text-5xl font-serif bg-gold-shimmer bg-clip-text text-transparent font-bold">
                            {promotion.new_price}
                          </span>
                        </div>
                      </div>

                      <div className="pt-6">
                        <a
                          href="#booking"
                          className="inline-flex items-center gap-2 px-8 py-4 bg-gold-shimmer text-charcoal-600 rounded-full font-bold transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 group/btn"
                        >
                          <span>Запази час</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
