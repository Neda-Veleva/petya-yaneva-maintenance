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
        <div className="relative bg-gray-100 rounded-lg overflow-hidden inline-block">
          <div className="w-48 h-32">
            {type === 'image' ? (
              <img
                src={value}
                alt="Selected media"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={value}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-3 h-3" />
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className="absolute bottom-1 left-1 px-2 py-1 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors shadow-lg text-xs"
          >
            Промени
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowLibrary(true)}
          className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gold-500 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gold-600"
        >
          {type === 'image' ? (
            <ImageIcon className="w-8 h-8" />
          ) : (
            <VideoIcon className="w-8 h-8" />
          )}
          <span className="text-xs font-medium">
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
