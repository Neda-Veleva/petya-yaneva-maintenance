import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar_url: string;
  specialties: string[];
  years_experience: number;
  display_order: number;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    role: '',
    bio: '',
    avatar_url: '',
    specialties: '',
    years_experience: 0,
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
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    const saveData = {
      ...formData,
      specialties: formData.specialties.split(',').map((s) => s.trim()),
    };

    if (editingId) {
      const { error } = await supabase
        .from('team_members')
        .update(saveData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating team member:', error);
        alert('Грешка при актуализация');
        return;
      }
    } else {
      const { error } = await supabase.from('team_members').insert([saveData]);

      if (error) {
        console.error('Error creating team member:', error);
        alert('Грешка при създаване');
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
    setFormData({
      name: member.name,
      slug: member.slug,
      role: member.role,
      bio: member.bio,
      avatar_url: member.avatar_url,
      specialties: member.specialties.join(', '),
      years_experience: member.years_experience,
      display_order: member.display_order,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      slug: '',
      role: '',
      bio: '',
      avatar_url: '',
      specialties: '',
      years_experience: 0,
      display_order: 0,
    });
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
            <input
              type="text"
              placeholder="Име"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Роля/Позиция"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Биография"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />
            <input
              type="text"
              placeholder="URL на аватар"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Специалности (разделени със запетая)"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Години опит"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Ред на показване"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
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
              <th className="px-6 py-3 text-left">Роля</th>
              <th className="px-6 py-3 text-left">Опит</th>
              <th className="px-6 py-3 text-left">Ред</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium">{member.name}</td>
                <td className="px-6 py-4 text-gray-600">{member.role}</td>
                <td className="px-6 py-4 text-gray-600">{member.years_experience} год.</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
