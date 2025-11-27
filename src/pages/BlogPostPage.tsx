import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  published_at: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;

      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (data) {
        setPost(data);

        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, image_url, category, published_at')
          .eq('category', data.category)
          .eq('is_published', true)
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3);

        if (related) {
          setRelatedPosts(related);
        }
      }
      setLoading(false);
    }

    loadPost();
  }, [slug]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-40 text-center">
          <h1 className="font-serif text-4xl text-gray-900 mb-6">Статията не е намерена</h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Към блога
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      <article className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium mb-8 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад към блога
          </Link>

          <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-12">
            <div className="relative h-96 overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold-50 text-gold-600 rounded-full font-medium">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-gold-500 pl-6 italic">
                {post.excerpt}
              </p>

              <div
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-gold-600 prose-a:no-underline hover:prose-a:text-gold-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl text-gray-900 mb-8">Свързани статии</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-gold-600 bg-gold-50 rounded-full mb-2">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-serif text-lg text-gray-900 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 text-sm text-gold-600 font-medium">
                        Прочети повече
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
