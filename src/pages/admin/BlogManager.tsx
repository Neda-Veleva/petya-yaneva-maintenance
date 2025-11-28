import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  published_at: string;
  author_name: string;
  read_time: number;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false,
    author_name: '',
    read_time: 5,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    const saveData = {
      ...formData,
      published_at: formData.published ? new Date().toISOString() : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('blog_posts')
        .update(saveData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating post:', error);
        alert('Грешка при актуализация');
        return;
      }
    } else {
      const { error } = await supabase.from('blog_posts').insert([saveData]);

      if (error) {
        console.error('Error creating post:', error);
        alert('Грешка при създаване');
        return;
      }
    }

    handleCancel();
    fetchPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте?')) return;

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      alert('Грешка при изтриване');
      return;
    }

    fetchPosts();
  }

  function handleEdit(post: BlogPost) {
    setEditingId(post.id);
    setShowAddForm(true);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image,
      published: post.published,
      author_name: post.author_name,
      read_time: post.read_time,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      published: false,
      author_name: '',
      read_time: 5,
    });
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-charcoal-600">Блог</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нова статия
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-serif text-charcoal-600 mb-4">
            {editingId ? 'Редактирай статия' : 'Нова статия'}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Заглавие"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Кратко описание"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
            <textarea
              placeholder="Съдържание"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={10}
            />
            <input
              type="text"
              placeholder="URL на главна снимка"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Име на автор"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Време за четене (минути)"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Публикувано</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
            >
              <Save className="w-4 h-4" />
              Запази
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              <X className="w-4 h-4" />
              Отказ
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-charcoal-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Заглавие</th>
              <th className="px-6 py-3 text-left">Автор</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium">{post.title}</td>
                <td className="px-6 py-4 text-gray-600">{post.author_name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      post.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {post.published ? 'Публикувано' : 'Чернова'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-gold-500 hover:text-gold-600 mr-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
