import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Sparkles, Crown, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface DbService {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  duration: string;
  price: string;
  image_url: string;
}

interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  icon: any;
  services: DbService[];
}

const categoryIcons: { [key: string]: any } = {
  lashes: Eye,
  brows: Crown,
  facial: Heart,
};

export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('id, slug, name')
        .order('order_position', { ascending: true });

      if (categoriesError || !categoriesData) {
        console.error('Error loading categories:', categoriesError);
        setLoading(false);
        return;
      }

      const categoriesWithServices = await Promise.all(
        categoriesData.map(async (category) => {
          const { data: servicesData } = await supabase
            .from('services')
            .select('id, slug, name, short_description, duration, price, image_url')
            .eq('category_id', category.id)
            .order('order_position', { ascending: true });

          return {
            ...category,
            icon: categoryIcons[category.slug] || Eye,
            services: servicesData || [],
          };
        })
      );

      setCategories(categoriesWithServices);
      setLoading(false);
    }

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Зареждане на услуги...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=compress&cs=tinysrgb&w=1920"
            alt="Beauty services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/90 via-charcoal-600/80 to-charcoal-600/90"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-8">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Премиум Beauty Studio</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl text-white mb-6 leading-none tracking-tight">
            Нашите
          </h1>
          <h2 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Услуги
          </h2>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Открийте нашата пълна селекция от специализирани услуги за мигли, вежди и лице.
            Всяка процедура е изпълнена с внимание към детайла и използване на премиум продукти.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {categories.map((category, categoryIndex) => (
            <div key={category.id} className={categoryIndex > 0 ? 'mt-32' : ''}>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-shimmer rounded-full mb-6 shadow-gold-glow">
                  <category.icon className="w-10 h-10 text-charcoal-600" />
                </div>
                <h2 className="font-serif text-5xl text-gold-500 mb-4">{category.name}</h2>
                <div className="h-1 w-24 bg-gold-shimmer mx-auto"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.services.map((service) => (
                  <Link
                    key={service.id}
                    to={`/service/${service.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-serif text-xl text-white mb-1">{service.name}</h3>
                        <p className="text-sm text-gold-300">{service.duration}</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-gray-600 leading-relaxed text-sm">{service.short_description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-nude-200">
                        <span className="text-2xl font-serif text-gold-500 font-semibold">{service.price}</span>
                        <span className="px-4 py-2 bg-gold-500 group-hover:bg-gold-600 text-white rounded-full text-sm font-medium transition-all duration-300">
                          Виж повече
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-dark-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
            Готови за промяна?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Запазете своя час днес и открийте магията на професионалната грижа за мигли
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="group px-10 py-5 bg-gold-shimmer text-charcoal-600 rounded-full font-semibold transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 flex items-center gap-2"
            >
              <span>Запази час сега</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </a>
            <a
              href="/"
              className="px-10 py-5 bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-full font-semibold transition-all duration-300 hover:shadow-gold-glow"
            >
              Към началото
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
