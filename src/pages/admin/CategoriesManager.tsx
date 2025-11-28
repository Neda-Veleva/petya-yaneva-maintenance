import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (editingId) {
      const { error } = await supabase
        .from('service_categories')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating category:', error);
        alert('Грешка при актуализация');
        return;
      }
    } else {
      const { error } = await supabase.from('service_categories').insert([formData]);

      if (error) {
        console.error('Error creating category:', error);
        alert('Грешка при създаване');
        return;
      }
    }

    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', slug: '', description: '', display_order: 0 });
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
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      display_order: category.display_order,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', slug: '', description: '', display_order: 0 });
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
          <h2 className="text-xl font-serif text-charcoal-600 mb-4">Нова категория</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Име"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg col-span-2"
              rows={3}
            />
            <input
              type="number"
              placeholder="Ред на показване"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
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
              <th className="px-6 py-3 text-left">Описание</th>
              <th className="px-6 py-3 text-left">Ред</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-200">
                {editingId === category.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                        className="px-2 py-1 border border-gray-300 rounded w-20"
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
                    <td className="px-6 py-4 font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                    <td className="px-6 py-4 text-gray-600">{category.description}</td>
                    <td className="px-6 py-4 text-gray-600">{category.display_order}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
