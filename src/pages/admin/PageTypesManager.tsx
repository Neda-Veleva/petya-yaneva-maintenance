import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X, FileType, Eye, EyeOff, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PageType {
  id: string;
  name: string;
  slug: string;
  description: string;
  template: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const TEMPLATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'home', label: 'Home Page' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'services-list', label: 'Services List' },
  { value: 'service-category', label: 'Service Category' },
  { value: 'service-detail', label: 'Service Detail' },
  { value: 'promotions', label: 'Promotions' },
  { value: 'blog-list', label: 'Blog List' },
  { value: 'blog-post', label: 'Blog Post' },
  { value: 'team-member', label: 'Team Member' },
  { value: 'contact', label: 'Contact' },
  { value: 'about', label: 'About' },
];

export default function PageTypesManager() {
  const navigate = useNavigate();
  const [pageTypes, setPageTypes] = useState<PageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    template: 'default',
    is_active: true,
    metadata: '{}',
  });

  useEffect(() => {
    fetchPageTypes();
  }, []);

  async function fetchPageTypes() {
    const { data, error } = await supabase
      .from('page_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching page types:', error);
    } else {
      setPageTypes(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    let parsedMetadata = {};
    try {
      parsedMetadata = JSON.parse(formData.metadata);
    } catch (e) {
      alert('Невалиден JSON формат за метаданни');
      return;
    }

    const saveData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      template: formData.template,
      is_active: formData.is_active,
      metadata: parsedMetadata,
    };

    if (editingId) {
      const { error } = await supabase
        .from('page_types')
        .update(saveData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating page type:', error);
        alert('Грешка при актуализация');
        return;
      }
    } else {
      const { error } = await supabase.from('page_types').insert([saveData]);

      if (error) {
        console.error('Error creating page type:', error);
        alert('Грешка при създаване');
        return;
      }
    }

    handleCancel();
    fetchPageTypes();
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този тип страница?')) return;

    const { error } = await supabase.from('page_types').delete().eq('id', id);

    if (error) {
      console.error('Error deleting page type:', error);
      alert('Грешка при изтриване');
      return;
    }

    fetchPageTypes();
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from('page_types')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      console.error('Error toggling active state:', error);
      alert('Грешка при промяна на статуса');
      return;
    }

    fetchPageTypes();
  }

  function handleEdit(pageType: PageType) {
    setEditingId(pageType.id);
    setShowAddForm(true);
    setFormData({
      name: pageType.name,
      slug: pageType.slug,
      description: pageType.description,
      template: pageType.template,
      is_active: pageType.is_active,
      metadata: JSON.stringify(pageType.metadata, null, 2),
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      slug: '',
      description: '',
      template: 'default',
      is_active: true,
      metadata: '{}',
    });
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Типове страници</h1>
          <p className="text-white mt-1">Управление на шаблони и структура на страници</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нов тип страница
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-serif text-white mb-4">
            {editingId ? 'Редактирай тип страница' : 'Нов тип страница'}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Име"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
              <input
                type="text"
                placeholder="Slug (URL идентификатор)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              rows={2}
            />
            <select
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              {TEMPLATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Метаданни (JSON формат)
              </label>
              <textarea
                placeholder='{"key": "value"}'
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                rows={4}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Активна</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
            >
              <Save className="w-4 h-4" />
              Запази
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              <X className="w-4 h-4" />
              Отказ
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {pageTypes.map((pageType) => (
          <div
            key={pageType.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${pageType.is_active ? 'bg-gold-100' : 'bg-gray-100'}`}>
                  <FileType className={`w-6 h-6 ${pageType.is_active ? 'text-gold-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-serif text-charcoal-600">{pageType.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        pageType.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pageType.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{pageType.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>
                      <strong>Slug:</strong> {pageType.slug}
                    </span>
                    <span>
                      <strong>Template:</strong> {pageType.template}
                    </span>
                  </div>
                  {Object.keys(pageType.metadata).length > 0 && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600">
                      {JSON.stringify(pageType.metadata, null, 2)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {pageType.slug === 'home' && (
                  <button
                    onClick={() => navigate(`/admin/page-types/${pageType.id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Редактирай съдържание
                  </button>
                )}
                <button
                  onClick={() => toggleActive(pageType.id, pageType.is_active)}
                  className={`p-2 rounded-lg transition-colors ${
                    pageType.is_active
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={pageType.is_active ? 'Деактивирай' : 'Активирай'}
                >
                  {pageType.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(pageType)}
                  className="p-2 text-gold-500 hover:bg-gold-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pageType.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {pageTypes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileType className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Няма дефинирани типове страници</p>
          </div>
        )}
      </div>
    </div>
  );
}
