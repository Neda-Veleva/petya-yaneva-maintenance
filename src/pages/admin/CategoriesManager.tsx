import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';

interface Category {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description: string;
  image_url?: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[а-я]/g, (char) => {
      const map: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
        'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a',
        'ь': 'y', 'ю': 'yu', 'я': 'ya'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    title: '',
    description: '',
    image_url: '',
    order_position: 0,
  });

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

  async function handleSave() {
    if (!formData.name || !formData.slug || !formData.title || !formData.description || !formData.image_url) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    const categoryData = {
      name: formData.name,
      slug: formData.slug,
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      order_position: formData.order_position,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('service_categories')
        .update(categoryData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating category:', error);
        alert('Грешка при актуализация: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('service_categories').insert([categoryData]);

      if (error) {
        console.error('Error creating category:', error);
        alert('Грешка при създаване: ' + error.message);
        return;
      }
    }

    setEditingId(null);
    setShowAddForm(false);
    setSlugEditable(false);
    setFormData({ name: '', slug: '', title: '', description: '', image_url: '', order_position: 0 });
    fetchCategories();
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

  function handleEdit(category: Category) {
    setEditingId(category.id);
    setSlugEditable(false);
    setFormData({
      name: category.name,
      slug: category.slug,
      title: category.title || '',
      description: category.description,
      image_url: category.image_url || '',
      order_position: category.order_position,
    });
  }

  function handleNameChange(name: string) {
    setFormData({ ...formData, name });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setSlugEditable(false);
    setFormData({ name: '', slug: '', title: '', description: '', image_url: '', order_position: 0 });
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-charcoal-600">Категории</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нова категория
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-serif text-charcoal-600 mb-4">
            {editingId ? 'Редактиране на категория' : 'Нова категория'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Име <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Име"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Slug (URL)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  readOnly={!slugEditable}
                  className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 ${
                    !slugEditable ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSlugEditable(!slugEditable)}
                  className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                    slugEditable
                      ? 'bg-gold-500 text-white hover:bg-gold-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={slugEditable ? 'Запази промените' : 'Редактирай slug'}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заглавие <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Заглавие"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <MediaSelector
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                type="image"
                label="Снимка на категорията *"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ред на показване
              </label>
              <input
                type="number"
                placeholder="Ред на показване"
                value={formData.order_position}
                onChange={(e) => setFormData({ ...formData, order_position: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
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
                {editingId === category.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setFormData({ ...formData, name: newName });
                          // Auto-generate slug only if it hasn't been manually edited
                          if (!slugManuallyEdited) {
                            setFormData(prev => ({ ...prev, name: newName, slug: generateSlug(newName) }));
                          }
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          readOnly={!slugEditable}
                          className={`flex-1 px-2 py-1 border border-gray-300 rounded text-gray-900 ${
                            !slugEditable ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setSlugEditable(!slugEditable)}
                          className={`px-2 py-1 border border-gray-300 rounded transition-colors ${
                            slugEditable
                              ? 'bg-gold-500 text-white hover:bg-gold-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded w-full text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.order_position}
                        onChange={(e) => setFormData({ ...formData, order_position: parseInt(e.target.value) || 0 })}
                        className="px-2 py-1 border border-gray-300 rounded w-20 text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-700 mr-2"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-gray-600 hover:text-gray-700">
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
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
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-gold-500 hover:text-gold-600 mr-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
