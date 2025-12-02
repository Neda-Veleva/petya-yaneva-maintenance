import { useState } from 'react';
import { Play } from 'lucide-react';

interface MediaRenderProps {
  src: string;
  alt?: string;
  className?: string;
  type?: 'image' | 'video' | 'auto';
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export default function MediaRender({
  src,
  alt = '',
  className = '',
  type = 'auto',
  videoProps = {},
  imageProps = {}
}: MediaRenderProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  function detectMediaType(url: string): 'image' | 'video' {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com'];

    const lowerUrl = url.toLowerCase();

    if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
      return 'video';
    }

    if (videoHosts.some(host => lowerUrl.includes(host))) {
      return 'video';
    }

    return 'image';
  }

  function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }

  function getYouTubeEmbedUrl(url: string): string | null {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  }

  function getYouTubeThumbnail(url: string): string | null {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  }

  function getVimeoVideoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  }

  function getVimeoEmbedUrl(url: string): string | null {
    const videoId = getVimeoVideoId(url);
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : null;
  }

  const mediaType = type === 'auto' ? detectMediaType(src) : type;

  if (mediaType === 'video') {
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      const thumbnailUrl = getYouTubeThumbnail(src);
      const embedUrl = getYouTubeEmbedUrl(src);

      if (!isPlaying && thumbnailUrl) {
        return (
          <div className={`relative ${className} cursor-pointer group`} onClick={() => setIsPlaying(true)}>
            <img
              src={thumbnailUrl}
              alt={alt}
              className="w-full h-full object-cover"
              {...imageProps}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        );
      }

      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className={className}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        );
      }
    }

    if (src.includes('vimeo.com')) {
      const embedUrl = getVimeoEmbedUrl(src);

      if (!isPlaying) {
        return (
          <div className={`relative ${className} cursor-pointer group`} onClick={() => setIsPlaying(true)}>
            <img
              src={`https://vumbnail.com/${getVimeoVideoId(src)}.jpg`}
              alt={alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
              {...imageProps}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        );
      }

      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className={className}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        );
      }
    }

    return (
      <video
        src={src}
        className={className}
        controls
        preload="metadata"
        {...videoProps}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      {...imageProps}
    />
  );
}
