import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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


  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-white">Промоции</h1>
        <Link
          to="/admin/promotions/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нова промоция
        </Link>
      </div>


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
                    <Link
                      to={`/admin/promotions/edit/${promo.id}`}
                      className="text-gold-500 hover:text-gold-600 mr-2 inline-block"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
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
