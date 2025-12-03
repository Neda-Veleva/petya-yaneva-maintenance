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

interface PromotionFormData {
  slug: string;
  service_name: string;
  old_price: string;
  new_price: string;
  description: string;
  long_description: string;
  terms: string;
  image_url: string;
  thumbnail_url: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  order_position: number;
}

export default function PromotionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<PromotionFormData>({
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
    if (isEditing) {
      loadPromotion();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadPromotion() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id!)
      .single();

    if (error) {
      console.error('Error loading promotion:', error);
      alert('Грешка при зареждане на промоцията');
      navigate('/admin/promotions');
      return;
    }

    if (data) {
      setSlugEditable(false);
      setSlugManuallyEdited(true);
      setFormData({
        slug: data.slug || '',
        service_name: data.service_name || '',
        old_price: data.old_price || '',
        new_price: data.new_price || '',
        description: data.description || '',
        long_description: data.long_description || '',
        terms: data.terms || '',
        image_url: data.image_url || '',
        thumbnail_url: data.thumbnail_url || '',
        valid_from: data.valid_from || '',
        valid_until: data.valid_until || '',
        is_active: data.is_active ?? true,
        order_position: data.order_position || 0,
      });
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.service_name || !formData.old_price || !formData.new_price || !formData.description || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    setSaving(true);

    const promotionData = {
      slug: formData.slug || null,
      service_name: formData.service_name,
      old_price: formData.old_price,
      new_price: formData.new_price,
      description: formData.description,
      long_description: formData.long_description || null,
      terms: formData.terms || null,
      image_url: formData.image_url,
      thumbnail_url: formData.thumbnail_url || null,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
      is_active: formData.is_active,
      order_position: formData.order_position,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', id!);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('promotions').insert([promotionData]);
        if (error) throw error;
      }

      navigate('/admin/promotions');
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      alert('Грешка при запазване: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleServiceNameChange(serviceName: string) {
    setFormData({ ...formData, service_name: serviceName });
    if (!slugManuallyEdited && !isEditing) {
      setFormData(prev => ({ ...prev, service_name: serviceName, slug: generateSlug(serviceName) }));
    }
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-gray-900 mb-2">
          {isEditing ? 'Редактирай промоция' : 'Нова промоция'}
        </h1>
        <p className="text-gray-700">
          {isEditing ? 'Редактирайте информацията за промоцията' : 'Създайте нова промоция'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Име на услуга <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Име на услуга"
                value={formData.service_name}
                onChange={(e) => handleServiceNameChange(e.target.value)}
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
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <RichTextEditor
              value={formData.long_description}
              onChange={(value) => setFormData({ ...formData, long_description: value })}
              placeholder="Пълно описание"
              minHeight="150px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Условия
            </label>
            <RichTextEditor
              value={formData.terms}
              onChange={(value) => setFormData({ ...formData, terms: value })}
              placeholder="Условия и правила"
              minHeight="150px"
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

          <div className="grid grid-cols-3 gap-3">
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
            onClick={() => navigate('/admin/promotions')}
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

