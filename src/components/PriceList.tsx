import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  duration: string;
  price: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  services: Service[];
}

export default function PriceList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('id, slug, name')
        .order('order_position', { ascending: true });

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        setLoading(false);
        return;
      }

      if (categoriesData && categoriesData.length > 0) {
        const categoriesWithServices = await Promise.all(
          categoriesData.map(async (category) => {
            const { data: servicesData } = await supabase
              .from('services')
              .select('id, category_id, slug, name, duration, price')
              .eq('category_id', category.id)
              .order('order_position', { ascending: true });

            return {
              ...category,
              services: servicesData || []
            };
          })
        );

        setCategories(categoriesWithServices);
        setActiveCategory(categoriesWithServices[0]?.id || '');
      }

      setLoading(false);
    }

    loadCategories();
  }, []);

  const currentCategory = categories.find(cat => cat.id === activeCategory);

  const services = currentCategory?.services || [];
  const shouldSplit = services.length > 6;
  const midPoint = Math.ceil(services.length / 2);
  const leftServices = shouldSplit ? services.slice(0, midPoint) : services;
  const rightServices = shouldSplit ? services.slice(midPoint) : [];

  if (loading) {
    return (
      <section id="prices" className="py-24 bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="prices" className="py-24 bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-6">Ценоразпис</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Прозрачни цени за премиум услуги за мигли и красота
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-2 shadow-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gold-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid ${shouldSplit ? 'md:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'} gap-8`}>
          <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
            <div className="space-y-5">
              {leftServices.map((service, index) => (
                <div
                  key={service.id}
                  className="group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <Link to={`/services/${currentCategory?.slug}/${service.slug}`}>
                        <h3 className="font-serif text-xl md:text-2xl text-gray-800 mb-2 group-hover:text-gold-600 transition-colors duration-300 cursor-pointer">
                          {service.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-4">
                      <div className="hidden md:block flex-1 border-b-2 border-dotted border-gold-300 min-w-[60px]"></div>
                      <span className="font-serif text-2xl md:text-3xl text-gold-500 font-semibold whitespace-nowrap">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {index < leftServices.length - 1 && (
                    <div className="mt-5 border-b border-nude-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {shouldSplit && rightServices.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
              <div className="space-y-5">
                {rightServices.map((service, index) => (
                  <div
                    key={service.id}
                    className="group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <Link to={`/services/${currentCategory?.slug}/${service.slug}`}>
                          <h3 className="font-serif text-xl md:text-2xl text-gray-800 mb-2 group-hover:text-gold-600 transition-colors duration-300 cursor-pointer">
                            {service.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500">{service.duration}</p>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-4">
                        <div className="hidden md:block flex-1 border-b-2 border-dotted border-gold-300 min-w-[60px]"></div>
                        <span className="font-serif text-2xl md:text-3xl text-gold-500 font-semibold whitespace-nowrap">
                          {service.price}
                        </span>
                      </div>
                    </div>

                    {index < rightServices.length - 1 && (
                      <div className="mt-5 border-b border-nude-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm italic">
            Всички процедури включват безплатна консултация и съвети за поддръжка
          </p>
        </div>
      </div>
    </section>
  );
}
