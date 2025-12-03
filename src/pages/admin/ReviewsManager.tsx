import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Star, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  service_id: string;
  client_name: string;
  avatar_url?: string;
  rating: number;
  review_text: string;
  review_date: string;
  is_featured: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
  services: {
    name: string;
  };
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('service_reviews')
      .select('*, services(name)')
      .order('order_position', { ascending: true });

    if (error) {
      console.error('Error fetching reviews:', error);
      alert('Грешка при зареждане на отзивите: ' + error.message);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
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


  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Отзиви</h1>
          <p className="text-white">Управление на потребителски отзиви</p>
        </div>
        <Link
          to="/admin/reviews/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нов отзив
        </Link>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {review.avatar_url ? (
                  <img
                    src={review.avatar_url}
                    alt={review.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-semibold">
                    {review.client_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-charcoal-600">{review.client_name}</h3>
                    {review.is_featured && (
                      <span className="px-2 py-0.5 bg-gold-100 text-gold-600 text-xs rounded-full">
                        Топ
                      </span>
                    )}
                  </div>
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
                <Link
                  to={`/admin/reviews/edit/${review.id}`}
                  className="text-gold-500 hover:text-gold-600"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-700">{review.review_text}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                Дата: {new Date(review.review_date || review.created_at).toLocaleDateString('bg-BG')}
              </p>
              <p className="text-sm text-gray-500">
                Ред: {review.order_position}
              </p>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">Няма отзиви</div>
        )}
      </div>
    </div>
  );
}
