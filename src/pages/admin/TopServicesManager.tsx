import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  thumbnail_url?: string;
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
          <h1 className="text-3xl font-serif text-white mb-2">Топ Услуги</h1>
        <p className="text-white">Показват се на началната страница</p>
        </div>
        <Link
          to="/admin/top-services/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нова топ услуга
        </Link>
      </div>

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
                    <Link
                      to={`/admin/top-services/edit/${ts.id}`}
                      className="text-gold-500 hover:text-gold-600 mr-2 inline-block"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
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
