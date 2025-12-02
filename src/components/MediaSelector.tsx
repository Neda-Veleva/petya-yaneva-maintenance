import { useState } from 'react';
import { Image as ImageIcon, Video as VideoIcon, X } from 'lucide-react';
import MediaLibrary from './MediaLibrary';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  url: string;
  thumbnail_url: string;
  alt_text: string;
}

interface MediaSelectorProps {
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video';
  label?: string;
}

export default function MediaSelector({ value, onChange, type = 'image', label }: MediaSelectorProps) {
  const [showLibrary, setShowLibrary] = useState(false);

  function handleSelect(media: MediaItem) {
    onChange(media.url);
    setShowLibrary(false);
  }

  function handleRemove() {
    onChange('');
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <div className="aspect-video">
            {type === 'image' ? (
              <img
                src={value}
                alt="Selected media"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <VideoIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className="absolute bottom-2 left-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-sm"
          >
            Промени
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowLibrary(true)}
          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg hover:border-gold-500 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gold-600"
        >
          {type === 'image' ? (
            <ImageIcon className="w-12 h-12" />
          ) : (
            <VideoIcon className="w-12 h-12" />
          )}
          <span className="text-sm font-medium">
            Избери {type === 'image' ? 'изображение' : 'видео'}
          </span>
        </button>
      )}

      <MediaLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={handleSelect}
        mediaType={type}
      />
    </div>
  );
}
