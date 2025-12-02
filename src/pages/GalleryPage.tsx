import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MediaRender from '../components/MediaRender';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1674049406467-824ea37c7184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9ucyUyMGNsb3NldXB8ZW58MXx8fHwxNzYzMTMzNDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Близък план на удължени мигли',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNoJTIwZXh0ZW5zaW9ucyUyMGFwcGxpY2F0aW9ufGVufDF8fHx8MTc2MzEzNDA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Резултат от ламиниране на мигли',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXAlMjBsYXNoZXN8ZW58MXx8fHwxNzYzMTM0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Удължаване на мигли с обем',
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Класически сет мигли',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1730226995154-efe9e13db300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9ucyUyMHZvbHVtZXxlbnwxfHx8fDE3NjMxMzQwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Процес на боядисване на мигли',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1566321995371-a789682812f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwc29mdHxlbnwxfHx8fDE3NjMxMzM3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Красиви резултати след процедура',
  },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openLightbox = (src: string) => {
    setSelectedImage(src);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <MediaRender
              src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=compress&cs=tinysrgb&w=1920"
              alt="Beauty studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/90 via-charcoal-600/80 to-charcoal-600/90"></div>
          </div>

          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-8">
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
              <span className="text-sm text-gold-400 font-medium tracking-wide">Нашата работа</span>
            </div>

            <h1 className="font-serif text-6xl lg:text-7xl text-white mb-6 leading-none tracking-tight">
              Галерия
            </h1>
            <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
              Открийте красотата на нашата работа чрез зашеметяващи трансформации
            </p>
          </div>
        </section>

        <div className="py-24">
          <div className="max-w-7xl mx-auto px-6">

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => openLightbox(image.src)}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <MediaRender
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nude-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaRender
              src={selectedImage}
              alt="Gallery image"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
