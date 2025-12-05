import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';
import ImageGrid from './ImageGrid';
import MediaRender from './MediaRender';
import { supabase } from '../lib/supabase';

interface Slide {
  id: string;
  type: 'person' | 'salon';
  firstName?: string;
  lastName?: string;
  title?: string;
  titleGold?: string;
  badge: string;
  description: string;
  image: string;
  thumbnail: string;
  stat: { value: string; label: string };
  slug: string;
  imageSlides?: string[][]; // За салони: групирани по 3
  personImages?: string[]; // За лица: масив от отделни снимки
  icon?: typeof MapPin;
}

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSalonImage, setCurrentSalonImage] = useState(0);
  const [currentPersonImage, setCurrentPersonImage] = useState(0);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  async function loadTeamMembers() {
    try {
      // Зареждане на team members
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (membersError) {
        console.error('Error loading team members:', membersError);
        setLoading(false);
        return;
      }

      if (!members || members.length === 0) {
        setLoading(false);
        return;
      }

      // Зареждане на галерии за всички members
      const memberIds = members.map((m) => m.id);
      const { data: galleries, error: galleriesError } = await supabase
        .from('team_member_gallery')
        .select('*')
        .in('team_member_id', memberIds)
        .order('display_order', { ascending: true });

      if (galleriesError) {
        console.error('Error loading galleries:', galleriesError);
      }

      // Групиране на главните снимки по team_member_id (само gallery_type = 'main' или null за обратна съвместимост)
      const mainImagesByMember: Record<string, string[]> = {};
      if (galleries) {
        galleries.forEach((gallery) => {
          // Използваме само главните снимки (gallery_type = 'main' или null за стари записи)
          if (gallery.gallery_type === 'main' || !gallery.gallery_type) {
            if (!mainImagesByMember[gallery.team_member_id]) {
              mainImagesByMember[gallery.team_member_id] = [];
            }
            mainImagesByMember[gallery.team_member_id].push(gallery.image_url);
          }
        });
      }

      // Конвертиране на members в slides
      const slidesData: Slide[] = members.map((member) => {
        const slide: Slide = {
          id: member.id,
          type: member.type as 'person' | 'salon',
          badge: member.badge,
          description: member.description,
          image: member.image_url,
          thumbnail: member.thumbnail_url || member.image_url,
          stat: {
            value: member.stat_value,
            label: member.stat_label,
          },
          slug: member.slug,
        };

        if (member.type === 'person') {
          slide.firstName = member.first_name || '';
          slide.lastName = member.last_name || '';
          
          // За лица: използваме само главните снимки
          const mainImages = mainImagesByMember[member.id] || [];
          const allPersonImages = [member.image_url, ...mainImages];
          // Премахваме дубликатите и празните стойности
          const uniqueImages = Array.from(new Set(allPersonImages.filter(img => img && img.trim() !== '')));
          
          if (uniqueImages.length > 1) {
            slide.personImages = uniqueImages;
          }
        } else {
          slide.title = member.title || '';
          slide.titleGold = member.title_gold || '';
          slide.icon = MapPin;

          // За салони: използваме само главните снимки, групирани по 3
          const mainImages = mainImagesByMember[member.id] || [];
          const allSalonImages = [member.image_url, ...mainImages];
          const uniqueSalonImages = Array.from(new Set(allSalonImages.filter(img => img && img.trim() !== '')));
          
          if (uniqueSalonImages.length > 1) {
            const imageSlides: string[][] = [];
            for (let i = 0; i < uniqueSalonImages.length; i += 3) {
              imageSlides.push(uniqueSalonImages.slice(i, i + 3));
            }
            // Ако има поне една група, използваме ги
            if (imageSlides.length > 0) {
              slide.imageSlides = imageSlides;
            }
          }
        }

        return slide;
      });

      setSlides(slidesData);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  }

  const slide = slides[currentSlide];

  useEffect(() => {
    // Автоматично превключване за салони с imageSlides
    if (slide && slide.type === 'salon' && slide.imageSlides && slide.imageSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSalonImage((prev) => (prev + 1) % slide.imageSlides!.length);
      }, 4000);

      return () => clearInterval(interval);
    }
    
    // Автоматично превключване за лица с множество снимки
    if (slide && slide.type === 'person' && slide.personImages && slide.personImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentPersonImage((prev) => (prev + 1) % slide.personImages!.length);
      }, 4000);

      return () => clearInterval(interval);
    }
    
    // Ресетване на индексите при смяна на слайда
    setCurrentSalonImage(0);
    setCurrentPersonImage(0);
  }, [currentSlide, slide]);

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-gradient">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (!slide || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-gradient">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-8 items-center">
          {/* Content */}
          <div className="space-y-8 order-1">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow">
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
              <span className="text-sm text-gold-400 font-medium tracking-wide">{slide.badge}</span>
            </div>

            <div className="space-y-4">
              {slide.type === 'person' ? (
                <>
                  <h1 className="font-serif text-6xl lg:text-8xl text-white leading-none tracking-tight">
                    {slide.firstName}
                  </h1>
                  <h2 className="font-serif text-6xl lg:text-8xl bg-gold-shimmer bg-clip-text text-transparent leading-none tracking-tight animate-shimmer">
                    {slide.lastName}
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="font-serif text-6xl lg:text-8xl text-white leading-none tracking-tight">
                    {slide.title}
                  </h1>
                  <h2 className="font-serif text-6xl lg:text-8xl bg-gold-shimmer bg-clip-text text-transparent leading-none tracking-tight animate-shimmer">
                    {slide.titleGold}
                  </h2>
                </>
              )}
              <div className="h-1 w-32 bg-gold-shimmer animate-shimmer"></div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed max-w-xl font-light">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`/team/${slide.slug}`}
                className="group px-8 py-4 bg-gold-shimmer text-charcoal-600 rounded-full font-semibold transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 flex items-center gap-2"
              >
                <span>Прочети още</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="#contact"
                className="px-8 py-4 bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-full font-semibold transition-all duration-300 hover:shadow-gold-glow"
              >
                Запази час
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-float order-3">
            {slide.type === 'salon' && slide.imageSlides ? (
              <div className="relative">
                <ImageGrid
                  images={slide.imageSlides[currentSalonImage]}
                  slideIndex={currentSalonImage}
                />

                {/* Salon Slide Navigation */}
                {slide.imageSlides.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-charcoal-400/80 backdrop-blur-md px-4 py-2 rounded-full">
                    {slide.imageSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSalonImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSalonImage
                            ? 'bg-gold-500 w-6'
                            : 'bg-gray-400 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : slide.type === 'person' && slide.personImages && slide.personImages.length > 1 ? (
              <div className="relative">
                <div className="relative w-full h-[650px] rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
                  <MediaRender
                    src={slide.personImages[currentPersonImage] || ''}
                    alt={`${slide.firstName || ''} ${slide.lastName || ''}`}
                    className="w-full h-full object-cover brightness-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(194,164,105,0.1)]"></div>
                </div>

                {/* Person Image Navigation */}
                {slide.personImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-charcoal-400/80 backdrop-blur-md px-4 py-2 rounded-full">
                    {slide.personImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPersonImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentPersonImage
                            ? 'bg-gold-500 w-6'
                            : 'bg-gray-400 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-[650px] rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
                <MediaRender
                  src={slide.image || ''}
                  alt={slide.type === 'person' ? `${slide.firstName || ''} ${slide.lastName || ''}` : slide.title || ''}
                  className="w-full h-full object-cover brightness-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(194,164,105,0.1)]"></div>
              </div>
            )}

            <div className="absolute -bottom-8 -left-8 bg-charcoal-400 border border-gold-500/30 rounded-2xl shadow-dark-xl p-8 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gold-shimmer rounded-full flex items-center justify-center shadow-gold-glow">
                  {slide.icon ? (
                    <slide.icon className="w-8 h-8 text-charcoal-600" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-charcoal-600" />
                  )}
                </div>
                <div>
                  <p className="text-4xl font-serif font-bold bg-gold-shimmer bg-clip-text text-transparent">{slide.stat.value}</p>
                  <p className="text-sm text-gray-400 font-medium">{slide.stat.label}</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-gold-500/30 rounded-full blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gold-500/20 rounded-full blur-sm"></div>
          </div>

          {/* Thumbnails sidebar */}
          {slides.length > 1 && (
            <div className="flex lg:flex-col gap-4 justify-center lg:justify-start order-3">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                    index === currentSlide
                      ? 'ring-2 ring-gold-500 shadow-gold-glow scale-110'
                      : 'opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <MediaRender
                    src={s.thumbnail}
                    alt={s.type === 'person' ? `${s.firstName || ''} ${s.lastName || ''}`.trim() : s.title || ''}
                    className="w-full h-full object-cover"
                    videoProps={{ muted: true, loop: true }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/80 to-transparent"></div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
