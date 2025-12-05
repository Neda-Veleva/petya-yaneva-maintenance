import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TeamMember {
  id: string;
  slug: string;
  type: 'person';
  first_name?: string;
  last_name?: string;
  badge: string;
  description: string;
  bio: string;
  image_url: string;
  thumbnail_url?: string;
  stat_value: string;
  stat_label: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('type', 'person')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      alert('Грешка при зареждане на екипа: ' + error.message);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
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


  function getMemberName(member: TeamMember): string {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.badge;
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-white">Екип</h1>
        <Link
          to="/admin/team/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Нов член
        </Link>
      </div>


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
                    <Link
                      to={`/admin/team/edit/${member.id}`}
                      className="text-gold-500 hover:text-gold-600 mr-2 inline-block"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
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
