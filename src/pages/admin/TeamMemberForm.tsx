import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Edit, Plus, Trash2 } from 'lucide-react';
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

interface TeamMemberFormData {
  slug: string;
  type: 'person' | 'salon';
  first_name: string;
  last_name: string;
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
  display_order: number;
}

export default function TeamMemberForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [mainImages, setMainImages] = useState<string[]>(['']); // Главни снимки
  const [workImages, setWorkImages] = useState<string[]>([]); // Снимки за "Моята работа"
  const [formData, setFormData] = useState<TeamMemberFormData>({
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
    thumbnail_url: '',
    stat_value: '',
    stat_label: '',
    location: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    if (isEditing) {
      loadMember();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadMember() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id!)
      .single();

    if (error) {
      console.error('Error loading team member:', error);
      alert('Грешка при зареждане на член на екипа');
      navigate('/admin/team');
      return;
    }

    if (data) {
      setSlugEditable(false);
      setSlugManuallyEdited(true);
      setFormData({
        slug: data.slug || '',
        type: data.type || 'person',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        title: data.title || '',
        title_gold: data.title_gold || '',
        badge: data.badge || '',
        description: data.description || '',
        bio: data.bio || '',
        image_url: data.image_url || '',
        thumbnail_url: data.thumbnail_url || '',
        stat_value: data.stat_value || '',
        stat_label: data.stat_label || '',
        location: data.location || '',
        is_active: data.is_active ?? true,
        display_order: data.display_order || 0,
      });

      // Зареждане на галерията - разделяне на главни снимки и "Моята работа"
      const { data: galleryData } = await supabase
        .from('team_member_gallery')
        .select('image_url, gallery_type')
        .eq('team_member_id', id!)
        .order('display_order', { ascending: true });

      // Главните снимки - започваме с главната снимка (image_url)
      const mainImagesList: string[] = [];
      if (data.image_url) {
        mainImagesList.push(data.image_url);
      }
      
      // Добавяне на останалите главни снимки от галерията
      if (galleryData && galleryData.length > 0) {
        galleryData
          .filter(item => item.gallery_type === 'main' || !item.gallery_type) // Поддръжка за стари записи без gallery_type
          .forEach((item) => {
            if (item.image_url && item.image_url.trim() !== '' && !mainImagesList.includes(item.image_url)) {
              mainImagesList.push(item.image_url);
            }
          });
      }
      setMainImages(mainImagesList.length > 0 ? mainImagesList : ['']);

      // Снимки за "Моята работа" - само тези с gallery_type = 'work'
      const workImagesList: string[] = [];
      if (galleryData && galleryData.length > 0) {
        galleryData
          .filter(item => item.gallery_type === 'work')
          .forEach((item) => {
            if (item.image_url && item.image_url.trim() !== '') {
              workImagesList.push(item.image_url);
            }
          });
      }
      setWorkImages(workImagesList);
    }
    setLoading(false);
  }

  async function handleSave() {
    // Филтриране на празните снимки - по-строга валидация
    const validMainImages = mainImages.filter(img => {
      return img && typeof img === 'string' && img.trim() !== '' && img.trim().length > 0;
    });
    const validWorkImages = workImages.filter(img => {
      return img && typeof img === 'string' && img.trim() !== '' && img.trim().length > 0;
    });
    
    if (!formData.slug || !formData.badge || !formData.description || !formData.bio || validMainImages.length === 0 || !formData.stat_value || !formData.stat_label) {
      alert('Моля, попълнете всички задължителни полета (включително поне една главна снимка)');
      return;
    }

    setSaving(true);

    // Първата главна снимка е основната
    const mainImage = validMainImages[0]?.trim();
    if (!mainImage || mainImage === '') {
      alert('Моля, добавете поне една валидна главна снимка');
      setSaving(false);
      return;
    }
    
    const otherMainImages = validMainImages.slice(1);

    const saveData = {
      slug: formData.slug,
      type: formData.type,
      first_name: formData.first_name || null,
      last_name: formData.last_name || null,
      title: formData.title || null,
      title_gold: formData.title_gold || null,
      badge: formData.badge,
      description: formData.description,
      bio: formData.bio,
      image_url: mainImage.trim(), // Уверяваме се че няма whitespace
      thumbnail_url: formData.thumbnail_url?.trim() || null,
      stat_value: formData.stat_value,
      stat_label: formData.stat_label,
      location: formData.location || null,
      is_active: formData.is_active,
      display_order: formData.display_order,
      updated_at: new Date().toISOString(),
    };
    
    try {
      let memberId: string;

      if (isEditing) {
        const { data, error } = await supabase
          .from('team_members')
          .update(saveData)
          .eq('id', id!)
          .select()
          .single();

        if (error) throw error;
        memberId = id!;
      } else {
        const { data, error } = await supabase.from('team_members').insert([saveData]).select().single();
        if (error) throw error;
        memberId = data.id;
      }

      // Запазване на галерията - главни снимки и "Моята работа"
      if (isEditing) {
        // Изтриване на старата галерия
        await supabase
          .from('team_member_gallery')
          .delete()
          .eq('team_member_id', memberId);
      }

      // Подготовка на всички снимки за вмъкване
      const allGalleryData: Array<{
        team_member_id: string;
        image_url: string;
        display_order: number;
        gallery_type: 'main' | 'work';
      }> = [];

      // Добавяне на останалите главни снимки (освен първата която е в image_url)
      if (otherMainImages.length > 0) {
        otherMainImages.forEach((imageUrl, index) => {
          allGalleryData.push({
            team_member_id: memberId,
            image_url: imageUrl.trim(),
            display_order: index,
            gallery_type: 'main',
          });
        });
      }

      // Добавяне на снимките за "Моята работа"
      if (validWorkImages.length > 0) {
        validWorkImages.forEach((imageUrl, index) => {
          allGalleryData.push({
            team_member_id: memberId,
            image_url: imageUrl.trim(),
            display_order: index,
            gallery_type: 'work',
          });
        });
      }

      // Вмъкване на всички снимки в галерията
      if (allGalleryData.length > 0) {
        const { error: galleryError } = await supabase
          .from('team_member_gallery')
          .insert(allGalleryData);

        if (galleryError) throw galleryError;
      }

      alert('Членът на екипа е запазен успешно!');
      navigate('/admin/team');
    } catch (error: any) {
      console.error('Error saving team member:', error);
      alert('Грешка при запазване: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  function addMainImage() {
    setMainImages([...mainImages, '']);
  }

  function removeMainImage(index: number) {
    if (mainImages.length > 1) {
      setMainImages(mainImages.filter((_, i) => i !== index));
    }
  }

  function updateMainImage(index: number, url: string) {
    if (!url || typeof url !== 'string') {
      return;
    }
    const newImages = [...mainImages];
    newImages[index] = url.trim();
    setMainImages(newImages);
  }

  function addWorkImage() {
    setWorkImages([...workImages, '']);
  }

  function removeWorkImage(index: number) {
    setWorkImages(workImages.filter((_, i) => i !== index));
  }

  function updateWorkImage(index: number, url: string) {
    const newImages = [...workImages];
    newImages[index] = url;
    setWorkImages(newImages);
  }

  function handleBadgeChange(badge: string) {
    setFormData({ ...formData, badge });
    if (!slugManuallyEdited && !isEditing) {
      setFormData(prev => ({ ...prev, badge, slug: generateSlug(badge) }));
    }
  }

  if (loading) {
    return <div className="text-center py-8">Зареждане...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-gray-900 mb-2">
          {isEditing ? 'Редактирай член' : 'Нов член'}
        </h1>
        <p className="text-gray-700">
          {isEditing ? 'Редактирайте информацията за член на екипа' : 'Създайте нов член на екипа'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
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
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugManuallyEdited(true);
                  }}
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
            <div className="grid grid-cols-2 gap-3">
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
            <div className="grid grid-cols-2 gap-3">
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
              onChange={(e) => handleBadgeChange(e.target.value)}
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
            <RichTextEditor
              value={formData.bio}
              onChange={(value) => setFormData({ ...formData, bio: value })}
              placeholder="Биография"
              minHeight="150px"
            />
          </div>

          <div className="space-y-6">
            {/* Главни снимки */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold text-gray-900">Главни снимки *</h2>
                <button
                  type="button"
                  onClick={addMainImage}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Добави снимка
                </button>
              </div>
              {mainImages.map((image, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <MediaSelector
                      value={image}
                      onChange={(url) => updateMainImage(index, url)}
                      type="image"
                      label={index === 0 ? 'Главна снимка *' : `Главна снимка ${index + 1}`}
                    />
                  </div>
                  {mainImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMainImage(index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Премахни снимка"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-sm text-gray-500">Първата снимка ще бъде използвана като основна. Останалите могат да се използват в Hero секцията.</p>
            </div>

            {/* Моята работа */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold text-gray-900">Моята работа</h2>
                <button
                  type="button"
                  onClick={addWorkImage}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Добави снимка
                </button>
              </div>
              {workImages.length > 0 ? (
                workImages.map((image, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <MediaSelector
                        value={image}
                        onChange={(url) => updateWorkImage(index, url)}
                        type="image"
                        label={`Снимка ${index + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWorkImage(index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Премахни снимка"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Няма добавени снимки за "Моята работа"</p>
              )}
              <p className="text-sm text-gray-500">Тези снимки ще се показват в галерията "Моята работа" на страницата на член на екипа.</p>
            </div>
          </div>

          <div>
            <MediaSelector
              value={formData.thumbnail_url}
              onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
              type="image"
              label="Тъмбнейл за карти (опционално)"
            />
            <p className="text-sm text-gray-500 mt-1">Ако не е зададено, ще се използва главната снимка</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Запазване...' : 'Запази'}
          </button>
          <button
            onClick={() => navigate('/admin/team')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            <X className="w-4 h-4" />
            Отказ
          </button>
        </div>
      </div>
    </div>
  );
}

