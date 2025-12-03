import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CTABlock from '../../components/CTABlock';

interface CTABlockData {
  id: string;
  name: string;
  block_type: 'simple_cta' | 'dual_cta' | 'stats_cta';
  content: any;
  is_active: boolean;
  display_order: number;
}

const BLOCK_TYPE_LABELS: Record<string, string> = {
  simple_cta: 'Прост CTA (икона + 1 бутон)',
  dual_cta: 'Двоен CTA (2 бутона)',
  stats_cta: 'CTA със статистики (2 бутона + stats)',
};

export default function CTABlocksManager() {
  const [blocks, setBlocks] = useState<CTABlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewBlock, setPreviewBlock] = useState<CTABlockData | null>(null);

  useEffect(() => {
    loadBlocks();
  }, []);

  async function loadBlocks() {
    const { data } = await supabase
      .from('cta_blocks')
      .select('*')
      .order('display_order');

    if (data) {
      setBlocks(data);
    }

    setLoading(false);
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from('cta_blocks')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (!error) {
      loadBlocks();
    }
  }

  async function deleteBlock(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този блок?')) return;

    const { error } = await supabase.from('cta_blocks').delete().eq('id', id);

    if (!error) {
      loadBlocks();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">CTA Блокове</h2>
          <p className="text-gray-400 mt-1">
            Управление на преизползваеми Call-to-Action блокове
          </p>
        </div>
        <a
          href="/admin/cta-blocks/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Нов блок
        </a>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{block.name}</h3>
                      {!block.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          Неактивен
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{BLOCK_TYPE_LABELS[block.block_type]}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewBlock(previewBlock?.id === block.id ? null : block)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Преглед"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(block.id, block.is_active)}
                      className="p-2 text-gray-600 hover:text-gold-600 transition-colors"
                      title={block.is_active ? 'Деактивирай' : 'Активирай'}
                    >
                      {block.is_active ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`/admin/cta-blocks/edit/${block.id}`}
                      className="p-2 text-gray-600 hover:text-gold-600 transition-colors"
                      title="Редактирай"
                    >
                      <Edit2 className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Изтрий"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Заглавие:</span>
                      <p className="text-gray-600 mt-1">{block.content.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Брой бутони:</span>
                      <p className="text-gray-600 mt-1">{block.content.buttons?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {previewBlock?.id === block.id && (
                <div className="border-t border-gray-200 bg-charcoal-600 p-8">
                  <div className="mb-4 text-center">
                    <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 text-xs rounded">
                      Преглед
                    </span>
                  </div>
                  <CTABlock blockType={block.block_type} content={block.content} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && blocks.length === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">Няма създадени CTA блокове</div>
          <a
            href="/admin/cta-blocks/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Създай първи блок
          </a>
        </div>
      )}
    </div>
  );
}
