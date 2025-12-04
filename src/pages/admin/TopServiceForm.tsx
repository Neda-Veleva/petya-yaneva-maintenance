import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';

interface Category {
  id: string;
  name: string;
}

interface TopServiceFormData {
  category_id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  thumbnail_url: string;
  cta_text: string;
  order_position: number;
  is_active: boolean;
}

export default function TopServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<TopServiceFormData>({
    category_id: '',
    name: '',
    description: '',
    price: '',
    image_url: '',
    thumbnail_url: '',
    cta_text: 'Запази час',
    order_position: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      loadTopService();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function fetchCategories() {
    const { data } = await supabase
      .from('service_categories')
      .select('id, name')
      .order('order_position');

    if (data) {
      setCategories(data);
    }
  }

  async function loadTopService() {
    const { data, error } = await supabase
      .from('top_services')
      .select('*')
      .eq('id', id!)
      .single();

    if (error) {
      console.error('Error loading top service:', error);
      alert('Грешка при зареждане на топ услугата');
      navigate('/admin/top-services');
      return;
    }

    if (data) {
      setFormData({
        category_id: data.category_id || '',
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        image_url: data.image_url || '',
        thumbnail_url: data.thumbnail_url || '',
        cta_text: data.cta_text || 'Запази час',
        order_position: data.order_position || 0,
        is_active: data.is_active ?? true,
      });
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.name || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    setSaving(true);

    const topServiceData = {
      category_id: formData.category_id || null,
      name: formData.name,
      description: formData.description || null,
      price: formData.price || null,
      image_url: formData.image_url,
      thumbnail_url: formData.thumbnail_url || null,
      cta_text: formData.cta_text,
      order_position: formData.order_position,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('top_services')
          .update(topServiceData)
          .eq('id', id!);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('top_services').insert([topServiceData]);
        if (error) throw error;
      }

      navigate('/admin/top-services');
    } catch (error: any) {
      console.error('Error saving top service:', error);
      alert('Грешка при запазване: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-gray-900 mb-2">
          {isEditing ? 'Редактиране на топ услуга' : 'Нова топ услуга'}
        </h1>
        <p className="text-gray-700">
          {isEditing ? 'Редактирайте информацията за топ услугата' : 'Създайте нова топ услуга'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория (опционално)
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="">Без категория (за начална страница)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ред на показване
              </label>
              <input
                type="number"
                value={formData.order_position}
                onChange={(e) => setFormData({ ...formData, order_position: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Име на услугата <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Име на услугата"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              placeholder="Кратко описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена
              </label>
              <input
                type="text"
                placeholder="нпр. 80 лв."
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текст на бутона
              </label>
              <input
                type="text"
                placeholder="Запази час"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
          </div>

          <div>
            <MediaSelector
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              type="image"
              label="Снимка на услугата *"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Активна
            </label>
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
            onClick={() => navigate('/admin/top-services')}
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

