import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaSelector from '../../components/MediaSelector';
import RichTextEditor from '../../components/RichTextEditor';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  year: string;
  image_url: string;
  display_order: number;
}

interface SalonFormData {
  slug: string;
  title: string;
  title_gold: string;
  badge: string;
  description: string;
  bio: string;
  image_url: string;
  thumbnail_url: string;
  stat_value: string;
  stat_label: string;
  location: string;
  is_active: boolean;
}

export default function SalonForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [formData, setFormData] = useState<SalonFormData>({
    slug: '',
    title: '',
    title_gold: '',
    badge: '',
    description: '',
    bio: '',
    image_url: '',
    thumbnail_url: '',
    stat_value: '',
    stat_label: '',
    location: '',
    is_active: true,
  });

  useEffect(() => {
    if (isEditing) {
      loadSalon();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadSalon() {
    const { data: salonData } = await supabase
      .from('salon_info')
      .select('*')
      .eq('id', id)
      .single();

    if (salonData) {
      setFormData(salonData);
      setSlugManuallyEdited(true);
    }

    const { data: certsData } = await supabase
      .from('salon_certificates')
      .select('*')
      .eq('salon_id', id)
      .order('display_order');

    if (certsData) {
      setCertificates(certsData);
    }

    setLoading(false);
  }

  function handleTitleChange(value: string) {
    setFormData((prev) => ({ ...prev, title: value }));
    if (!slugManuallyEdited) {
      const newSlug = generateSlug(value);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let salonId = id;

      if (isEditing) {
        const { error } = await supabase
          .from('salon_info')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('salon_info')
          .insert({
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        salonId = data.id;
      }

      if (isEditing) {
        const { error: deleteError } = await supabase
          .from('salon_certificates')
          .delete()
          .eq('salon_id', id);

        if (deleteError) throw deleteError;
      }

      if (certificates.length > 0 && salonId) {
        const certsToInsert = certificates.map((cert, index) => ({
          salon_id: salonId,
          title: cert.title,
          issuer: cert.issuer,
          year: cert.year,
          image_url: cert.image_url,
          display_order: index,
        }));

        const { error: certsError } = await supabase
          .from('salon_certificates')
          .insert(certsToInsert);

        if (certsError) throw certsError;
      }

      navigate('/admin/salon');
    } catch (error) {
      console.error('Error saving salon:', error);
      alert('Грешка при запазване на салона');
    } finally {
      setSaving(false);
    }
  }

  function addCertificate() {
    setCertificates([
      ...certificates,
      { title: '', issuer: '', year: '', image_url: '', display_order: certificates.length },
    ]);
  }

  function updateCertificate(index: number, field: keyof Certificate, value: string) {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    setCertificates(updated);
  }

  function removeCertificate(index: number) {
    setCertificates(certificates.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? 'Редактиране на салон' : 'Нов салон'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Основна информация</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заглавие *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Напр. Салон"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Златно заглавие
              </label>
              <input
                type="text"
                value={formData.title_gold}
                onChange={(e) => setFormData({ ...formData, title_gold: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Напр. LIVON"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugManuallyEdited(true);
                  }}
                  disabled={!slugEditable && isEditing}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-100"
                  placeholder="salon-livon"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setSlugEditable(!slugEditable)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    {slugEditable ? <X className="w-4 h-4" /> : 'Редактирай'}
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Бадж *</label>
              <input
                type="text"
                required
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Напр. Луксозна грижа за красота"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Кратко описание *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Кратко описание на салона"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статистика (стойност) *
              </label>
              <input
                type="text"
                required
                value={formData.stat_value}
                onChange={(e) => setFormData({ ...formData, stat_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Напр. 100%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статистика (етикет) *
              </label>
              <input
                type="text"
                required
                value={formData.stat_label}
                onChange={(e) => setFormData({ ...formData, stat_label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Напр. Качествени продукти"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Напр. София, България"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Активен
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Пълно описание</h3>
          <RichTextEditor
            value={formData.bio}
            onChange={(value) => setFormData({ ...formData, bio: value })}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Изображения</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Главна снимка *
            </label>
            <MediaSelector
              onSelect={(url) => setFormData({ ...formData, image_url: url })}
              selectedUrl={formData.image_url}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail снимка
            </label>
            <MediaSelector
              onSelect={(url) => setFormData({ ...formData, thumbnail_url: url })}
              selectedUrl={formData.thumbnail_url}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Сертификати</h3>
            <button
              type="button"
              onClick={addCertificate}
              className="flex items-center gap-2 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Добави сертификат
            </button>
          </div>

          {certificates.length === 0 && (
            <p className="text-sm text-gray-500">Няма добавени сертификати</p>
          )}

          <div className="space-y-4">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Сертификат {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCertificate(index)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => updateCertificate(index, 'title', e.target.value)}
                    placeholder="Име на сертификат"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                    placeholder="Издател"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => updateCertificate(index, 'year', e.target.value)}
                    placeholder="Година"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <MediaSelector
                  onSelect={(url) => updateCertificate(index, 'image_url', url)}
                  selectedUrl={cert.image_url}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Запазване...' : 'Запази'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/salon')}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Откажи
          </button>
        </div>
      </form>
    </div>
  );
}
