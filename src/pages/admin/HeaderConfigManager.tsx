import { useState, useEffect } from 'react';
import { Save, Plus, Edit2, Trash2, X, ChevronRight, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';

interface HeaderConfig {
  id: string;
  logo_url: string | null;
  cta_button_text: string;
  cta_button_url: string;
}

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
}

interface AvailablePage {
  id: string;
  title: string;
  url: string;
  page_type: string;
}

export default function HeaderConfigManager() {
  const [config, setConfig] = useState<HeaderConfig | null>(null);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [availablePages, setAvailablePages] = useState<AvailablePage[]>([]);
  const [editingNav, setEditingNav] = useState<string | null>(null);
  const [isAddingNav, setIsAddingNav] = useState(false);
  const [saving, setSaving] = useState(false);

  const [navForm, setNavForm] = useState({
    label: '',
    url: '',
    parent_id: null as string | null,
    display_order: 0,
    is_active: true,
    use_custom_url: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [configRes, navRes, pagesRes] = await Promise.all([
      supabase.from('header_config').select('*').single(),
      supabase.from('navigation_items').select('*').order('display_order'),
      supabase.from('available_pages').select('*').order('title'),
    ]);

    if (configRes.data) setConfig(configRes.data);
    if (navRes.data) setNavItems(navRes.data);
    if (pagesRes.data) setAvailablePages(pagesRes.data);
  }

  async function saveConfig() {
    if (!config) return;

    setSaving(true);
    const { error } = await supabase
      .from('header_config')
      .update({
        logo_url: config.logo_url,
        cta_button_text: config.cta_button_text,
        cta_button_url: config.cta_button_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', config.id);

    setSaving(false);

    if (error) {
      alert('Грешка при запазване');
    } else {
      alert('Конфигурацията е запазена успешно!');
    }
  }

  async function saveNavItem() {
    const data = {
      label: navForm.label,
      url: navForm.use_custom_url ? navForm.url : navForm.url,
      parent_id: navForm.parent_id || null,
      display_order: navForm.display_order,
      is_active: navForm.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editingNav) {
      const { error } = await supabase
        .from('navigation_items')
        .update(data)
        .eq('id', editingNav);

      if (!error) {
        setEditingNav(null);
        loadData();
      }
    } else {
      const { error } = await supabase
        .from('navigation_items')
        .insert({ ...data, created_at: new Date().toISOString() });

      if (!error) {
        setIsAddingNav(false);
        setNavForm({
          label: '',
          url: '',
          parent_id: null,
          display_order: 0,
          is_active: true,
          use_custom_url: false,
        });
        loadData();
      }
    }
  }

  async function deleteNavItem(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този елемент?')) return;

    const { error } = await supabase.from('navigation_items').delete().eq('id', id);

    if (!error) {
      loadData();
    }
  }

  function startEditNav(item: NavigationItem) {
    setEditingNav(item.id);
    setNavForm({
      label: item.label,
      url: item.url,
      parent_id: item.parent_id,
      display_order: item.display_order,
      is_active: item.is_active,
      use_custom_url: !availablePages.find((p) => p.url === item.url),
    });
  }

  const parentItems = navItems.filter((item) => !item.parent_id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Конфигурация на Header</h2>
      </div>

      {config && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Лого и CTA Бутон</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Лого</label>
            <MediaSelector
              value={config.logo_url || ''}
              onChange={(url) => setConfig({ ...config, logo_url: url })}
              label="Избери лого"
            />
            {config.logo_url && (
              <div className="mt-3">
                <img
                  src={config.logo_url}
                  alt="Logo preview"
                  className="h-16 object-contain bg-gray-900 p-2 rounded"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текст на бутона
              </label>
              <input
                type="text"
                value={config.cta_button_text}
                onChange={(e) => setConfig({ ...config, cta_button_text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL на бутона
              </label>
              <input
                type="text"
                value={config.cta_button_url}
                onChange={(e) => setConfig({ ...config, cta_button_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
          </div>

          <button
            onClick={saveConfig}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Запазване...' : 'Запази конфигурацията'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Навигационно меню</h3>
          <button
            onClick={() => setIsAddingNav(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добави елемент
          </button>
        </div>

        {(isAddingNav || editingNav) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Текст на линка
                </label>
                <input
                  type="text"
                  value={navForm.label}
                  onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
                  placeholder="Напр. Начало"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={navForm.use_custom_url}
                    onChange={(e) =>
                      setNavForm({ ...navForm, use_custom_url: e.target.checked, url: '' })
                    }
                    className="rounded"
                  />
                  Използвай custom URL
                </label>

                {navForm.use_custom_url ? (
                  <input
                    type="text"
                    value={navForm.url}
                    onChange={(e) => setNavForm({ ...navForm, url: e.target.value })}
                    placeholder="Напр. /my-page или https://external.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <select
                    value={navForm.url}
                    onChange={(e) => setNavForm({ ...navForm, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="">Избери страница</option>
                    {availablePages.map((page) => (
                      <option key={page.id} value={page.url}>
                        {page.title} ({page.url})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Родителски елемент
                  </label>
                  <select
                    value={navForm.parent_id || ''}
                    onChange={(e) =>
                      setNavForm({ ...navForm, parent_id: e.target.value || null })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="">Без родител (основно ниво)</option>
                    {parentItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Позиция</label>
                  <input
                    type="number"
                    value={navForm.display_order}
                    onChange={(e) =>
                      setNavForm({ ...navForm, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={navForm.is_active}
                    onChange={(e) => setNavForm({ ...navForm, is_active: e.target.checked })}
                    className="rounded"
                  />
                  Активен
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveNavItem}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Запази
                </button>
                <button
                  onClick={() => {
                    setIsAddingNav(false);
                    setEditingNav(null);
                    setNavForm({
                      label: '',
                      url: '',
                      parent_id: null,
                      display_order: 0,
                      is_active: true,
                      use_custom_url: false,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Откажи
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {parentItems.map((item) => {
            const children = navItems.filter((i) => i.parent_id === item.id);
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.url}</div>
                    </div>
                    {!item.is_active && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                        Неактивен
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditNav(item)}
                      className="p-2 text-gray-600 hover:text-gold-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNavItem(item.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {children.length > 0 && (
                  <div className="border-t border-gray-200">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-4 pl-12 bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">{child.label}</div>
                            <div className="text-xs text-gray-500">{child.url}</div>
                          </div>
                          {!child.is_active && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                              Неактивен
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditNav(child)}
                            className="p-2 text-gray-600 hover:text-gold-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteNavItem(child.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
