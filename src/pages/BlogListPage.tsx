import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, Home, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';
import MediaRender from '../components/MediaRender';

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
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
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
        const featured = data.find(post => post.slug === 'sutreshen-ritual-za-zdravi-mighli');
        const otherPosts = data.filter(post => post.slug !== 'sutreshen-ritual-za-zdravi-mighli');

        setFeaturedPost(featured || null);
        setPosts(otherPosts);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MediaRender
            src="https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Блог"
            className="w-full h-full object-cover"
            videoProps={{ muted: true, loop: true, autoPlay: true }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/80 via-charcoal-600/60 to-charcoal-600/80"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
            Блог за красота и грижа
          </h1>
          <p className="text-xl md:text-2xl text-gold-200 leading-relaxed">
            Открийте най-новите тенденции, съвети и трикове за перфектни мигли и вежди
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nude-50 to-transparent"></div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 bg-gold-500/20 text-gold-300 rounded-full font-medium text-sm mb-4 backdrop-blur-sm border border-gold-500/30">
                Топ статия
              </span>
              <h2 className="font-serif text-5xl text-white mb-4">Препоръчана статия</h2>
              <div className="h-1 w-24 bg-gold-shimmer animate-shimmer mx-auto"></div>
            </div>

            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-gold-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/20"
            >
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="relative h-96 lg:h-full lg:col-span-3 overflow-hidden">
                  <MediaRender
                    src={featuredPost.image_url}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal-600/40"></div>
                </div>

                <div className="lg:col-span-2 p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white/10 to-white/5">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-300 rounded-full font-medium text-sm backdrop-blur-sm border border-gold-500/30">
                      <Tag className="w-4 h-4" />
                      {featuredPost.category}
                    </span>
                    <span className="inline-flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredPost.published_at)}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl lg:text-4xl text-white mb-6 leading-tight group-hover:text-gold-300 transition-colors duration-300">
                    {featuredPost.title}
                  </h3>

                  <p className="text-base lg:text-lg text-gray-300 mb-8 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-2 text-gold-400 font-semibold text-lg group-hover:gap-4 transition-all duration-300">
                    Прочети цялата статия
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold-500/20"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold-500/20"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold-500/20"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold-500/20"></div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-12">
            <Link to="/" className="hover:text-gold-600 transition-colors duration-300 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Начало
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gold-600 font-medium">Блог</span>
          </nav>

          {/* Category Filters */}
          <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-nude-200">
            <h2 className="font-serif text-3xl text-gray-900 mb-6 text-center">Филтрирай по категория</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gold-50 shadow-md border border-gray-200'
                }`}
              >
                Всички
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gold-50 shadow-md border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl text-gray-900 mb-8">
              {selectedCategory === 'all' ? 'Всички статии' : `Статии в "${selectedCategory}"`}
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl">
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
                      <MediaRender
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
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction />

      <Footer />
    </div>
  );
}
