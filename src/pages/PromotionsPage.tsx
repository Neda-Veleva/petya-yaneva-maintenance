import { useState, useEffect } from 'react';
import { Tag, Calendar, Info, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import MediaRender from '../components/MediaRender';
import { supabase } from '../lib/supabase';

interface Promotion {
  id: string;
  slug: string;
  service_name: string;
  old_price: string;
  new_price: string;
  description: string;
  long_description: string | null;
  terms: string | null;
  image_url: string;
  is_active: boolean;
  order_position: number;
  valid_from: string | null;
  valid_until: string | null;
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

  useEffect(() => {
    if (promotions.length > 0 && window.location.hash) {
      const slug = window.location.hash.substring(1);
      const element = document.getElementById(slug);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [promotions]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MediaRender
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
            <div className="space-y-8">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  id={promotion.slug}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 scroll-mt-24"
                >
                  <div className="grid lg:grid-cols-5 gap-0">
                    <div className="lg:col-span-2 relative h-80 lg:h-auto overflow-hidden">
                      <MediaRender
                        src={promotion.image_url}
                        alt={promotion.service_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white/20 via-transparent to-transparent"></div>

                      <div className="absolute top-6 left-6">
                        <div className="px-5 py-2.5 bg-gold-500/95 backdrop-blur-sm text-white rounded-full text-sm font-bold shadow-gold-glow flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>ПРОМОЦИЯ</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 p-8 lg:p-10 space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-serif text-3xl lg:text-4xl text-charcoal-600 font-bold leading-tight">
                          {promotion.service_name}
                        </h3>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl text-gray-400 line-through font-light">
                              {promotion.old_price}
                            </span>
                            <span className="text-5xl lg:text-6xl font-serif bg-gold-shimmer bg-clip-text text-transparent font-bold">
                              {promotion.new_price}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-gold-500/50 via-gold-500/20 to-transparent"></div>

                      {promotion.valid_from && promotion.valid_until && (
                        <div className="flex items-start gap-3 p-4 bg-nude-50 rounded-xl border border-nude-200">
                          <Calendar className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-charcoal-600 mb-1">Период на валидност</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}
                            </p>
                          </div>
                        </div>
                      )}

                      {promotion.long_description && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-charcoal-600">
                            <Info className="w-5 h-5 text-gold-600" />
                            <h4 className="font-semibold">Описание</h4>
                          </div>
                          <p className="text-gray-600 leading-relaxed pl-7">
                            {promotion.long_description}
                          </p>
                        </div>
                      )}

                      {promotion.terms && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-charcoal-600">
                            <AlertCircle className="w-5 h-5 text-gold-600" />
                            <h4 className="font-semibold">Условия</h4>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed pl-7">
                            {promotion.terms}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
}
