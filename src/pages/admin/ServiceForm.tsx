import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';
import RichTextEditor from '../../components/RichTextEditor';

interface Category {
  id: string;
  name: string;
}

interface ServiceFormData {
  category_id: string;
  slug: string;
  name: string;
  short_description: string;
  full_description: string;
  duration: string;
  price: string;
  image_url: string;
  thumbnail_url: string;
  gallery_images: string[];
  benefits: string[];
  process_steps: string[];
  aftercare_tips: string[];
  is_featured: boolean;
  order_position: number;
}

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

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    category_id: '',
    slug: '',
    name: '',
    short_description: '',
    full_description: '',
    duration: '',
    price: '',
    image_url: '',
    thumbnail_url: '',
    gallery_images: [],
    benefits: [],
    process_steps: [],
    aftercare_tips: [],
    is_featured: false,
    order_position: 0,
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadService();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadCategories() {
    const { data } = await supabase
      .from('service_categories')
      .select('id, name')
      .order('order_position');

    if (data) {
      setCategories(data);
    }
  }

  async function loadService() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id!)
      .single();

    if (error) {
      console.error('Error loading service:', error);
      alert('Грешка при зареждане на услугата');
      navigate('/admin/services');
      return;
    }

    if (data) {
      setSlugEditable(false);
      setFormData({
        category_id: data.category_id || '',
        slug: data.slug || '',
        name: data.name || '',
        short_description: data.short_description || '',
        full_description: data.full_description || '',
        duration: data.duration || '',
        price: data.price || '',
        image_url: data.image_url || '',
        thumbnail_url: data.thumbnail_url || '',
        gallery_images: data.gallery_images || [],
        benefits: data.benefits || [],
        process_steps: data.process_steps || [],
        aftercare_tips: data.aftercare_tips || [],
        is_featured: data.is_featured || false,
        order_position: data.order_position || 0,
      });
    }
    setLoading(false);
  }

  function handleNameChange(name: string) {
    setFormData({ ...formData, name });
  }

  async function handleSave() {
    if (!formData.category_id || !formData.slug || !formData.name || !formData.short_description || !formData.duration || !formData.price || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    setSaving(true);

    const serviceData = {
      category_id: formData.category_id,
      slug: formData.slug,
      name: formData.name,
      short_description: formData.short_description,
      full_description: formData.full_description || null,
      duration: formData.duration,
      price: formData.price,
      image_url: formData.image_url,
      thumbnail_url: formData.thumbnail_url,
      gallery_images: formData.gallery_images,
      benefits: formData.benefits,
      process_steps: formData.process_steps,
      aftercare_tips: formData.aftercare_tips,
      is_featured: formData.is_featured,
      order_position: formData.order_position,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id!);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('services')
        .insert(serviceData);
      error = insertError;
    }

    setSaving(false);

    if (error) {
      console.error('Error saving service:', error);
      alert('Грешка при запазване на услугата: ' + error.message);
    } else {
      navigate('/admin/services');
    }
  }

  function addArrayItem(field: 'gallery_images' | 'benefits' | 'process_steps' | 'aftercare_tips') {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  }

  function updateArrayItem(field: 'gallery_images' | 'benefits' | 'process_steps' | 'aftercare_tips', index: number, value: string) {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  }

  function removeArrayItem(field: 'gallery_images' | 'benefits' | 'process_steps' | 'aftercare_tips', index: number) {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-gray-900 mb-2">
            {isEditing ? 'Редактиране на услуга' : 'Нова услуга'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Редактирайте информацията за услугата' : 'Създайте нова услуга'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Основна информация */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif text-gray-900 border-b pb-2">Основна информация</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
              >
                <option value="">Изберете категория</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Slug (URL)"
                  readOnly={!slugEditable}
                  className={`flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900 ${
                    !slugEditable ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSlugEditable(!slugEditable)}
                  className={`px-4 py-2 border border-gray-300 rounded-xl transition-colors ${
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Име на услугата <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Име на услугата"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Кратко описание <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Кратко описание на услугата"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пълно описание
            </label>
            <RichTextEditor
              value={formData.full_description}
              onChange={(value) => setFormData({ ...formData, full_description: value })}
              placeholder="Пълно описание на услугата"
              minHeight="200px"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Продължителност <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="нпр. 1 ч. 30 мин."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="нпр. 80 лв."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ред на показване
              </label>
              <input
                type="number"
                value={formData.order_position}
                onChange={(e) => setFormData({ ...formData, order_position: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
              />
            </div>
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
              Топ услуга
            </label>
          </div>
        </div>

        {/* Галерия снимки */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-serif text-gray-900">Галерия снимки</h2>
            <button
              type="button"
              onClick={() => addArrayItem('gallery_images')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добави снимка
            </button>
          </div>
          {formData.gallery_images.map((image, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <MediaSelector
                  value={image}
                  onChange={(url) => updateArrayItem('gallery_images', index, url)}
                  type="image"
                  label={`Снимка ${index + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('gallery_images', index)}
                className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Предимства */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-serif text-gray-900">Предимства</h2>
            <button
              type="button"
              onClick={() => addArrayItem('benefits')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добави предимство
            </button>
          </div>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                placeholder="Предимство"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('benefits', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Стъпки на процеса */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-serif text-gray-900">Стъпки на процеса</h2>
            <button
              type="button"
              onClick={() => addArrayItem('process_steps')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добави стъпка
            </button>
          </div>
          {formData.process_steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={step}
                onChange={(e) => updateArrayItem('process_steps', index, e.target.value)}
                placeholder="Стъпка на процеса"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('process_steps', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Съвети за грижа */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-serif text-gray-900">Съвети за грижа</h2>
            <button
              type="button"
              onClick={() => addArrayItem('aftercare_tips')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добави съвет
            </button>
          </div>
          {formData.aftercare_tips.map((tip, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tip}
                onChange={(e) => updateArrayItem('aftercare_tips', index, e.target.value)}
                placeholder="Съвет за грижа"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('aftercare_tips', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Бутони за действие */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Запазване...' : 'Запази'}
          </button>
          <button
            onClick={() => navigate('/admin/services')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
            Отказ
          </button>
        </div>
      </div>
    </div>
  );
}

