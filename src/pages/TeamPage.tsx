import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, Building2 } from 'lucide-react';

interface TeamMember {
  id: string;
  slug: string;
  type: 'person' | 'salon';
  first_name?: string;
  last_name?: string;
  title?: string;
  title_gold?: string;
  bio?: string;
  image_url: string;
  thumbnail_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  badge?: string;
  description?: string;
}

interface SalonInfo {
  id: string;
  slug: string;
  title: string;
  title_gold?: string;
  badge: string;
  description: string;
  bio: string;
  image_url: string;
  thumbnail_url?: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [salon, setSalon] = useState<SalonInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .eq('type', 'person')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (teamData) {
        setMembers(teamData);
      }

      const { data: salonData } = await supabase
        .from('salon_info')
        .select('*')
        .eq('is_active', true)
        .single();

      if (salonData) {
        setSalon(salonData);
      }

      setLoading(false);
    }

    loadData();
  }, []);

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
            <Users className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Нашият Екип</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Запознайте се с Нас
          </h1>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Професионалисти с дългогодишен опит и страст към красотата
          </p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
          ) : (
            <div className="space-y-20">
              {/* Team Members */}
              {members.length > 0 && (
                <div>
                  <h2 className="font-serif text-4xl text-white mb-8 text-center">Нашият Екип</h2>
                  <div className="h-px w-32 bg-gold-400 mx-auto mb-12"></div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {members.map((member) => (
                        <Link
                          key={member.id}
                          to={`/team/${member.slug}`}
                          className="group relative bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gold-500/10"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                          <div className="relative h-96 overflow-hidden">
                            <img
                              src={member.thumbnail_url || member.image_url}
                              alt={member.first_name && member.last_name ? `${member.first_name} ${member.last_name}` : member.title || 'Team member'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600 via-charcoal-600/50 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <h3 className="font-serif text-2xl text-white mb-2">
                                {member.first_name && member.last_name 
                                  ? `${member.first_name} ${member.last_name}`
                                  : member.title || 'Team member'}
                              </h3>
                              {member.title && (
                                <p className="text-gold-400 text-sm font-medium tracking-wide mb-3">
                                  {member.title}
                                </p>
                              )}

                              {member.bio && (
                                <div
                                  className="rich-content text-gray-300 text-sm leading-relaxed line-clamp-3"
                                  dangerouslySetInnerHTML={{ __html: member.bio }}
                                />
                              )}
                            </div>
                          </div>

                          <div className="absolute top-4 right-4 w-12 h-12 bg-charcoal-500/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors duration-300">
                            <Users className="w-5 h-5 text-gold-400" />
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Salon Section */}
              {salon && (
                <div>
                  <h2 className="font-serif text-4xl text-white mb-8 text-center">За Салона</h2>
                  <div className="h-px w-32 bg-gold-400 mx-auto mb-12"></div>
                  <Link
                    to={`/salon/${salon.slug}`}
                    className="group relative block bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gold-500/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative h-[500px] overflow-hidden">
                      <img
                        src={salon.thumbnail_url || salon.image_url}
                        alt={salon.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600 via-charcoal-600/50 to-transparent"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="font-serif text-3xl text-white mb-2">
                          {salon.title}
                          {salon.title_gold && (
                            <span className="text-gold-400 ml-3">{salon.title_gold}</span>
                          )}
                        </h3>
                        <p className="text-gold-400 text-lg font-medium tracking-wide mb-3">
                          {salon.badge}
                        </p>
                        <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
                          {salon.description}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 w-14 h-14 bg-charcoal-500/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors duration-300">
                      <Building2 className="w-6 h-6 text-gold-400" />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          {!loading && members.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gold-500/30 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Няма добавени членове на екипа</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
