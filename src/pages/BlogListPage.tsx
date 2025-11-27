import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  published_at: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadPosts() {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, image_url, category, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (data) {
        setPosts(data);
        const uniqueCategories = Array.from(new Set(data.map(post => post.category)));
        setCategories(uniqueCategories);
      }
      setLoading(false);
    }

    loadPosts();
  }, []);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-6xl text-gold-500 mb-6">Блог</h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Открийте най-новите тенденции, съвети и трикове за красота и грижа за миглите
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === 'all'
                      ? 'bg-gold-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gold-50'
                  }`}
                >
                  Всички
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gold-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gold-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">Няма публикувани статии в тази категория</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold-50 text-gold-600 rounded-full font-medium">
                            <Tag className="w-3 h-3" />
                            {post.category}
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl text-gray-900 mb-3 group-hover:text-gold-600 transition-colors duration-300">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <span className="inline-flex items-center space-x-2 text-nude-500 group-hover:text-gold-600 font-medium transition-colors duration-300 group/link">
                          <span>Прочети повече</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
