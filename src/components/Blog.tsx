import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  thumbnail_url?: string;
  category: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, image_url, thumbnail_url, category')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (data) {
        setPosts(data);
      }
      setLoading(false);
    }

    loadPosts();
  }, []);

  return (
    <section id="blog" className="py-24 bg-gradient-to-br from-nude-50 via-nude-100 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">Най-нови статии</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Научете как да се грижите за миглите си, как да се подготвите за посещение и как да поддържате изискан бюти ритуал.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Няма публикувани статии</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.thumbnail_url || post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-gold-600 bg-gold-50 rounded-full mb-3">
                    {post.category}
                  </span>

                  <h3 className="font-serif text-2xl text-gray-900 mb-3 group-hover:text-gold-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center space-x-2 text-nude-500 group-hover:text-gold-600 font-medium transition-colors duration-300 group/link">
                    <span>Прочети повече</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
