import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import MediaSelector from '../../components/MediaSelector';
import { supabase } from '../../lib/supabase';

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
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    if (block.block_type === 'services') {
      loadServices();
    }
  }, [block.block_type]);

  async function loadServices() {
    setLoadingServices(true);
    const { data, error } = await supabase
      .from('services')
      .select('id, name')
      .order('name', { ascending: true });

    if (!error && data) {
      setServices(data);
    }
    setLoadingServices(false);
  }

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

  interface ReviewsBlockContent {
    title?: string;
    subtitle?: string;
    stats?: Array<{ label: string; value: string }>;
    reviews_count?: number;
    button_text?: string;
    button_url?: string;
    final_rating_text?: string;
    final_opinion_text?: string;
  }

  interface ServicesBlockContent {
    title?: string;
    subtitle?: string;
    service_ids?: string[];
    button_text?: string;
    button_url?: string;
  }

  function renderReviewsBlockEditor() {
    const reviewsContent = content as ReviewsBlockContent;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
          <input
            type="text"
            value={reviewsContent.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            placeholder="Отзиви от клиенти"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Подзаглавие</label>
          <textarea
            value={reviewsContent.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            rows={2}
            placeholder="Вижте какво споделят нашите клиенти за техния опит с нас"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Статистики</label>
          <div className="space-y-2">
            {(reviewsContent.stats || []).map((stat, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...(reviewsContent.stats || [])];
                    newStats[index] = { ...newStats[index], label: e.target.value };
                    updateField('stats', newStats);
                  }}
                  placeholder="Етикет"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...(reviewsContent.stats || [])];
                    newStats[index] = { ...newStats[index], value: e.target.value };
                    updateField('stats', newStats);
                  }}
                  placeholder="Стойност"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
                <button
                  onClick={() => {
                    const newStats = (reviewsContent.stats || []).filter((_, i) => i !== index);
                    updateField('stats', newStats);
                  }}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newStats = [...(reviewsContent.stats || []), { label: '', value: '' }];
                updateField('stats', newStats);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gold-500 text-white rounded hover:bg-gold-600"
            >
              <Plus className="w-3 h-3" />
              Добави статистика
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Брой отзиви за показване</label>
          <input
            type="number"
            value={reviewsContent.reviews_count || 6}
            onChange={(e) => updateField('reviews_count', parseInt(e.target.value) || 6)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            min="1"
            max="20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст на бутона</label>
            <input
              type="text"
              value={reviewsContent.button_text || ''}
              onChange={(e) => updateField('button_text', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="Виж всички"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL на бутона</label>
            <input
              type="text"
              value={reviewsContent.button_url || ''}
              onChange={(e) => updateField('button_url', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="/reviews"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Текст под рейтинга</label>
          <input
            type="text"
            value={reviewsContent.final_rating_text || ''}
            onChange={(e) => updateField('final_rating_text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            placeholder="Базирано на 500+ отзива"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Текст за мнение</label>
          <textarea
            value={reviewsContent.final_opinion_text || ''}
            onChange={(e) => updateField('final_opinion_text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            rows={3}
            placeholder="Вашето мнение е важно за нас! Споделете вашия опит и помогнете на други клиенти да направят избор."
          />
        </div>
      </div>
    );
  }

  function renderServicesBlockEditor() {
    const servicesContent = content as ServicesBlockContent;
    const selectedServiceIds = servicesContent.service_ids || [];

    function updateServiceId(index: number, serviceId: string) {
      const newServiceIds = [...selectedServiceIds];
      if (serviceId) {
        newServiceIds[index] = serviceId;
      } else {
        newServiceIds.splice(index, 1);
      }
      updateField('service_ids', newServiceIds.filter(id => id && id.trim() !== ''));
    }

    function removeService(index: number) {
      const newServiceIds = selectedServiceIds.filter((_, i) => i !== index);
      updateField('service_ids', newServiceIds);
    }

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Заглавие</label>
          <input
            type="text"
            value={servicesContent.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            placeholder="Нашите услуги"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Подзаглавие</label>
          <textarea
            value={servicesContent.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            rows={2}
            placeholder="Открийте селекцията ни от прецизно изпълнени терапии"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Избрани услуги (максимум 3)</label>
          {loadingServices ? (
            <p className="text-sm text-gray-500">Зареждане на услуги...</p>
          ) : (
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={selectedServiceIds[index] || ''}
                    onChange={(e) => updateServiceId(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="">Изберете услуга</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  {selectedServiceIds[index] && (
                    <button
                      onClick={() => removeService(index)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст на бутона</label>
            <input
              type="text"
              value={servicesContent.button_text || ''}
              onChange={(e) => updateField('button_text', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="Виж всички услуги"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL на бутона</label>
            <input
              type="text"
              value={servicesContent.button_url || ''}
              onChange={(e) => updateField('button_url', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="/services"
            />
          </div>
        </div>
      </div>
    );
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
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          value={itemValue as string}
                          onChange={(e) => updateItem(key, index, itemKey, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
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
        <h3 className="text-xl font-serif text-white">
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

      {block.block_type === 'reviews' ? (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {renderReviewsBlockEditor()}
        </div>
      ) : block.block_type === 'services' ? (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {renderServicesBlockEditor()}
        </div>
      ) : (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>{renderField(key, value)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
