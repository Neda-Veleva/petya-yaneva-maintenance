import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Service {
  id: string;
  name: string;
  category_name: string;
}

interface TopService {
  id: string;
  service_id: string;
  display_order: number;
  services: {
    name: string;
    service_categories: {
      name: string;
    };
  };
}

export default function TopServicesManager() {
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [topServicesRes, servicesRes] = await Promise.all([
      supabase
        .from('top_services')
        .select('*, services(name, service_categories(name))')
        .order('display_order', { ascending: true }),
      supabase
        .from('services')
        .select('id, name, service_categories(name)')
        .order('name'),
    ]);

    if (topServicesRes.error) {
      console.error('Error fetching top services:', topServicesRes.error);
    } else {
      setTopServices(topServicesRes.data || []);
    }

    if (servicesRes.error) {
      console.error('Error fetching services:', servicesRes.error);
    } else {
      setAllServices(
        (servicesRes.data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          category_name: s.service_categories?.name || '',
        }))
      );
    }

    setLoading(false);
  }

  async function handleAdd() {
    if (!selectedServiceId) return;

    const maxOrder = topServices.length > 0
      ? Math.max(...topServices.map(ts => ts.display_order))
      : 0;

    const { error } = await supabase.from('top_services').insert([
      {
        service_id: selectedServiceId,
        display_order: maxOrder + 1,
      },
    ]);

    if (error) {
      console.error('Error adding top service:', error);
      alert('Грешка при добавяне');
      return;
    }

    setSelectedServiceId('');
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте?')) return;

    const { error } = await supabase.from('top_services').delete().eq('id', id);

    if (error) {
      console.error('Error deleting top service:', error);
      alert('Грешка при изтриване');
      return;
    }

    fetchData();
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  const availableServices = allServices.filter(
    (service) => !topServices.some((ts) => ts.service_id === service.id)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-charcoal-600 mb-2">Топ Услуги</h1>
        <p className="text-gray-600">Показват се на началната страница</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-serif text-charcoal-600 mb-4">Добави услуга</h2>
        <div className="flex gap-4">
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Избери услуга</option>
            {availableServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.category_name})
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!selectedServiceId}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Добави
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-charcoal-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Ред</th>
              <th className="px-6 py-3 text-left">Услуга</th>
              <th className="px-6 py-3 text-left">Категория</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {topServices.map((ts) => (
              <tr key={ts.id} className="border-b border-gray-200">
                <td className="px-6 py-4">{ts.display_order}</td>
                <td className="px-6 py-4 font-medium">{ts.services.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {ts.services.service_categories.name}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(ts.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {topServices.length === 0 && (
          <div className="text-center py-8 text-gray-500">Няма добавени топ услуги</div>
        )}
      </div>
    </div>
  );
}
