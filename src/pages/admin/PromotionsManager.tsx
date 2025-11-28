import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Promotion {
  id: string;
  title: string;
  slug: string;
  description: string;
  discount_text: string;
  image_url: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export default function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    discount_text: '',
    image_url: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  async function fetchPromotions() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('valid_from', { ascending: false });

    if (error) {
      console.error('Error fetching promotions:', error);
    } else {
      setPromotions(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (editingId) {
      const { error } = await supabase
        .from('promotions')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating promotion:', error);
        alert('Грешка при актуализация');
        return;
      }
    } else {
      const { error } = await supabase.from('promotions').insert([formData]);

      if (error) {
        console.error('Error creating promotion:', error);
        alert('Грешка при създаване');
        return;
      }
    }

    handleCancel();
    fetchPromotions();
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте?')) return;

    const { error } = await supabase.from('promotions').delete().eq('id', id);

    if (error) {
      console.error('Error deleting promotion:', error);
      alert('Грешка при изтриване');
      return;
    }

    fetchPromotions();
  }

  function handleEdit(promotion: Promotion) {
    setEditingId(promotion.id);
    setShowAddForm(true);
    setFormData({
      title: promotion.title,
      slug: promotion.slug,
      description: promotion.description,
      discount_text: promotion.discount_text,
      image_url: promotion.image_url,
      valid_from: promotion.valid_from,
      valid_until: promotion.valid_until,
      is_active: promotion.is_active,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      title: '',
      slug: '',
      description: '',
      discount_text: '',
      image_url: '',
      valid_from: '',
      valid_until: '',
      is_active: true,
    });
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-charcoal-600">Промоции</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нова промоция
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-serif text-charcoal-600 mb-4">
            {editingId ? 'Редактирай промоция' : 'Нова промоция'}
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
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
            <input
              type="text"
              placeholder="Текст на отстъпка (напр. 20% отстъпка)"
              value={formData.discount_text}
              onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="URL на снимка"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Начало на валидност</label>
                <input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Край на валидност</label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Активна</span>
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
              <th className="px-6 py-3 text-left">Отстъпка</th>
              <th className="px-6 py-3 text-left">Валидност</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium">{promo.title}</td>
                <td className="px-6 py-4 text-gray-600">{promo.discount_text}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(promo.valid_from).toLocaleDateString()} -{' '}
                  {new Date(promo.valid_until).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      promo.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {promo.is_active ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="text-gold-500 hover:text-gold-600 mr-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
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
