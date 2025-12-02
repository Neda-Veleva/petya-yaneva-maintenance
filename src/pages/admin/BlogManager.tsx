import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[а-я]/g, (char) => {
      const map: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
        'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a',
        'ь': 'y', 'ю': 'yu', 'я': 'ya'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category?: string;
  is_published: boolean;
  published_at?: string;
  author_name?: string;
  read_time?: number;
  created_at?: string;
  updated_at?: string;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    is_published: false,
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
      alert('Грешка при зареждане на статиите: ' + error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }

  function handleNameChange(title: string) {
    setFormData({ ...formData, title });
  }

  async function handleSave() {
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    const saveData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      image_url: formData.image_url,
      category: formData.category || null,
      is_published: formData.is_published,
      published_at: formData.is_published ? (formData.published_at || new Date().toISOString()) : null,
      author_name: formData.author_name || null,
      read_time: formData.read_time || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('blog_posts')
        .update(saveData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating post:', error);
        alert('Грешка при актуализация: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('blog_posts').insert([saveData]);

      if (error) {
        console.error('Error creating post:', error);
        alert('Грешка при създаване: ' + error.message);
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
    setSlugEditable(false);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url,
      category: post.category || '',
      is_published: post.is_published,
      author_name: post.author_name || '',
      read_time: post.read_time || 5,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setSlugEditable(false);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      category: '',
      is_published: false,
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заглавие <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Заглавие"
                value={formData.title}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Slug (URL)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  readOnly={!slugEditable}
                  className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 ${
                    !slugEditable ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSlugEditable(!slugEditable)}
                  className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                    slugEditable
                      ? 'bg-gold-500 text-white hover:bg-gold-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={slugEditable ? 'Запази промените' : 'Редактирай slug'}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Кратко описание <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Кратко описание"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Съдържание <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Съдържание"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={10}
              />
            </div>
            <div>
              <MediaSelector
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                type="image"
                label="Главна снимка *"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <input
                  type="text"
                  placeholder="Категория"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Име на автор</label>
                <input
                  type="text"
                  placeholder="Име на автор"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Време за четене (мин.)</label>
                <input
                  type="number"
                  placeholder="Време за четене"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Публикувано</span>
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
              <th className="px-6 py-3 text-left">Категория</th>
              <th className="px-6 py-3 text-left">Автор</th>
              <th className="px-6 py-3 text-left">Дата на публикуване</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Няма намерени статии
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-200">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{post.category || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{post.author_name || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('bg-BG')
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        post.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.is_published ? 'Публикувано' : 'Чернова'}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
