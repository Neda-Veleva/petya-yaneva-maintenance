import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SalonInfo {
  id: string;
  slug: string;
  title: string;
  title_gold?: string;
  badge: string;
  description: string;
  bio: string;
  image_url: string;
  thumbnail_url?: string;
  stat_value: string;
  stat_label: string;
  location?: string;
  is_active: boolean;
}

export default function SalonManager() {
  const [salons, setSalons] = useState<SalonInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalons();
  }, []);

  async function loadSalons() {
    const { data } = await supabase
      .from('salon_info')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setSalons(data);
    }

    setLoading(false);
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from('salon_info')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (!error) {
      loadSalons();
    }
  }

  async function deleteSalon(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този салон?')) return;

    const { error } = await supabase.from('salon_info').delete().eq('id', id);

    if (!error) {
      loadSalons();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Информация за Салона</h2>
          <p className="text-gray-400 mt-1">
            Управление на информацията за салона (обикновено трябва да има само един активен)
          </p>
        </div>
        <a
          href="/admin/salon/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Нов салон
        </a>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {salons.map((salon) => (
            <div
              key={salon.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex">
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={salon.thumbnail_url || salon.image_url}
                    alt={salon.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {salon.title}
                          {salon.title_gold && (
                            <span className="text-gold-500 ml-2">{salon.title_gold}</span>
                          )}
                        </h3>
                        {!salon.is_active && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            Неактивен
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{salon.badge}</p>
                      <p className="text-sm text-gray-700 mb-3">{salon.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          <strong>Статистика:</strong> {salon.stat_value} - {salon.stat_label}
                        </span>
                        {salon.location && (
                          <span>
                            <strong>Локация:</strong> {salon.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(salon.id, salon.is_active)}
                        className="p-2 text-gray-600 hover:text-gold-600 transition-colors"
                        title={salon.is_active ? 'Деактивирай' : 'Активирай'}
                      >
                        {salon.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={`/admin/salon/edit/${salon.id}`}
                        className="p-2 text-gray-600 hover:text-gold-600 transition-colors"
                        title="Редактирай"
                      >
                        <Edit2 className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteSalon(salon.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Изтрий"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div
                      className="rich-content text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: salon.bio }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && salons.length === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">Няма създадена информация за салон</div>
          <a
            href="/admin/salon/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Създай информация за салона
          </a>
        </div>
      )}
    </div>
  );
}
