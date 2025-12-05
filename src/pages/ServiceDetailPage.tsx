import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Clock, Tag, CheckCircle, Sparkles, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceReviewsSlider from '../components/ServiceReviewsSlider';
import MediaRender from '../components/MediaRender';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  short_description: string;
  full_description: string | null;
  duration: string;
  price: string;
  image_url: string;
  gallery_images: string[];
  benefits: string[];
  process_steps: string[];
  aftercare_tips: string[];
  is_featured: boolean;
  order_position: number;
}

interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
}

interface Review {
  id: string;
  client_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  avatar_url?: string;
}

export default function ServiceDetailPage() {
  const { category: categorySlug, serviceSlug } = useParams<{ category: string; serviceSlug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadService() {
      if (!serviceSlug || !categorySlug) return;

      const { data: categoryData, error: categoryError } = await supabase
        .from('service_categories')
        .select('id, slug, name')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (categoryError || !categoryData) {
        console.error('Error fetching category:', categoryError);
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('slug', serviceSlug)
        .eq('category_id', categoryData.id)
        .maybeSingle();

      if (serviceError) {
        console.error('Error fetching service:', serviceError);
        setLoading(false);
        return;
      }

      if (serviceData) {
        setService(serviceData);

        const { data: reviewsData } = await supabase
          .from('service_reviews')
          .select('*')
          .eq('service_id', serviceData.id)
          .order('order_position', { ascending: true });

        if (reviewsData) {
          setReviews(reviewsData);
        }

        const { data: relatedData } = await supabase
          .from('services')
          .select('*')
          .eq('category_id', categoryData.id)
          .neq('id', serviceData.id)
          .limit(3)
          .order('order_position', { ascending: true });

        if (relatedData) {
          setRelatedServices(relatedData);
        }
      }

      setLoading(false);
    }

    loadService();
  }, [serviceSlug, categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl text-gold-500">Услугата не е намерена</h1>
            <Link to="/services" className="inline-block text-gold-600 hover:text-gold-700 underline">
              Обратно към всички услуги
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = [service.image_url, ...service.gallery_images];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MediaRender
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
            videoProps={{ muted: true, loop: true, autoPlay: true }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/90 via-charcoal-600/85 to-charcoal-600/90"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-6">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Премиум услуга</span>
          </div>

          <h1 className="font-serif text-5xl lg:text-6xl bg-gold-shimmer bg-clip-text text-transparent mb-6 leading-none tracking-tight animate-shimmer">
            {service.name}
          </h1>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-6"></div>

          <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light mb-8">
            {service.short_description}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 px-6 py-3 bg-charcoal-400/60 backdrop-blur-md rounded-full border border-gold-500/30">
              <Clock className="w-5 h-5 text-gold-400" />
              <span className="text-white font-medium">{service.duration}</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-charcoal-400/60 backdrop-blur-md rounded-full border border-gold-500/30">
              <Tag className="w-5 h-5 text-gold-400" />
              <span className="text-white font-medium">{service.price}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-nude-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gold-600 transition-colors">
              Начало
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link to="/services" className="text-gray-600 hover:text-gold-600 transition-colors">
              Услуги
            </Link>
            {category && (
              <>
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                <Link to={`/services/${category.slug}`} className="text-gray-600 hover:text-gold-600 transition-colors">
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gold-600 font-medium">{service.name}</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              {service.full_description && (
                <div>
                  <h2 className="font-serif text-3xl text-gray-800 mb-6">За услугата</h2>
                  <div
                    className="rich-content text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-a:text-gold-600"
                    dangerouslySetInnerHTML={{ __html: service.full_description }}
                  />
                </div>
              )}

              {service.benefits && service.benefits.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl text-gray-800 mb-6">Предимства</h2>
                  <div className="space-y-4">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-lg">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.process_steps && service.process_steps.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl text-gray-800 mb-6">Как протича процедурата</h2>
                  <div className="space-y-4">
                    {service.process_steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gold-shimmer rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-600 text-lg pt-1.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.aftercare_tips && service.aftercare_tips.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl text-gray-800 mb-6">Грижа след процедурата</h2>
                  <div className="space-y-4">
                    {service.aftercare_tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-lg">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="relative group">
                <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <MediaRender
                    src={allImages[currentImageIndex]}
                    alt={`${service.name} - изображение ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/30 to-transparent"></div>
                </div>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-charcoal-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-charcoal-400 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-charcoal-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-charcoal-400 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'w-8 bg-gold-500'
                              : 'w-2 bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <div className="text-center border-b border-nude-200 pb-6">
                  <div className="text-5xl font-serif text-gold-500 font-bold mb-2">{service.price}</div>
                  <div className="text-gray-600">{service.duration}</div>
                </div>

                <a
                  href="#contact"
                  className="block w-full px-8 py-4 bg-gold-shimmer text-charcoal-600 rounded-full font-bold text-center transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105"
                >
                  Запази час
                </a>

                <p className="text-sm text-gray-500 text-center">
                  Ще се свържем с вас за потвърждение
                </p>
              </div>
            </div>
          </div>
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
            Запазете своя час днес и открийте магията на професионалната грижа
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="group px-10 py-5 bg-gold-shimmer text-charcoal-600 rounded-full font-semibold transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 flex items-center gap-2"
            >
              <span>Запази час сега</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </a>
            {category && (
              <Link
                to={`/services/${category.slug}`}
                className="px-10 py-5 bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-full font-semibold transition-all duration-300 hover:shadow-gold-glow"
              >
                Други услуги от {category.name}
              </Link>
            )}
          </div>
        </div>
      </section>

      {reviews.length > 0 && <ServiceReviewsSlider reviews={reviews} />}

      {relatedServices.length > 0 && category && (
        <section className="py-24 bg-gradient-to-br from-nude-50 via-white to-nude-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-gold-500 mb-4">
                Свързани услуги
              </h2>
              <p className="text-gray-600 text-lg">
                Открийте други {category.name.toLowerCase()} услуги
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.id}
                  to={`/services/${category.slug}/${relatedService.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={relatedService.image_url}
                      alt={relatedService.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/80 to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-gray-800 mb-3 group-hover:text-gold-600 transition-colors">
                      {relatedService.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedService.short_description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-nude-200">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{relatedService.duration}</span>
                      </div>
                      <div className="font-serif text-2xl text-gold-500 font-semibold">
                        {relatedService.price}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to={`/services/${category.slug}`}
                className="inline-block px-8 py-4 bg-transparent border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white rounded-full font-semibold transition-all duration-300"
              >
                Виж всички {category.name.toLowerCase()}
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
