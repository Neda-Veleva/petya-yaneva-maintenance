import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  name: string;
  short_description: string;
  price: string;
  image_url: string;
  thumbnail_url: string | null;
  slug: string;
  category_id: string;
}

interface Category {
  id: string;
  slug: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [blockContent, setBlockContent] = useState<{
    title?: string;
    subtitle?: string;
    button_text?: string;
    button_url?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServicesBlock();
  }, []);

  async function loadServicesBlock() {
    try {
      // Намери page_type за "home"
      const { data: pageType } = await supabase
        .from('page_types')
        .select('id')
        .eq('slug', 'home')
        .single();

      if (!pageType) {
        setLoading(false);
        return;
      }

      // Намери блок с тип "services"
      const { data: block } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_type_id', pageType.id)
        .eq('block_type', 'services')
        .eq('is_visible', true)
        .single();

      if (!block || !block.content) {
        setLoading(false);
        return;
      }

      const content = block.content as {
        title?: string;
        subtitle?: string;
        service_ids?: string[];
        button_text?: string;
        button_url?: string;
      };

      setBlockContent({
        title: content.title,
        subtitle: content.subtitle,
        button_text: content.button_text,
        button_url: content.button_url,
      });

      // Зареди избраните услуги
      if (content.service_ids && content.service_ids.length > 0) {
        const { data: servicesData, error } = await supabase
          .from('services')
          .select('id, name, short_description, price, image_url, thumbnail_url, slug, category_id')
          .in('id', content.service_ids);

        if (!error && servicesData) {
          // Зареди категориите за услугите
          const categoryIds = [...new Set(servicesData.map(s => s.category_id))];
          const { data: categoriesData } = await supabase
            .from('service_categories')
            .select('id, slug')
            .in('id', categoryIds);

          if (categoriesData) {
            const categoriesMap: Record<string, Category> = {};
            categoriesData.forEach(cat => {
              categoriesMap[cat.id] = cat;
            });
            setCategories(categoriesMap);

            // Подреди услугите според реда в service_ids
            const orderedServices = content.service_ids
              .map(id => servicesData.find(s => s.id === id))
              .filter((s): s is Service => s !== undefined);
            setServices(orderedServices);
          }
        }
      }
    } catch (error) {
      console.error('Error loading services block:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return null;
  }

  if (services.length === 0) {
    return null;
  }
  const category = services[0] ? categories[services[0].category_id] : null;

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">
            {blockContent.title || 'Нашите услуги'}
          </h2>
          {blockContent.subtitle && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {blockContent.subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => {
            const serviceCategory = categories[service.category_id];
            const serviceLink = serviceCategory 
              ? `/services/${serviceCategory.slug}/${service.slug}`
              : `/services/${service.slug}`;

            return (
              <Link
                key={service.id}
                to={serviceLink}
                className="group bg-nude-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.thumbnail_url || service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nude-500/60 to-transparent"></div>
                </div>

                <div className="p-8 space-y-4">
                  <h3 className="font-serif text-2xl text-gold-600">{service.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.short_description}</p>
                  <div className="flex items-center justify-center pt-4 border-t border-nude-200">
                    <span className="text-3xl font-serif text-gray-900">{service.price}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {blockContent.button_text && (
          <div className="flex justify-center mt-12">
            <Link
              to={blockContent.button_url || '/services'}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-400 to-gold-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>{blockContent.button_text}</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
