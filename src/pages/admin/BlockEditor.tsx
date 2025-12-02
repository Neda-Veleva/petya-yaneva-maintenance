import { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import MediaSelector from '../../components/MediaSelector';

interface BlockEditorProps {
  block: {
    id: string;
    block_type: string;
    title: string;
    content: Record<string, any>;
  };
  onSave: (blockId: string, title: string, content: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export default function BlockEditor({ block, onSave, onCancel, saving }: BlockEditorProps) {
  const [title, setTitle] = useState(block.title);
  const [content, setContent] = useState({ ...block.content });

  function updateField(field: string, value: any) {
    setContent({ ...content, [field]: value });
  }

  function addItem(field: string) {
    const currentItems = content[field] || [];
    updateField(field, [...currentItems, {}]);
  }

  function updateItem(field: string, index: number, itemField: string, value: any) {
    const currentItems = [...(content[field] || [])];
    currentItems[index] = { ...currentItems[index], [itemField]: value };
    updateField(field, currentItems);
  }

  function removeItem(field: string, index: number) {
    const currentItems = [...(content[field] || [])];
    currentItems.splice(index, 1);
    updateField(field, currentItems);
  }

  async function handleSave() {
    await onSave(block.id, title, content);
  }

  function isMediaField(key: string): 'image' | 'video' | null {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('image') || lowerKey.includes('img') || lowerKey.includes('photo') || lowerKey.includes('picture') || lowerKey.includes('thumbnail')) {
      return 'image';
    }
    if (lowerKey.includes('video')) {
      return 'video';
    }
    return null;
  }

  function renderField(key: string, value: any): JSX.Element {
    const mediaType = isMediaField(key);

    if (mediaType && typeof value === 'string') {
      return (
        <MediaSelector
          value={value}
          onChange={(url) => updateField(key, url)}
          type={mediaType}
          label={key}
        />
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">{key}</label>
            <button
              onClick={() => addItem(key)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gold-500 text-white rounded hover:bg-gold-600"
            >
              <Plus className="w-3 h-3" />
              Добави
            </button>
          </div>
          {value.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                <button
                  onClick={() => removeItem(key, index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {typeof item === 'object' && item !== null ? (
                Object.entries(item).map(([itemKey, itemValue]) => {
                  const itemMediaType = isMediaField(itemKey);

                  if (itemMediaType && typeof itemValue === 'string') {
                    return (
                      <div key={itemKey}>
                        <MediaSelector
                          value={itemValue}
                          onChange={(url) => updateItem(key, index, itemKey, url)}
                          type={itemMediaType}
                          label={itemKey}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={itemKey}>
                      <label className="block text-xs text-gray-600 mb-1">{itemKey}</label>
                      {typeof itemValue === 'string' && itemValue.length > 100 ? (
                        <textarea
                          value={itemValue as string}
                          onChange={(e) => updateItem(key, index, itemKey, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          value={itemValue as string}
                          onChange={(e) => updateItem(key, index, itemKey, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <input
                  type="text"
                  value={item as string}
                  onChange={(e) => updateItem(key, index, key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              )}
            </div>
          ))}
          {value.length === 0 && (
            <p className="text-sm text-gray-500 italic">Няма добавени елементи</p>
          )}
        </div>
      );
    }

    if (typeof value === 'string') {
      if (value.length > 100 || key.toLowerCase().includes('description') || key.toLowerCase().includes('content')) {
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
            <textarea
              value={value}
              onChange={(e) => updateField(key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>
        );
      }

      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => updateField(key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => updateField(key, parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => updateField(key, e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">{key}</label>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
        <input
          type="text"
          value={JSON.stringify(value)}
          onChange={(e) => {
            try {
              updateField(key, JSON.parse(e.target.value));
            } catch {
              updateField(key, e.target.value);
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-serif text-charcoal-600">
          Редактирай: {block.block_type}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:bg-gray-300"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Запазване...' : 'Запази'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>{renderField(key, value)}</div>
        ))}
      </div>
    </div>
  );
}
