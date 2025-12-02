import { useState, useEffect } from 'react';
import { DollarSign, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Service {
  id: string;
  title: string;
  price: number;
  duration: string;
  category_id: string;
}

export default function PricingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [categoriesRes, servicesRes] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('services').select('*').eq('is_active', true).order('title'),
    ]);

    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
      if (categoriesRes.data.length > 0) {
        setSelectedCategory(categoriesRes.data[0].id);
      }
    }

    if (servicesRes.data) {
      setServices(servicesRes.data);
    }

    setLoading(false);
  }

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category_id === selectedCategory)
    : services;

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
            <DollarSign className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Ценоразпис</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Нашите Цени
          </h1>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Прозрачни цени за високо качествени услуги
          </p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                    : 'bg-charcoal-500 text-gray-300 hover:bg-charcoal-400 border border-gold-500/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center group-hover:bg-gold-500/20 transition-colors duration-300">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>

                  <div className="relative">
                    <h3 className="font-serif text-2xl text-white mb-4 leading-tight">
                      {service.title}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-gold-400">{service.price}</span>
                      <span className="text-gray-400 text-lg">лв</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="text-center py-20">
              <DollarSign className="w-16 h-16 text-gold-500/30 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Няма услуги в тази категория</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-12 border border-gold-500/20 shadow-2xl">
            <h2 className="font-serif text-3xl text-white mb-4">
              Готови за вашата трансформация?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Запазете час и открийте магията на перфектните мигли и вежди
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
