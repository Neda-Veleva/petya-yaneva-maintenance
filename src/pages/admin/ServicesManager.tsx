import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  short_description?: string;
  full_description?: string;
  price: string;
  duration: string;
  image_url?: string;
  gallery_images?: string[];
  benefits?: string[];
  process_steps?: string[];
  aftercare_tips?: string[];
  is_featured: boolean;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [servicesRes, categoriesRes] = await Promise.all([
      supabase.from('services').select('*').order('order_position'),
      supabase.from('service_categories').select('id, name').order('order_position'),
    ]);

    if (servicesRes.data) {
      setServices(servicesRes.data);
    }
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
    }
    setLoading(false);
  }

  function getCategoryName(categoryId: string): string {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Неизвестна категория';
  }

  async function deleteService(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази услуга?')) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (!error) {
      setServices(services.filter((s) => s.id !== id));
    }
  }

  async function toggleFeatured(id: string, currentValue: boolean) {
    const { error } = await supabase
      .from('services')
      .update({ is_featured: !currentValue })
      .eq('id', id);

    if (!error) {
      setServices(services.map((s) => (s.id === id ? { ...s, is_featured: !currentValue } : s)));
    }
  }

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category_id === selectedCategory);

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
          <h1 className="font-serif text-4xl text-white mb-2">Управление на услуги</h1>
          <p className="text-white">Създавайте, редактирайте и изтривайте услуги</p>
        </div>
        <Link
          to="/admin/services/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Нова услуга
        </Link>
      </div>

      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-900"
        >
          <option value="all">Всички категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Име</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Категория</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Кратко описание</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Цена</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Време</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Топ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ред</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {getCategoryName(service.category_id)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs">
                    <div className="truncate" title={service.short_description}>
                      {service.short_description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{service.price}</td>
                  <td className="px-6 py-4 text-gray-700">{service.duration}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(service.id, service.is_featured)}
                      className={`p-2 rounded-lg transition-colors ${
                        service.is_featured
                          ? 'bg-gold-100 text-gold-600 hover:bg-gold-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {service.is_featured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{service.order_position}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/services/edit/${service.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Няма намерени услуги
          </div>
        )}
      </div>
    </div>
  );
}
