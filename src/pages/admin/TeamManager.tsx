import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TeamMember {
  id: string;
  slug: string;
  type: 'person' | 'salon';
  first_name?: string;
  last_name?: string;
  title?: string;
  title_gold?: string;
  badge: string;
  description: string;
  bio: string;
  image_url: string;
  stat_value: string;
  stat_label: string;
  location?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    type: 'person' as 'person' | 'salon',
    first_name: '',
    last_name: '',
    title: '',
    title_gold: '',
    badge: '',
    description: '',
    bio: '',
    image_url: '',
    stat_value: '',
    stat_label: '',
    location: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      alert('Грешка при зареждане на екипа: ' + error.message);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.slug || !formData.badge || !formData.description || !formData.bio || !formData.image_url || !formData.stat_value || !formData.stat_label) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    const saveData = {
      ...formData,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('team_members')
        .update(saveData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating team member:', error);
        alert('Грешка при актуализация: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('team_members').insert([saveData]);

      if (error) {
        console.error('Error creating team member:', error);
        alert('Грешка при създаване: ' + error.message);
        return;
      }
    }

    handleCancel();
    fetchMembers();
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте?')) return;

    const { error } = await supabase.from('team_members').delete().eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      alert('Грешка при изтриване');
      return;
    }

    fetchMembers();
  }

  function handleEdit(member: TeamMember) {
    setEditingId(member.id);
    setShowAddForm(true);
    setSlugEditable(false);
    setFormData({
      slug: member.slug,
      type: member.type,
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      title: member.title || '',
      title_gold: member.title_gold || '',
      badge: member.badge,
      description: member.description,
      bio: member.bio,
      image_url: member.image_url,
      stat_value: member.stat_value,
      stat_label: member.stat_label,
      location: member.location || '',
      is_active: member.is_active,
      display_order: member.display_order,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setSlugEditable(false);
    setFormData({
      slug: '',
      type: 'person',
      first_name: '',
      last_name: '',
      title: '',
      title_gold: '',
      badge: '',
      description: '',
      bio: '',
      image_url: '',
      stat_value: '',
      stat_label: '',
      location: '',
      is_active: true,
      display_order: 0,
    });
  }

  function getMemberName(member: TeamMember): string {
    if (member.type === 'person') {
      return `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.badge;
    } else {
      return member.title || member.badge;
    }
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-charcoal-600">Екип</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нов член
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-serif text-charcoal-600 mb-4">
            {editingId ? 'Редактирай член' : 'Нов член'}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'person' | 'salon' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="person">Лице</option>
                  <option value="salon">Салон</option>
                </select>
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
            </div>

            {formData.type === 'person' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Име</label>
                  <input
                    type="text"
                    placeholder="Име"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
                  <input
                    type="text"
                    placeholder="Заглавие"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Златно заглавие</label>
                  <input
                    type="text"
                    placeholder="Златно заглавие"
                    value={formData.title_gold}
                    onChange={(e) => setFormData({ ...formData, title_gold: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge/Професионално звание <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Badge/Професионално звание"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Кратко описание <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Кратко описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Биография <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Биография"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL на снимка <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="URL на снимка"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статистика стойност <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="нпр. 10+"
                  value={formData.stat_value}
                  onChange={(e) => setFormData({ ...formData, stat_value: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статистика етикет <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="нпр. Години опит"
                  value={formData.stat_label}
                  onChange={(e) => setFormData({ ...formData, stat_label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>

            {formData.type === 'salon' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
                <input
                  type="text"
                  placeholder="Локация"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ред на показване</label>
                <input
                  type="number"
                  placeholder="Ред на показване"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Активен
                </label>
              </div>
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
              <th className="px-6 py-3 text-left">Име/Заглавие</th>
              <th className="px-6 py-3 text-left">Тип</th>
              <th className="px-6 py-3 text-left">Badge</th>
              <th className="px-6 py-3 text-left">Статистика</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-left">Ред</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Няма намерени членове на екипа
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{getMemberName(member)}</td>
                  <td className="px-6 py-4 text-gray-600">{member.type === 'person' ? 'Лице' : 'Салон'}</td>
                  <td className="px-6 py-4 text-gray-600">{member.badge}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {member.stat_value} {member.stat_label}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {member.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{member.display_order}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-gold-500 hover:text-gold-600 mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
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
