import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContactConfig {
  id: string;
  address: string;
  google_maps_link: string | null;
  phone: string;
  email: string | null;
  working_hours: {
    monday_friday?: string;
    saturday?: string;
    sunday?: string;
  };
  social_links: Array<{
    platform: string;
    url: string;
  }>;
}

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'pinterest', label: 'Pinterest' },
];

export default function ContactConfigManager() {
  const [config, setConfig] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    const { data, error } = await supabase
      .from('contact_config')
      .select('*')
      .single();

    // PGRST116 = no rows returned, PGRST205 = table doesn't exist
    if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
      console.error('Error loading contact config:', error);
    }

    // If table doesn't exist (PGRST205), show message
    if (error && error.code === 'PGRST205') {
      console.warn('Contact config table does not exist. Please run the migration.');
      // Still create default config so user can fill it in
      const defaultConfig: ContactConfig = {
        id: '',
        address: '',
        google_maps_link: null,
        phone: '',
        email: null,
        working_hours: {
          monday_friday: '09:00 - 19:00',
          saturday: '10:00 - 18:00',
          sunday: 'Почивен ден',
        },
        social_links: [],
      };
      setConfig(defaultConfig);
      setLoading(false);
      return;
    }

    if (data) {
      setConfig({
        ...data,
        working_hours: data.working_hours || {
          monday_friday: '',
          saturday: '',
          sunday: '',
        },
        social_links: data.social_links || [],
      });
    } else {
      // Create default config if none exists
      const defaultConfig: ContactConfig = {
        id: '',
        address: '',
        google_maps_link: null,
        phone: '',
        email: null,
        working_hours: {
          monday_friday: '09:00 - 19:00',
          saturday: '10:00 - 18:00',
          sunday: 'Почивен ден',
        },
        social_links: [],
      };
      setConfig(defaultConfig);
    }
    setLoading(false);
  }

  async function saveConfig() {
    if (!config) return;

    // Validation
    if (!config.address.trim()) {
      alert('Моля, попълнете адреса');
      return;
    }

    if (!config.phone.trim()) {
      alert('Моля, попълнете телефона');
      return;
    }

    setSaving(true);
    try {
      // Filter out empty social links
      const validSocialLinks = config.social_links.filter(
        (link) => link.platform.trim() !== '' && link.url.trim() !== ''
      );

      const configData = {
        address: config.address.trim(),
        google_maps_link: config.google_maps_link?.trim() || null,
        phone: config.phone.trim(),
        email: config.email?.trim() || null,
        working_hours: {
          monday_friday: config.working_hours.monday_friday?.trim() || null,
          saturday: config.working_hours.saturday?.trim() || null,
          sunday: config.working_hours.sunday?.trim() || null,
        },
        social_links: validSocialLinks,
        updated_at: new Date().toISOString(),
      };

      if (config.id) {
        const { error } = await supabase
          .from('contact_config')
          .update(configData)
          .eq('id', config.id);

      if (error) {
        console.error('Update error:', error);
        if (error.code === 'PGRST205') {
          throw new Error('Таблицата contact_config не съществува. Моля, изпълнете миграцията в Supabase SQL Editor.');
        }
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('contact_config')
        .insert(configData);

      if (error) {
        console.error('Insert error:', error);
        if (error.code === 'PGRST205') {
          throw new Error('Таблицата contact_config не съществува. Моля, изпълнете миграцията в Supabase SQL Editor.');
        }
        throw error;
      }
      await loadConfig();
    }

      alert('Конфигурацията е запазена успешно!');
    } catch (error: any) {
      console.error('Error saving contact config:', error);
      const errorMessage = error?.message || 'Грешка при запазване';
      alert(`Грешка при запазване: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  }

  function updateWorkingHours(field: string, value: string) {
    if (!config) return;
    setConfig({
      ...config,
      working_hours: {
        ...config.working_hours,
        [field]: value,
      },
    });
  }

  function addSocialLink() {
    if (!config) return;
    setConfig({
      ...config,
      social_links: [
        ...config.social_links,
        { platform: '', url: '' },
      ],
    });
  }

  function updateSocialLink(index: number, field: 'platform' | 'url', value: string) {
    if (!config) return;
    const newLinks = [...config.social_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setConfig({ ...config, social_links: newLinks });
  }

  function removeSocialLink(index: number) {
    if (!config) return;
    setConfig({
      ...config,
      social_links: config.social_links.filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!config) {
    return <div className="text-white">Грешка при зареждане на конфигурацията</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-gray-900 mb-2">Конфигурация на контакти</h1>
        <p className="text-gray-700">
          Управление на контактна информация за сайта
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес <span className="text-red-500">*</span>
          </label>
          <textarea
            value={config.address}
            onChange={(e) => setConfig({ ...config, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            rows={3}
            placeholder="ул. Примерна 123, София 1000, България"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Maps линк
          </label>
          <input
            type="text"
            value={config.google_maps_link || ''}
            onChange={(e) => setConfig({ ...config, google_maps_link: e.target.value || null })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            placeholder="https://maps.google.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Може да използвате embed link или share link от Google Maps. За най-добри резултати използвайте директно embed линка от Google Maps (Share → Embed a map).
          </p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <strong>Как да получите embed линк:</strong>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Отворете Google Maps и намерете вашето местоположение</li>
              <li>Кликнете на "Share" (Сподели)</li>
              <li>Изберете "Embed a map" (Вгради карта)</li>
              <li>Копирайте линка от iframe src атрибута</li>
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={config.phone}
              onChange={(e) => setConfig({ ...config, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="+359 888 123 456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={config.email || ''}
              onChange={(e) => setConfig({ ...config, email: e.target.value || null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="info@example.com"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Работно време</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Понеделник - Петък
              </label>
              <input
                type="text"
                value={config.working_hours.monday_friday || ''}
                onChange={(e) => updateWorkingHours('monday_friday', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="09:00 - 19:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Събота
              </label>
              <input
                type="text"
                value={config.working_hours.saturday || ''}
                onChange={(e) => updateWorkingHours('saturday', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="10:00 - 18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Неделя
              </label>
              <input
                type="text"
                value={config.working_hours.sunday || ''}
                onChange={(e) => updateWorkingHours('sunday', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Почивен ден"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Социални мрежи</h3>
            <button
              onClick={addSocialLink}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gold-500 text-white rounded hover:bg-gold-600"
            >
              <Plus className="w-3 h-3" />
              Добави
            </button>
          </div>

          <div className="space-y-2">
            {config.social_links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  className="w-40 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">Избери платформа</option>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="https://..."
                />
                <button
                  onClick={() => removeSocialLink(index)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {config.social_links.length === 0 && (
              <p className="text-sm text-gray-500 italic">Няма добавени социални мрежи</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={saveConfig}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Запазване...' : 'Запази конфигурацията'}
          </button>
        </div>
      </div>
    </div>
  );
}

