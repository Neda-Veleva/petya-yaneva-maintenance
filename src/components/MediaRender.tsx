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

  function getYouTubeEmbedUrl(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  function getVimeoEmbedUrl(url: string): string | null {
    const videoId = url.split('/').pop();
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  const mediaType = type === 'auto' ? detectMediaType(src) : type;

  if (mediaType === 'video') {
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      const embedUrl = getYouTubeEmbedUrl(src);
      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className={className}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            {...videoProps}
          />
        );
      }
    }

    if (src.includes('vimeo.com')) {
      const embedUrl = getVimeoEmbedUrl(src);
      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className={className}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            {...videoProps}
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
