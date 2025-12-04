import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';
import RichTextEditor from '../../components/RichTextEditor';

interface Service {
  id: string;
  name: string;
}

interface ReviewFormData {
  service_id: string;
  client_name: string;
  avatar_url: string;
  rating: number;
  review_text: string;
  review_date: string;
  is_featured: boolean;
  order_position: number;
}

export default function ReviewForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<ReviewFormData>({
    service_id: '',
    client_name: '',
    avatar_url: '',
    rating: 5,
    review_text: '',
    review_date: '',
    is_featured: false,
    order_position: 0,
  });

  useEffect(() => {
    fetchServices();
    if (isEditing) {
      loadReview();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function fetchServices() {
    const { data } = await supabase
      .from('services')
      .select('id, name')
      .order('name');

    if (data) {
      setServices(data);
    }
  }

  async function loadReview() {
    const { data, error } = await supabase
      .from('service_reviews')
      .select('*')
      .eq('id', id!)
      .single();

    if (error) {
      console.error('Error loading review:', error);
      alert('Грешка при зареждане на отзива');
      navigate('/admin/reviews');
      return;
    }

    if (data) {
      setFormData({
        service_id: data.service_id || '',
        client_name: data.client_name || '',
        avatar_url: data.avatar_url || '',
        rating: data.rating || 5,
        review_text: data.review_text || '',
        review_date: data.review_date || '',
        is_featured: data.is_featured || false,
        order_position: data.order_position || 0,
      });
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.service_id || !formData.client_name || !formData.review_text) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    setSaving(true);

    const reviewData = {
      service_id: formData.service_id,
      client_name: formData.client_name,
      avatar_url: formData.avatar_url || null,
      rating: formData.rating,
      review_text: formData.review_text,
      review_date: formData.review_date || new Date().toISOString().split('T')[0],
      is_featured: formData.is_featured,
      order_position: formData.order_position,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('service_reviews')
          .update(reviewData)
          .eq('id', id!);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('service_reviews').insert([reviewData]);
        if (error) throw error;
      }

      navigate('/admin/reviews');
    } catch (error: any) {
      console.error('Error saving review:', error);
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
          {isEditing ? 'Редактиране на отзив' : 'Нов отзив'}
        </h1>
        <p className="text-gray-700">
          {isEditing ? 'Редактирайте информацията за отзива' : 'Създайте нов отзив'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Услуга <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="">Изберете услуга</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Име на клиента <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <MediaSelector
                value={formData.avatar_url}
                onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                type="image"
                label="Аватар на клиент"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Рейтинг:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`${
                    star <= formData.rating ? 'text-gold-500' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текст на отзива <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.review_text}
              onChange={(value) => setFormData({ ...formData, review_text: value })}
              placeholder="Текст на отзива"
              minHeight="150px"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата на отзива
              </label>
              <input
                type="date"
                value={formData.review_date}
                onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                Топ отзив
              </label>
            </div>
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
            onClick={() => navigate('/admin/reviews')}
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

