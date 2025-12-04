import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description: string;
  image_url?: string;
  thumbnail_url?: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}


export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      alert('Грешка при зареждане на категориите: ' + error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }


  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте?')) return;

    const { error } = await supabase.from('service_categories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      alert('Грешка при изтриване');
      return;
    }

    fetchCategories();
  }


  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-white">Категории</h1>
        <Link
          to="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нова категория
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-charcoal-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Име</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Заглавие</th>
              <th className="px-6 py-3 text-left">Описание</th>
              <th className="px-6 py-3 text-left">Ред</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Няма намерени категории
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                  <td className="px-6 py-4 text-gray-600">{category.title || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs">
                    <div className="truncate" title={category.description}>
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{category.order_position}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/categories/edit/${category.id}`}
                      className="text-gold-500 hover:text-gold-600 mr-2 inline-block"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
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
