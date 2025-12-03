import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CTABlock from '../../components/CTABlock';

const BLOCK_TYPES = [
  { value: 'simple_cta', label: 'Прост CTA (икона + 1 бутон)' },
  { value: 'dual_cta', label: 'Двоен CTA (2 бутона)' },
  { value: 'stats_cta', label: 'CTA със статистики (2 бутона + stats)' },
];

const ICON_OPTIONS = ['star', 'sparkles', 'heart', 'arrow-right'];

export default function CTABlockForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    block_type: 'simple_cta' as 'simple_cta' | 'dual_cta' | 'stats_cta',
    is_active: true,
    display_order: 0,
    content: {
      icon: 'star',
      title: '',
      description: '',
      buttons: [{ text: '', url: '', style: 'primary' as 'primary' | 'secondary', icon: '' }],
      stats: [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
      ],
    },
  });

  useEffect(() => {
    if (id) {
      loadBlock();
    }
  }, [id]);

  async function loadBlock() {
    const { data } = await supabase.from('cta_blocks').select('*').eq('id', id).single();

    if (data) {
      setFormData({
        name: data.name,
        block_type: data.block_type,
        is_active: data.is_active,
        display_order: data.display_order,
        content: data.content,
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const data = {
      name: formData.name,
      block_type: formData.block_type,
      is_active: formData.is_active,
      display_order: formData.display_order,
      content: formData.content,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase.from('cta_blocks').update(data).eq('id', id);

      if (!error) {
        navigate('/admin/cta-blocks');
      }
    } else {
      const { error } = await supabase
        .from('cta_blocks')
        .insert({ ...data, created_at: new Date().toISOString() });

      if (!error) {
        navigate('/admin/cta-blocks');
      }
    }

    setSaving(false);
  }

  function addButton() {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        buttons: [
          ...formData.content.buttons,
          { text: '', url: '', style: 'secondary', icon: '' },
        ],
      },
    });
  }

  function removeButton(index: number) {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        buttons: formData.content.buttons.filter((_, i) => i !== index),
      },
    });
  }

  function updateButton(index: number, field: string, value: string) {
    const buttons = [...formData.content.buttons];
    buttons[index] = { ...buttons[index], [field]: value };
    setFormData({
      ...formData,
      content: { ...formData.content, buttons },
    });
  }

  function updateStat(index: number, field: string, value: string) {
    const stats = [...formData.content.stats];
    stats[index] = { ...stats[index], [field]: value };
    setFormData({
      ...formData,
      content: { ...formData.content, stats },
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/cta-blocks')}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {id ? 'Редактиране на CTA блок' : 'Нов CTA блок'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Основна информация</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Име на блока *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Напр. CTA блок за начална страница"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип блок *</label>
              <select
                value={formData.block_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    block_type: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                {BLOCK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Позиция (order)
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                Активен
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Съдържание</h3>

          {(formData.block_type === 'simple_cta' || formData.block_type === 'stats_cta') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Икона</label>
              <select
                value={formData.content.icon}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, icon: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие *</label>
            <input
              type="text"
              required
              value={formData.content.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, title: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="Напр. Готови за промяна?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание *</label>
            <textarea
              required
              rows={3}
              value={formData.content.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, description: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="Описание на блока"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Бутони</label>
              {formData.content.buttons.length < 2 && (
                <button
                  type="button"
                  onClick={addButton}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gold-500 hover:bg-gold-600 text-white rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Добави бутон
                </button>
              )}
            </div>

            <div className="space-y-4">
              {formData.content.buttons.map((button, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Бутон {index + 1}</span>
                    {formData.content.buttons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeButton(index)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={button.text}
                      onChange={(e) => updateButton(index, 'text', e.target.value)}
                      placeholder="Текст на бутона"
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={button.url}
                      onChange={(e) => updateButton(index, 'url', e.target.value)}
                      placeholder="URL (напр. /contact)"
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <select
                      value={button.style}
                      onChange={(e) => updateButton(index, 'style', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="primary">Primary (золотист)</option>
                      <option value="secondary">Secondary (outline)</option>
                    </select>
                    <select
                      value={button.icon || ''}
                      onChange={(e) => updateButton(index, 'icon', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Без икона</option>
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {formData.block_type === 'stats_cta' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Статистики</label>
              <div className="grid grid-cols-2 gap-4">
                {formData.content.stats.map((stat, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="Напр. 500+"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Напр. Доволни клиенти"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Запазване...' : 'Запази блок'}
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Скрий преглед' : 'Покажи преглед'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/cta-blocks')}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Откажи
          </button>
        </div>
      </form>

      {showPreview && (
        <div className="bg-charcoal-600 rounded-xl p-8 border border-gold-500/20">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-400 text-sm rounded">
              Преглед на блока
            </span>
          </div>
          <CTABlock blockType={formData.block_type} content={formData.content} />
        </div>
      )}
    </div>
  );
}
