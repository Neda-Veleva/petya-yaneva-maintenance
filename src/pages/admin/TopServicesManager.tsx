import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';

interface Category {
  id: string;
  name: string;
}

interface TopService {
  id: string;
  category_id?: string;
  name: string;
  description?: string;
  price?: string;
  image_url: string;
  cta_text: string;
  order_position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  service_categories?: {
    name: string;
  };
}

export default function TopServicesManager() {
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    image_url: '',
    cta_text: 'Запази час',
    order_position: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [topServicesRes, categoriesRes] = await Promise.all([
      supabase
        .from('top_services')
        .select('*, service_categories(name)')
        .order('order_position', { ascending: true }),
      supabase
        .from('service_categories')
        .select('id, name')
        .order('order_position'),
    ]);

    if (topServicesRes.error) {
      console.error('Error fetching top services:', topServicesRes.error);
      alert('Грешка при зареждане на топ услугите: ' + topServicesRes.error.message);
    } else {
      setTopServices(topServicesRes.data || []);
    }

    if (categoriesRes.error) {
      console.error('Error fetching categories:', categoriesRes.error);
    } else {
      setCategories(categoriesRes.data || []);
    }

    setLoading(false);
  }

  async function handleSave() {
    if (!formData.name || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    const topServiceData = {
      ...formData,
      category_id: formData.category_id || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('top_services')
        .update(topServiceData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating top service:', error);
        alert('Грешка при актуализация: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('top_services').insert([topServiceData]);

      if (error) {
        console.error('Error creating top service:', error);
        alert('Грешка при създаване: ' + error.message);
        return;
      }
    }

    handleCancel();
    fetchData();
  }

  function handleEdit(service: TopService) {
    setEditingId(service.id);
    setShowAddForm(true);
    setFormData({
      category_id: service.category_id || '',
      name: service.name,
      description: service.description || '',
      price: service.price || '',
      image_url: service.image_url,
      cta_text: service.cta_text,
      order_position: service.order_position,
      is_active: service.is_active,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      category_id: '',
      name: '',
      description: '',
      price: '',
      image_url: '',
      cta_text: 'Запази час',
      order_position: 0,
      is_active: true,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте?')) return;

    const { error } = await supabase.from('top_services').delete().eq('id', id);

    if (error) {
      console.error('Error deleting top service:', error);
      alert('Грешка при изтриване: ' + error.message);
      return;
    }

    fetchData();
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif text-charcoal-600 mb-2">Топ Услуги</h1>
          <p className="text-gray-600">Показват се на началната страница</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нова топ услуга
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-serif text-charcoal-600 mb-4">
            {editingId ? 'Редактиране на топ услуга' : 'Нова топ услуга'}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="нпр. Запази час"
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

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Активна</span>
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
              <th className="px-6 py-3 text-left">Име</th>
              <th className="px-6 py-3 text-left">Категория</th>
              <th className="px-6 py-3 text-left">Цена</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-left">Ред</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {topServices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Няма добавени топ услуги
                </td>
              </tr>
            ) : (
              topServices.map((ts) => (
                <tr key={ts.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{ts.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {ts.service_categories?.name || 'Начална страница'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ts.price || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ts.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ts.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ts.order_position}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(ts)}
                      className="text-gold-500 hover:text-gold-600 mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ts.id)}
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
