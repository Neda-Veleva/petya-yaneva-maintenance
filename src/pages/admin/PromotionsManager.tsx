import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';

interface Promotion {
  id: string;
  slug?: string;
  service_name: string;
  old_price: string;
  new_price: string;
  description: string;
  long_description?: string;
  terms?: string;
  image_url: string;
  thumbnail_url?: string;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

export default function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    service_name: '',
    old_price: '',
    new_price: '',
    description: '',
    long_description: '',
    terms: '',
    image_url: '',
    thumbnail_url: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
    order_position: 0,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  async function fetchPromotions() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) {
      console.error('Error fetching promotions:', error);
      alert('Грешка при зареждане на промоциите: ' + error.message);
    } else {
      setPromotions(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.service_name || !formData.old_price || !formData.new_price || !formData.description || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    const promotionData = {
      ...formData,
      slug: formData.slug || null,
      long_description: formData.long_description || null,
      terms: formData.terms || null,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('promotions')
        .update(promotionData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating promotion:', error);
        alert('Грешка при актуализация: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('promotions').insert([promotionData]);

      if (error) {
        console.error('Error creating promotion:', error);
        alert('Грешка при създаване: ' + error.message);
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
    setSlugEditable(false);
    setFormData({
      slug: promotion.slug || '',
      service_name: promotion.service_name,
      old_price: promotion.old_price,
      new_price: promotion.new_price,
      description: promotion.description,
      long_description: promotion.long_description || '',
      terms: promotion.terms || '',
      image_url: promotion.image_url,
      thumbnail_url: promotion.thumbnail_url || '',
      valid_from: promotion.valid_from || '',
      valid_until: promotion.valid_until || '',
      is_active: promotion.is_active,
      order_position: promotion.order_position,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setSlugEditable(false);
    setFormData({
      slug: '',
      service_name: '',
      old_price: '',
      new_price: '',
      description: '',
      long_description: '',
      terms: '',
      image_url: '',
      thumbnail_url: '',
      valid_from: '',
      valid_until: '',
      is_active: true,
      order_position: 0,
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Име на услуга <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Име на услуга"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Стара цена <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="нпр. 100 лв."
                  value={formData.old_price}
                  onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Нова цена <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="нпр. 80 лв."
                  value={formData.new_price}
                  onChange={(e) => setFormData({ ...formData, new_price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>

            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пълно описание
              </label>
              <textarea
                placeholder="Пълно описание"
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Условия
              </label>
              <textarea
                placeholder="Условия и правила"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={2}
              />
            </div>

            <div>
              <MediaSelector
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                type="image"
                label="Снимка на промоцията *"
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Начало на валидност</label>
                <input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Край на валидност</label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ред на показване</label>
                <input
                  type="number"
                  value={formData.order_position}
                  onChange={(e) => setFormData({ ...formData, order_position: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
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
              <th className="px-6 py-3 text-left">Услуга</th>
              <th className="px-6 py-3 text-left">Цена</th>
              <th className="px-6 py-3 text-left">Валидност</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-left">Ред</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Няма намерени промоции
                </td>
              </tr>
            ) : (
              promotions.map((promo) => (
                <tr key={promo.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{promo.service_name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="line-through text-gray-400">{promo.old_price}</span>{' '}
                    <span className="text-gold-600 font-semibold">{promo.new_price}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {promo.valid_from && promo.valid_until
                      ? `${new Date(promo.valid_from).toLocaleDateString('bg-BG')} - ${new Date(promo.valid_until).toLocaleDateString('bg-BG')}`
                      : '-'}
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
                  <td className="px-6 py-4 text-gray-600">{promo.order_position}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
