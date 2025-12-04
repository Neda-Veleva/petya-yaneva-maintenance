import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Edit } from 'lucide-react';
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

interface CategoryFormData {
  name: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  order_position: number;
}

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    order_position: 0,
  });

  useEffect(() => {
    if (isEditing) {
      loadCategory();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadCategory() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', id!)
      .single();

    if (error) {
      console.error('Error loading category:', error);
      alert('Грешка при зареждане на категорията');
      navigate('/admin/categories');
      return;
    }

    if (data) {
      setSlugEditable(false);
      setSlugManuallyEdited(true);
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        title: data.title || '',
        description: data.description || '',
        image_url: data.image_url || '',
        thumbnail_url: data.thumbnail_url || '',
        order_position: data.order_position || 0,
      });
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.name || !formData.slug || !formData.title || !formData.description || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    setSaving(true);

    const categoryData = {
      name: formData.name,
      slug: formData.slug,
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      thumbnail_url: formData.thumbnail_url || null,
      order_position: formData.order_position,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('service_categories')
          .update(categoryData)
          .eq('id', id!);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('service_categories').insert([categoryData]);
        if (error) throw error;
      }

      navigate('/admin/categories');
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert('Грешка при запазване: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleNameChange(name: string) {
    setFormData({ ...formData, name });
    if (!slugManuallyEdited && !isEditing) {
      setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }));
    }
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-gray-900 mb-2">
          {isEditing ? 'Редактиране на категория' : 'Нова категория'}
        </h1>
        <p className="text-gray-700">
          {isEditing ? 'Редактирайте информацията за категорията' : 'Създайте нова категория'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Име <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Име"
              value={formData.name}
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
              Заглавие <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Заглавие"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ред на показване
            </label>
            <input
              type="number"
              placeholder="Ред на показване"
              value={formData.order_position}
              onChange={(e) => setFormData({ ...formData, order_position: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>
          <div>
            <MediaSelector
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              type="image"
              label="Снимка на категорията *"
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              rows={3}
            />
          </div>
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
            onClick={() => navigate('/admin/categories')}
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

