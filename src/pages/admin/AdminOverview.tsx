import { useState, useEffect } from 'react';
import { Package, FileText, Tag, Users, Star, FolderOpen, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  services: number;
  categories: number;
  topServices: number;
  blogPosts: number;
  promotions: number;
  team: number;
  reviews: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    categories: 0,
    topServices: 0,
    blogPosts: 0,
    promotions: 0,
    team: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [services, categories, topServices, blogPosts, promotions, team, reviews] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('service_categories').select('id', { count: 'exact', head: true }),
        supabase.from('top_services').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('promotions').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('service_reviews').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        services: services.count || 0,
        categories: categories.count || 0,
        topServices: topServices.count || 0,
        blogPosts: blogPosts.count || 0,
        promotions: promotions.count || 0,
        team: team.count || 0,
        reviews: reviews.count || 0,
      });

      setLoading(false);
    }

    loadStats();
  }, []);

  const statCards = [
    { name: 'Услуги', value: stats.services, icon: Package, color: 'from-blue-500 to-blue-600' },
    { name: 'Категории', value: stats.categories, icon: FolderOpen, color: 'from-purple-500 to-purple-600' },
    { name: 'Топ Услуги', value: stats.topServices, icon: Sparkles, color: 'from-yellow-500 to-yellow-600' },
    { name: 'Блог статии', value: stats.blogPosts, icon: FileText, color: 'from-green-500 to-green-600' },
    { name: 'Промоции', value: stats.promotions, icon: Tag, color: 'from-red-500 to-red-600' },
    { name: 'Членове на екипа', value: stats.team, icon: Users, color: 'from-indigo-500 to-indigo-600' },
    { name: 'Отзиви', value: stats.reviews, icon: Star, color: 'from-pink-500 to-pink-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-white mb-2">Добре дошли в Admin Panel</h1>
        <p className="text-white">Преглед на съдържанието на сайта</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
