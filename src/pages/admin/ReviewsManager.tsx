import { useState, useEffect } from 'react';
import { Edit2, Trash2, Save, X, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  service_id: string;
  author_name: string;
  author_avatar: string;
  rating: number;
  comment: string;
  created_at: string;
  services: {
    name: string;
  };
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('service_reviews')
      .select('*, services(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editingId) return;

    const { error } = await supabase
      .from('service_reviews')
      .update({
        rating: formData.rating,
        comment: formData.comment,
      })
      .eq('id', editingId);

    if (error) {
      console.error('Error updating review:', error);
      alert('Грешка при актуализация');
      return;
    }

    handleCancel();
    fetchReviews();
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте?')) return;

    const { error } = await supabase.from('service_reviews').delete().eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      alert('Грешка при изтриване');
      return;
    }

    fetchReviews();
  }

  function handleEdit(review: Review) {
    setEditingId(review.id);
    setFormData({
      rating: review.rating,
      comment: review.comment,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({
      rating: 5,
      comment: '',
    });
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-charcoal-600 mb-2">Отзиви</h1>
        <p className="text-gray-600">Управление на потребителски отзиви</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
            {editingId === review.id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Рейтинг:</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
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
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                />
                <div className="flex gap-2">
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
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.author_avatar}
                      alt={review.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-charcoal-600">{review.author_name}</h3>
                      <p className="text-sm text-gray-600">{review.services.name}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-gold-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-gold-500 hover:text-gold-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString('bg-BG')}
                </p>
              </>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">Няма отзиви</div>
        )}
      </div>
    </div>
  );
}
