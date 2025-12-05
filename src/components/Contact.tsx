import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter, Youtube, Linkedin, Music } from 'lucide-react';
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

export default function Contact() {
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

  if (loading || !config) {
    return null;
  }

  const mapEmbedUrl = getGoogleMapsEmbedUrl(config.google_maps_link);

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">Контакти</h2>
          <p className="text-gray-600 text-lg">
            Посетете ни в нашето луксозно студио
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-nude-50 rounded-3xl p-8 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Адрес</h3>
                  <p className="text-gray-600 whitespace-pre-line">{config.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Телефон</h3>
                  <a href={`tel:${config.phone}`} className="text-gray-600 hover:text-gold-500">
                    {config.phone}
                  </a>
                </div>
              </div>

              {config.email && (
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-gray-900 mb-2">Email</h3>
                    <a href={`mailto:${config.email}`} className="text-gray-600 hover:text-gold-500">
                      {config.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Работно време</h3>
                  <div className="text-gray-600 space-y-1">
                    {Array.isArray(config.working_hours) && config.working_hours.length > 0 ? (
                      config.working_hours.map((wh, index) => (
                        <p key={index}>{wh.day}: {wh.hours}</p>
                      ))
                    ) : (
                      // Fallback for old format (migration support)
                      <>
                        {(config.working_hours as any)?.monday_friday && (
                          <p>Понеделник - Петък: {(config.working_hours as any).monday_friday}</p>
                        )}
                        {(config.working_hours as any)?.saturday && (
                          <p>Събота: {(config.working_hours as any).saturday}</p>
                        )}
                        {(config.working_hours as any)?.sunday && (
                          <p>Неделя: {(config.working_hours as any).sunday}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {config.social_links.length > 0 && (
                <div className="flex items-start space-x-4">
                  <div className="flex flex-wrap gap-3">
                    {config.social_links.map((link, index) => {
                      const Icon = SOCIAL_ICONS[link.platform] || Instagram;
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gold-400/40 transition-colors duration-300"
                          title={link.platform}
                        >
                          <Icon className="w-6 h-6 text-gold-500" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px] bg-nude-100">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="w-16 h-16 text-gold-400 mx-auto" />
                  <p className="text-gray-600 font-medium">Местоположение на картата</p>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Добавете Google Maps линк в администрацията за да се покаже картата
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
