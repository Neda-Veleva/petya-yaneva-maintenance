import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParallaxBackground from '../components/ParallaxBackground';

interface SalonInfo {
  id: string;
  slug: string;
  title: string;
  title_gold?: string;
  badge: string;
  description: string;
  bio: string;
  image_url: string;
  stat_value: string;
  stat_label: string;
  location?: string;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  image_url: string;
}

export default function SalonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [salon, setSalon] = useState<SalonInfo | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalon();
  }, [slug]);

  async function loadSalon() {
    const { data: salonData } = await supabase
      .from('salon_info')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (salonData) {
      setSalon(salonData);

      const { data: certsData } = await supabase
        .from('salon_certificates')
        .select('*')
        .eq('salon_id', salonData.id)
        .order('display_order');

      if (certsData) {
        setCertificates(certsData);
      }
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-charcoal-600">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-white mb-4">Салон не е намерен</h1>
            <a href="/" className="text-gold-400 hover:text-gold-500">
              Към началната страница
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600">
      <Header />

      <ParallaxBackground />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(212,175,55,0.05),transparent_50%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold-500/20">
                <img
                  src={salon.image_url}
                  alt={salon.title}
                  className="w-full h-[600px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow">
                <Award className="w-4 h-4 text-gold-400 animate-pulse" />
                <span className="text-sm text-gold-400 font-medium tracking-wide">
                  {salon.badge}
                </span>
              </div>

              <h1 className="font-serif text-5xl lg:text-6xl text-white leading-tight">
                {salon.title}
                {salon.title_gold && (
                  <span className="block text-gold-400 mt-2">{salon.title_gold}</span>
                )}
              </h1>

              <div className="h-1 w-24 bg-gold-shimmer animate-shimmer"></div>

              <p className="text-xl text-gray-300 leading-relaxed">{salon.description}</p>

              {salon.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-5 h-5 text-gold-400" />
                  <span>{salon.location}</span>
                </div>
              )}

              <div className="bg-charcoal-400/30 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/10">
                <div className="text-center">
                  <div className="font-serif text-4xl text-gold-400 mb-2">
                    {salon.stat_value}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    {salon.stat_label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-12 border border-gold-500/20 shadow-2xl">
            <h2 className="font-serif text-3xl text-gold-400 mb-8 text-center">За нас</h2>
            <div className="h-px w-32 bg-gold-400 mx-auto mb-8"></div>
            <div
              className="rich-content prose prose-invert prose-gold max-w-none text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: salon.bio }}
            />
          </div>
        </div>
      </section>

      {certificates.length > 0 && (
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-white mb-4">Сертификати и отличия</h2>
              <div className="h-px w-32 bg-gold-400 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gold-500/10"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600 via-charcoal-600/50 to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-white mb-2">{cert.title}</h3>
                    <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
                    <p className="text-sm text-gold-400">{cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
