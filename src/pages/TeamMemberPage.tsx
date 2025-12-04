import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Calendar, MapPin, Sparkles, Home, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';
import PriceList from '../components/PriceList';

interface TeamMember {
  id: string;
  slug: string;
  type: 'person' | 'salon';
  first_name?: string;
  last_name?: string;
  title?: string;
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

interface GalleryImage {
  id: string;
  image_url: string;
  caption?: string;
}

export default function TeamMemberPage() {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemberData() {
      if (!slug) return;

      const { data: memberData } = await supabase
        .from('team_members')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (memberData) {
        setMember(memberData);

        const { data: certsData } = await supabase
          .from('team_member_certificates')
          .select('*')
          .eq('team_member_id', memberData.id)
          .order('display_order', { ascending: true });

        if (certsData) {
          setCertificates(certsData);
        }

        if (memberData.type === 'person') {
          const { data: galleryData } = await supabase
            .from('team_member_gallery')
            .select('*')
            .eq('team_member_id', memberData.id)
            .order('display_order', { ascending: true });

          if (galleryData) {
            setGallery(galleryData);
          }
        }
      }

      setLoading(false);
    }

    loadMemberData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <Header />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-40 text-center">
          <h1 className="font-serif text-4xl text-gray-900 mb-6">Страницата не е намерена</h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-colors duration-300"
          >
            <Home className="w-4 h-4" />
            Към началото
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = member.type === 'person'
    ? `${member.first_name} ${member.last_name}`
    : `${member.title} ${member.title_gold}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-300 rounded-full font-medium text-sm mb-6 backdrop-blur-sm border border-gold-500/30">
                {member.badge}
              </span>

              {member.type === 'person' ? (
                <>
                  <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">
                    {member.first_name}
                  </h1>
                  <h2 className="font-serif text-5xl md:text-6xl bg-gold-shimmer bg-clip-text text-transparent mb-6 animate-shimmer">
                    {member.last_name}
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">
                    {member.title}
                  </h1>
                  <h2 className="font-serif text-5xl md:text-6xl bg-gold-shimmer bg-clip-text text-transparent mb-6 animate-shimmer">
                    {member.title_gold}
                  </h2>
                </>
              )}

              <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mb-6"></div>

              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {member.description}
              </p>

              <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                {member.type === 'salon' && member.location ? (
                  <MapPin className="w-8 h-8 text-gold-400" />
                ) : (
                  <Sparkles className="w-8 h-8 text-gold-400" />
                )}
                <div>
                  <p className="text-4xl font-serif font-bold text-gold-400">{member.stat_value}</p>
                  <p className="text-sm text-gray-300">{member.stat_label}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold-500/20">
                <img
                  src={member.image_url}
                  alt={displayName}
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-gold-500/30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold-500/20"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold-500/20"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold-500/20"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold-500/20"></div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-12">
            <Link to="/" className="hover:text-gold-600 transition-colors duration-300 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Начало
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gold-600 font-medium">{displayName}</span>
          </nav>

          <h2 className="font-serif text-4xl text-gray-900 mb-8">
            {member.type === 'person' ? 'За мен' : 'За салона'}
          </h2>
          <div
            className="rich-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: member.bio }}
          />
        </div>
      </section>

      {/* Certificates Section - Only for people */}
      {member.type === 'person' && certificates.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-nude-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-gray-900 mb-4">Сертификати</h2>
              <p className="text-gray-600 text-lg">Професионални квалификации и обучения</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gold-50 to-nude-50">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Award className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                      <h3 className="font-serif text-xl text-gray-900 font-semibold">{cert.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{cert.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price List Section - Only for salon */}
      {member.type === 'salon' && <PriceList />}

      {/* Gallery Section - Only for people */}
      {member.type === 'person' && gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-gray-900 mb-4">Моята работа</h2>
              <p className="text-gray-600 text-lg">Примери от реализирани проекти</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image) => (
                <div
                  key={image.id}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="text-sm font-medium">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <CallToAction />

      <Footer />
    </div>
  );
}
