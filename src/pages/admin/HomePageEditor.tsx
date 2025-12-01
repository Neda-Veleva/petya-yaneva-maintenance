import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PageBlock {
  id: string;
  page_type_id: string;
  block_type: string;
  block_key: string;
  title: string;
  content: Record<string, any>;
  display_order: number;
  is_visible: boolean;
}

export default function HomePageEditor() {
  const { pageTypeId } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchBlocks();
  }, [pageTypeId]);

  async function fetchBlocks() {
    const { data, error } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_type_id', pageTypeId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching blocks:', error);
    } else {
      setBlocks(data || []);
    }
    setLoading(false);
  }

  async function toggleBlockVisibility(blockId: string, currentState: boolean) {
    const { error } = await supabase
      .from('page_blocks')
      .update({ is_visible: !currentState })
      .eq('id', blockId);

    if (error) {
      console.error('Error toggling visibility:', error);
      alert('Грешка при промяна на видимостта');
      return;
    }

    fetchBlocks();
  }

  function handleEdit(block: PageBlock) {
    setEditingBlock(block.id);
    setFormData({
      title: block.title,
      content: JSON.stringify(block.content, null, 2),
    });
  }

  async function handleSave(blockId: string) {
    setSaving(true);

    let parsedContent = {};
    try {
      parsedContent = JSON.parse(formData.content);
    } catch (e) {
      alert('Невалиден JSON формат');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('page_blocks')
      .update({
        title: formData.title,
        content: parsedContent,
      })
      .eq('id', blockId);

    if (error) {
      console.error('Error updating block:', error);
      alert('Грешка при запазване');
    } else {
      setEditingBlock(null);
      fetchBlocks();
    }

    setSaving(false);
  }

  function handleCancel() {
    setEditingBlock(null);
    setFormData({});
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Зареждане...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/page-types')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-serif text-charcoal-600">Редактирай Home Page</h1>
          <p className="text-gray-600 mt-1">Управление на блокове и съдържание</p>
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all ${
              !block.is_visible ? 'opacity-60' : ''
            }`}
          >
            <div className="p-6">
              {editingBlock === block.id ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-serif text-charcoal-600">
                      Редактирай: {block.block_type}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(block.id)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:bg-gray-300"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Запазване...' : 'Запази'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Отказ
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Заглавие на блок
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Съдържание (JSON)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      rows={12}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Редактирайте съдържанието във формат JSON
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-charcoal-600">
                          {block.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {block.block_type} ({block.block_key})
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleBlockVisibility(block.id, block.is_visible)}
                        className={`p-2 rounded-lg transition-colors ${
                          block.is_visible
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={block.is_visible ? 'Скрий блок' : 'Покажи блок'}
                      >
                        {block.is_visible ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(block)}
                        className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                      >
                        Редактирай
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Текущо съдържание:
                    </h4>
                    <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(block.content, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Няма дефинирани блокове за тази страница</p>
          </div>
        )}
      </div>
    </div>
  );
}
