import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, MessageCircle, Instagram, Facebook, Twitter, Youtube, Linkedin, Music } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface ContactConfig {
  address: string;
  google_maps_link: string | null;
  phone: string;
  email: string | null;
  working_hours: Array<{
    day: string;
    hours: string;
  }>;
  social_links: Array<{
    platform: string;
    url: string;
  }>;
}

const SOCIAL_ICONS: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  pinterest: Instagram, // Fallback to Instagram icon
  tiktok: Music,
};

export default function ContactPage() {
  const [config, setConfig] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    const { data, error } = await supabase
      .from('contact_config')
      .select('*')
      .single();

    // If table doesn't exist or no data, return early
    if (error || !data) {
      setLoading(false);
      return;
    }

    if (data) {
      // Migrate old format to new format if needed
      let workingHours = data.working_hours || [];
      if (!Array.isArray(workingHours) && typeof workingHours === 'object') {
        const oldHours = workingHours as any;
        workingHours = [];
        if (oldHours.monday_friday) {
          workingHours.push({ day: 'Понеделник - Петък', hours: oldHours.monday_friday });
        }
        if (oldHours.saturday) {
          workingHours.push({ day: 'Събота', hours: oldHours.saturday });
        }
        if (oldHours.sunday) {
          workingHours.push({ day: 'Неделя', hours: oldHours.sunday });
        }
      }
      
      setConfig({
        address: data.address,
        google_maps_link: data.google_maps_link,
        phone: data.phone,
        email: data.email,
        working_hours: workingHours,
        social_links: data.social_links || [],
      });
    }
    setLoading(false);
  }

  function getGoogleMapsEmbedUrl(link: string | null): string | null {
    if (!link || !link.trim()) return null;
    
    const trimmedLink = link.trim();
    
    // If it's already an embed URL, return as is
    if (trimmedLink.includes('/embed') || trimmedLink.includes('iframe')) {
      // Extract embed URL from iframe src if needed
      const iframeMatch = trimmedLink.match(/src=["']([^"']+)["']/);
      if (iframeMatch) return iframeMatch[1];
      // If it's a full iframe tag, extract src
      const iframeSrcMatch = trimmedLink.match(/<iframe[^>]+src=["']([^"']+)["']/);
      if (iframeSrcMatch) return iframeSrcMatch[1];
      return trimmedLink;
    }
    
    // If it's a share link with coordinates (@lat,lng)
    const coordMatch = trimmedLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      // Use simple embed format with coordinates
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}%2C${lng}!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;
    }
    
    // If it's a share link with place ID (place/...)
    const placeMatch = trimmedLink.match(/place\/([^\/\?&]+)/);
    if (placeMatch) {
      const placeId = placeMatch[1];
      // Convert place share link to embed format
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0%2C0!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&q=place_id:${encodeURIComponent(placeId)}`;
    }
    
    // If it's a maps.google.com or maps.app.goo.gl link, try to extract and convert
    if (trimmedLink.includes('maps.google.com') || trimmedLink.includes('goo.gl/maps') || trimmedLink.includes('maps.app.goo.gl')) {
      // Try to extract address or place name from query parameter
      const urlMatch = trimmedLink.match(/[?&]q=([^&]+)/);
      if (urlMatch) {
        const query = decodeURIComponent(urlMatch[1]);
        // Use the query directly in embed format
        return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      }
      // If no q parameter, try to use the full URL
      return `https://www.google.com/maps?q=${encodeURIComponent(trimmedLink)}&output=embed`;
    }
    
    // If it looks like a valid URL but not recognized format, return as is (might be embed URL)
    if (trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://')) {
      return trimmedLink;
    }
    
    return null;
  }


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
            <MessageCircle className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Контакти</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Свържете се с Нас
          </h1>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Очакваме вашето запитване. Ще се радваме да отговорим на всички ваши въпроси
          </p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {config && (
            <div className="space-y-8">
              {/* Първи ред: Адрес и Телефон */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-8 h-8 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-xl mb-2">Адрес</h3>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {config.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-8 h-8 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-xl mb-2">Телефон</h3>
                      <a
                        href={`tel:${config.phone}`}
                        className="text-gray-300 hover:text-gold-400 transition-colors text-lg"
                      >
                        {config.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Втори ред: Работно време и Социални мрежи */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-8 h-8 text-gold-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-xl mb-3">Работно време</h3>
                      <div className="space-y-2 text-gray-300">
                        {Array.isArray(config.working_hours) && config.working_hours.length > 0 ? (
                          config.working_hours.map((wh, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{wh.day}</span>
                              <span className={`font-medium ${wh.hours.toLowerCase().includes('почивен') ? 'text-gray-500' : 'text-gold-400'}`}>
                                {wh.hours}
                              </span>
                            </div>
                          ))
                        ) : (
                          // Fallback for old format (migration support)
                          <>
                            {(config.working_hours as any)?.monday_friday && (
                              <div className="flex justify-between">
                                <span>Понеделник - Петък</span>
                                <span className="text-gold-400 font-medium">{(config.working_hours as any).monday_friday}</span>
                              </div>
                            )}
                            {(config.working_hours as any)?.saturday && (
                              <div className="flex justify-between">
                                <span>Събота</span>
                                <span className="text-gold-400 font-medium">{(config.working_hours as any).saturday}</span>
                              </div>
                            )}
                            {(config.working_hours as any)?.sunday && (
                              <div className="flex justify-between">
                                <span>Неделя</span>
                                <span className="text-gray-500 font-medium">{(config.working_hours as any).sunday}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {config.social_links.length > 0 && (
                  <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-8 h-8 text-gold-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-xl mb-4">Социални мрежи</h3>
                        <div className="flex flex-wrap gap-3">
                          {config.social_links.map((link, index) => {
                            const Icon = SOCIAL_ICONS[link.platform] || Instagram;
                            return (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center hover:bg-gold-500/20 transition-colors"
                                title={link.platform}
                              >
                                <Icon className="w-8 h-8 text-gold-400" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {config && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl overflow-hidden border border-gold-500/10 shadow-2xl">
              {getGoogleMapsEmbedUrl(config.google_maps_link) ? (
                <div className="aspect-[21/9]">
                  <iframe
                    src={getGoogleMapsEmbedUrl(config.google_maps_link) || ''}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="aspect-[21/9] bg-charcoal-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gold-400/50 mx-auto mb-4" />
                    <p className="text-gray-400">Карта на локацията</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Добавете Google Maps линк в администрацията за да се покаже картата
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
