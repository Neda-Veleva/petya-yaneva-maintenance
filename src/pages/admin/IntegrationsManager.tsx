import { useState, useEffect } from 'react';
import { Save, RefreshCw, Instagram } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface IntegrationsConfig {
  id: string;
  instagram_username: string | null;
  instagram_access_token: string | null;
  instagram_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export default function IntegrationsManager() {
  const [config, setConfig] = useState<IntegrationsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    const { data, error } = await supabase
      .from('integrations_config')
      .select('*')
      .maybeSingle();

    // PGRST116 = no rows returned, PGRST205 = table doesn't exist
    if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
      console.error('Error loading integrations config:', error);
      setLoading(false);
      return;
    }

    // If table doesn't exist (PGRST205), show message
    if (error && error.code === 'PGRST205') {
      setLoading(false);
      return;
    }

    if (data) {
      setConfig(data);
    } else {
      // Create default config
      const { data: newConfig, error: insertError } = await supabase
        .from('integrations_config')
        .insert({
          instagram_username: null,
          instagram_access_token: null,
          instagram_enabled: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating config:', insertError);
        setLoading(false);
        return;
      } else {
        setConfig(newConfig);
      }
    }

    setLoading(false);
  }

  async function saveConfig() {
    if (!config) return;

    setSaving(true);
    try {
      const configData = {
        instagram_username: config.instagram_username?.trim() || null,
        instagram_access_token: config.instagram_access_token?.trim() || null,
        instagram_enabled: config.instagram_enabled,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('integrations_config')
        .update(configData)
        .eq('id', config.id);

      if (error) {
        console.error('Error saving config:', error);
        alert('Грешка при запазване: ' + error.message);
      } else {
        alert('Конфигурацията е запазена успешно!');
        await loadConfig();
      }
    } catch (error: any) {
      console.error('Error saving config:', error);
      alert('Грешка при запазване: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function syncInstagramImages() {
    if (!config?.instagram_username || !config.instagram_enabled) {
      alert('Моля, попълнете Instagram потребителско име и активирайте интеграцията');
      return;
    }

    setSyncing(true);
    try {
      // Извличане на снимки от Instagram
      // Използваме публичен endpoint или Instagram Basic Display API
      const images = await fetchInstagramImages(config.instagram_username, config.instagram_access_token);
      
      if (!images || images.length === 0) {
        alert('Не са намерени снимки за синхронизация');
        setSyncing(false);
        return;
      }

      // Проверяваме дали снимките вече съществуват в библиотеката
      const { data: existingMedia } = await supabase
        .from('media_library')
        .select('url')
        .eq('type', 'image');

      const existingUrls = new Set(existingMedia?.map(item => item.url) || []);

      // Филтрираме само новите снимки
      const newImages = images.filter((img: any) => !existingUrls.has(img.url));

      if (newImages.length === 0) {
        alert('Всички снимки от Instagram са вече в библиотеката');
        setSyncing(false);
        return;
      }

      // Добавяне на снимките в media_library
      const mediaToInsert = newImages.map((img: any) => ({
        type: 'image' as const,
        title: `Instagram - ${config.instagram_username}`,
        url: img.url,
        thumbnail_url: img.thumbnail_url || img.url,
        alt_text: img.caption || `Instagram image from ${config.instagram_username}`,
      }));

      const { error: insertError } = await supabase
        .from('media_library')
        .insert(mediaToInsert);

      if (insertError) {
        console.error('Error inserting images:', insertError);
        alert('Грешка при добавяне на снимки: ' + insertError.message);
      } else {
        alert(`Успешно добавени ${newImages.length} нови снимки от Instagram!`);
      }
    } catch (error: any) {
      console.error('Error syncing Instagram:', error);
      alert('Грешка при синхронизация: ' + (error.message || 'Неизвестна грешка'));
    } finally {
      setSyncing(false);
    }
  }

  async function fetchInstagramImages(username: string, accessToken: string | null): Promise<any[]> {
    // Ако има access token, използваме Instagram Basic Display API
    if (accessToken) {
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`
        );

        if (!response.ok) {
          throw new Error('Грешка при извличане от Instagram API');
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          return data.data
            .filter((item: any) => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
            .map((item: any) => ({
              url: item.media_url,
              thumbnail_url: item.thumbnail_url || item.media_url,
              caption: item.caption || '',
            }));
        }
      } catch (error) {
        console.error('Error fetching from Instagram API:', error);
        // Fallback към алтернативен метод
      }
    }

    // Алтернативен метод: използваме публичен endpoint или web scraping
    // Забележка: Това може да нарушава Instagram Terms of Service
    // Препоръчително е да се използва официалният API с access token
    try {
      // Използваме публичен RSS feed или друг endpoint
      // Това е временно решение - препоръчително е да се използва Instagram API
      const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`);
      
      if (response.ok) {
        const data = await response.json();
        // Парсване на данните (структурата може да се променя)
        // Това е примерна имплементация
        if (data.graphql?.user?.edge_owner_to_timeline_media?.edges) {
          return data.graphql.user.edge_owner_to_timeline_media.edges
            .slice(0, 12) // Ограничаваме до 12 снимки
            .map((edge: any) => ({
              url: edge.node.display_url,
              thumbnail_url: edge.node.thumbnail_src || edge.node.display_url,
              caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
            }));
        }
      }
    } catch (error) {
      console.error('Error fetching Instagram images:', error);
    }

    // Ако и двата метода не работят, връщаме празен масив
    return [];
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Интеграции</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Таблицата за интеграции не съществува
              </h3>
              <p className="text-sm text-yellow-800 mb-4">
                Моля, изпълнете миграцията в Supabase, за да създадете таблицата <code className="bg-yellow-100 px-2 py-1 rounded">integrations_config</code>.
              </p>
              <div className="text-left bg-white p-4 rounded border border-yellow-200 mt-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Инструкции:</p>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Отворете Supabase Dashboard → SQL Editor</li>
                  <li>Изпълнете SQL скрипта от файла <code className="bg-gray-100 px-1 rounded">supabase/migrations/20251204000001_create_integrations_config_schema.sql</code></li>
                  <li>Или следвайте инструкциите в <code className="bg-gray-100 px-1 rounded">INTEGRATIONS_SETUP.md</code></li>
                  <li>Обновете страницата след изпълнение</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Интеграции</h2>
        <p className="text-gray-300">Конфигурирайте интеграции с външни платформи</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <Instagram className="w-6 h-6 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900">Instagram Интеграция</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={config.instagram_enabled}
                onChange={(e) => setConfig({ ...config, instagram_enabled: e.target.checked })}
                className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
              />
              <span className="text-sm font-medium text-gray-700">Активирай Instagram интеграция</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Когато е активирана, снимките от Instagram профила ще се синхронизират в медиа библиотеката
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Потребителско име
            </label>
            <input
              type="text"
              value={config.instagram_username || ''}
              onChange={(e) => setConfig({ ...config, instagram_username: e.target.value })}
              placeholder="username (без @)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Въведете потребителското име на Instagram профила (без @ символ)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Access Token (опционално)
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={config.instagram_access_token || ''}
                onChange={(e) => setConfig({ ...config, instagram_access_token: e.target.value })}
                placeholder="Access Token (за API достъп)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent pr-20"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
              >
                {showToken ? 'Скрий' : 'Покажи'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Access token за Instagram Basic Display API (не е задължително за публични профили)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={saveConfig}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Запазване...' : 'Запази конфигурацията'}
            </button>

            <button
              onClick={syncInstagramImages}
              disabled={syncing || !config.instagram_enabled || !config.instagram_username}
              className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Синхронизация...' : 'Синхронизирай снимки'}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Как работи?</h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Въведете Instagram потребителското име на профила</li>
            <li>Активирайте интеграцията</li>
            <li>Натиснете "Синхронизирай снимки" за да извлечете снимките</li>
            <li>Снимките ще се добавят автоматично в медиа библиотеката</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

