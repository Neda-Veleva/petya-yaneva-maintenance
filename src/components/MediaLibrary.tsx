import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Video as VideoIcon, Trash2, Search, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  url: string;
  thumbnail_url: string;
  alt_text: string;
  created_at: string;
}

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  mediaType?: 'image' | 'video' | 'all';
}

export default function MediaLibrary({ isOpen, onClose, onSelect, mediaType = 'all' }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>(mediaType === 'video' ? 'video' : 'image');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [showAddImageUrl, setShowAddImageUrl] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, activeTab]);

  async function fetchMedia(skipSync = false) {
    setLoading(true);
    
    // Първо синхронизираме файловете от storage с базата данни (само ако не е ръчна синхронизация)
    if (activeTab === 'image' && !skipSync) {
      await syncStorageFiles(true);
    }
    
    const query = supabase
      .from('media_library')
      .select('*')
      .eq('type', activeTab)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching media:', error);
    } else {
      setMedia(data || []);
    }
    setLoading(false);
  }

  async function syncStorageFiles(silent = false) {
    if (!silent) {
      setSyncing(true);
    }
    try {
      // Вземаме всички файлове от storage bucket
      const { data: files, error: listError } = await supabase.storage
        .from('media')
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) {
        console.error('Error listing storage files:', listError);
        if (!silent) {
          alert('Грешка при зареждане на файлове от storage: ' + listError.message);
        }
        if (!silent) {
          setSyncing(false);
        }
        return;
      }

      if (!files || files.length === 0) {
        if (!silent) {
          setSyncing(false);
        }
        return;
      }

      // Вземаме всички URL-и от базата данни
      const { data: existingMedia } = await supabase
        .from('media_library')
        .select('url')
        .eq('type', 'image');

      const existingUrls = new Set(
        existingMedia?.map(item => {
          // Извличаме името на файла от URL
          const urlParts = item.url.split('/');
          return urlParts[urlParts.length - 1].split('?')[0]; // Премахваме query параметрите
        }) || []
      );

      // Добавяме липсващите файлове в базата данни
      const filesToAdd = files.filter(file => {
        // Пропускаме папки
        if (!file.name || file.id === null) return false;
        return !existingUrls.has(file.name);
      });

      if (filesToAdd.length > 0) {
        const mediaToInsert = filesToAdd.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(file.name);

          return {
            type: 'image' as const,
            title: file.name,
            url: publicUrl,
            thumbnail_url: publicUrl,
            file_name: file.name,
            file_size: file.metadata?.size || 0,
            mime_type: file.metadata?.mimetype || '',
            alt_text: file.name,
          };
        });

        const { error: insertError } = await supabase
          .from('media_library')
          .insert(mediaToInsert);

        if (insertError) {
          console.error('Error syncing storage files:', insertError);
          if (!silent) {
            alert('Грешка при синхронизация: ' + insertError.message);
          }
        } else {
          // Презареждаме медиите след синхронизация (без повторна синхронизация)
          const query = supabase
            .from('media_library')
            .select('*')
            .eq('type', activeTab)
            .order('created_at', { ascending: false });

          const { data, error } = await query;
          if (!error && data) {
            setMedia(data);
          }
          
          if (!silent && filesToAdd.length > 0) {
            alert(`Синхронизирани ${filesToAdd.length} нови файла от storage`);
          }
        }
      } else {
        if (!silent) {
          alert('Всички файлове от storage са вече в библиотеката');
        }
      }
    } catch (error: any) {
      console.error('Error in syncStorageFiles:', error);
      if (!silent) {
        alert('Грешка при синхронизация: ' + (error.message || 'Неизвестна грешка'));
      }
    } finally {
      if (!silent) {
        setSyncing(false);
      }
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      alert('Грешка при качване на файл');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('media_library')
      .insert({
        type: 'image',
        title: file.name,
        url: publicUrl,
        thumbnail_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      });

    if (dbError) {
      console.error('Error saving to database:', dbError);
      alert('Грешка при запазване в базата данни');
    } else {
      fetchMedia();
    }

    setUploading(false);
    event.target.value = '';
  }

  async function handleAddImageUrl() {
    if (!imageUrl || !imageTitle) {
      alert('Моля въведете URL и заглавие');
      return;
    }

    // Валидация на URL
    try {
      new URL(imageUrl);
    } catch {
      alert('Моля въведете валиден URL');
      return;
    }

    setUploading(true);

    const { error } = await supabase
      .from('media_library')
      .insert({
        type: 'image',
        title: imageTitle,
        url: imageUrl,
        thumbnail_url: imageUrl, // Използваме същия URL като thumbnail
        alt_text: imageTitle,
      });

    if (error) {
      console.error('Error adding image URL:', error);
      alert(`Грешка при добавяне на изображение: ${error.message}`);
    } else {
      setImageUrl('');
      setImageTitle('');
      setShowAddImageUrl(false);
      fetchMedia();
    }

    setUploading(false);
  }

  async function handleAddVideo() {
    if (!videoUrl || !videoTitle) {
      alert('Моля въведете URL и заглавие');
      return;
    }

    setUploading(true);

    let thumbnailUrl = '';

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } else if (videoUrl.includes('vimeo.com')) {
      thumbnailUrl = await fetchVimeoThumbnail(videoUrl);
    }

    const { error } = await supabase
      .from('media_library')
      .insert({
        type: 'video',
        title: videoTitle,
        url: videoUrl,
        thumbnail_url: thumbnailUrl,
        alt_text: videoTitle,
      });

    if (error) {
      console.error('Error adding video:', error);
      alert(`Грешка при добавяне на видео: ${error.message}`);
    } else {
      setVideoUrl('');
      setVideoTitle('');
      setShowAddVideo(false);
      fetchMedia();
    }

    setUploading(false);
  }

  function extractYouTubeId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }

  async function fetchVimeoThumbnail(url: string): Promise<string> {
    try {
      const videoId = url.split('/').pop();
      const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
      const data = await response.json();
      return data[0]?.thumbnail_large || '';
    } catch {
      return '';
    }
  }

  async function handleDelete(id: string, url: string, type: 'image' | 'video') {
    if (!confirm('Сигурни ли сте, че искате да изтриете това медийно съдържание?')) return;

    if (type === 'image') {
      const path = url.split('/').pop();
      if (path) {
        await supabase.storage.from('media').remove([path]);
      }
    }

    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting media:', error);
      alert('Грешка при изтриване');
    } else {
      fetchMedia();
    }
  }

  const filteredMedia = media.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alt_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif text-charcoal-600">Медиа библиотека</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 p-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'image'
                ? 'bg-gold-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Изображения
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'video'
                ? 'bg-gold-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <VideoIcon className="w-4 h-4" />
            Видеа
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Търси..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {activeTab === 'image' ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Качване...' : 'Качи ново изображение'}
                </label>
                <button
                  onClick={syncStorageFiles}
                  disabled={syncing}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                    syncing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Синхронизирай файлове от storage"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Синхронизация...' : 'Синхронизирай от storage'}
                </button>
              </div>
              
              {!showAddImageUrl ? (
                <button
                  onClick={() => setShowAddImageUrl(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  Добави изображение чрез URL
                </button>
              ) : (
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="text"
                    placeholder="URL на изображение (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Заглавие на изображение"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddImageUrl}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300"
                    >
                      {uploading ? 'Добавяне...' : 'Добави'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddImageUrl(false);
                        setImageUrl('');
                        setImageTitle('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Отказ
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {!showAddVideo ? (
                <button
                  onClick={() => setShowAddVideo(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Добави видео URL
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="YouTube/Vimeo URL или директен линк"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Заглавие на видео"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddVideo}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:bg-gray-300"
                    >
                      {uploading ? 'Добавяне...' : 'Добави'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddVideo(false);
                        setVideoUrl('');
                        setVideoTitle('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Отказ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Зареждане...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Няма налични медийни файлове</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-gold-500 transition-all"
                  onClick={() => onSelect(item)}
                >
                  <div className="aspect-square relative">
                    {item.type === 'video' ? (
                      <>
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={item.alt_text || item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <VideoIcon className="w-12 h-12 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.thumbnail_url || item.url}
                        alt={item.alt_text || item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.url, item.type);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-2">
                    <p className="text-sm text-gray-700 truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
