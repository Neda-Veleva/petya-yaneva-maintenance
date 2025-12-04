import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';
import RichTextEditor from '../../components/RichTextEditor';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  thumbnail_url: string;
  category: string;
  is_published: boolean;
  author_name: string;
  read_time: number;
}

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    thumbnail_url: '',
    category: '',
    is_published: false,
    author_name: '',
    read_time: 5,
  });

  useEffect(() => {
    if (isEditing) {
      loadPost();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadPost() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id!)
      .single();

    if (error) {
      console.error('Error loading post:', error);
      alert('Грешка при зареждане на статията');
      navigate('/admin/blog');
      return;
    }

    if (data) {
      setSlugEditable(false);
      setSlugManuallyEdited(true);
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        image_url: data.image_url || '',
        thumbnail_url: data.thumbnail_url || '',
        category: data.category || '',
        is_published: data.is_published || false,
        author_name: data.author_name || '',
        read_time: data.read_time || 5,
      });
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    setSaving(true);

    const saveData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      image_url: formData.image_url,
      thumbnail_url: formData.thumbnail_url || null,
      category: formData.category || null,
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
      author_name: formData.author_name || null,
      read_time: formData.read_time || null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(saveData)
          .eq('id', id!);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([saveData]);
        if (error) throw error;
      }

      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert('Грешка при запазване: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleTitleChange(title: string) {
    setFormData({ ...formData, title });
    if (!slugManuallyEdited && !isEditing) {
      setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
    }
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-gray-900 mb-2">
          {isEditing ? 'Редактирай статия' : 'Нова статия'}
        </h1>
        <p className="text-gray-700">
          {isEditing ? 'Редактирайте информацията за статията' : 'Създайте нова статия'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заглавие <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Заглавие"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
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
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value });
                  setSlugManuallyEdited(true);
                }}
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
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Съдържание"
              minHeight="300px"
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
          <div>
            <MediaSelector
              value={formData.thumbnail_url}
              onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
              type="image"
              label="Тъмбнейл за карти (опционално)"
            />
            <p className="text-sm text-gray-500 mt-1">Ако не е зададено, ще се използва главната снимка</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
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
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Запазване...' : 'Запази'}
          </button>
          <button
            onClick={() => navigate('/admin/blog')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            <X className="w-4 h-4" />
            Отказ
          </button>
        </div>
      </div>
    </div>
  );
}

