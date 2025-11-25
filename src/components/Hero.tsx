import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';
import ImageGrid from './ImageGrid';

const slides = [
  {
    id: 1,
    type: 'person',
    firstName: 'Петя',
    lastName: 'Янева',
    badge: 'Професионално Поставяне на Мигли',
    description: 'Основател и водещ специалист с над 5 години опит в удължаване на мигли. Специализирана в класически и обемни техники с внимание към всеки детайл.',
    image: 'https://scontent.fsof9-1.fna.fbcdn.net/v/t39.30808-6/571557194_1207174551250893_6556861702637995904_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=x5lg9rZw5HEQ7kNvwGdgBLI&_nc_oc=AdlsR1jtOcvn9PSZ5hl4upnB9knVxOHPnf-42QChH9gBoiDRqVyeHA4J9g-y33v5gfHqAPwnKjlaJ843Wlw2MniZ&_nc_zt=23&_nc_ht=scontent.fsof9-1.fna&_nc_gid=c2QvUpJle5jLyFCZGGOLQg&oh=00_Afjlbzsxd44w4eRxCdZlMelCjJmFrYS1tAhrY2c2-BNPCg&oe=6925645E',
    thumbnail: 'https://scontent.fsof9-1.fna.fbcdn.net/v/t39.30808-6/571557194_1207174551250893_6556861702637995904_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=x5lg9rZw5HEQ7kNvwGdgBLI&_nc_oc=AdlsR1jtOcvn9PSZ5hl4upnB9knVxOHPnf-42QChH9gBoiDRqVyeHA4J9g-y33v5gfHqAPwnKjlaJ843Wlw2MniZ&_nc_zt=23&_nc_ht=scontent.fsof9-1.fna&_nc_gid=c2QvUpJle5jLyFCZGGOLQg&oh=00_Afjlbzsxd44w4eRxCdZlMelCjJmFrYS1tAhrY2c2-BNPCg&oe=6925645E',
    stat: { value: '500+', label: 'Доволни клиенти' },
  },
  {
    id: 2,
    type: 'person',
    firstName: 'Мария',
    lastName: 'Георгиева',
    badge: 'Сертифициран Lash Специалист',
    description: 'Творчески специалист с 3 години опит в изкуството на удължаването на мигли. Експерт в създаването на естествен и изискан вид с перфектна техника.',
    image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1080',
    thumbnail: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=300',
    stat: { value: '300+', label: 'Доволни клиенти' },
  },
  {
    id: 3,
    type: 'salon',
    title: 'Hair & Beauty',
    titleGold: 'Livon',
    badge: 'Премиум Beauty Studio',
    description: 'Луксозно студио в сърцето на София, оборудвано с най-модерните технологии и висококачествени продукти за перфектни резултати.',
    imageSlides: [
      [
        'https://studio24.bg/pictures/studios/2/2482/thumbs/0x346/26511.jpg?auto=compress&cs=tinysrgb&w=1080',
        'https://studio24.bg/pictures/studios/2/2482/thumbs/0x346/53660.jpg?auto=compress&cs=tinysrgb&w=1080',
        'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=1080',
      ],
      [
        'https://images.pexels.com/photos/3997983/pexels-photo-3997983.jpeg?auto=compress&cs=tinysrgb&w=1080',
        'https://images.pexels.com/photos/7755472/pexels-photo-7755472.jpeg?auto=compress&cs=tinysrgb&w=1080',
        'https://images.pexels.com/photos/5177992/pexels-photo-5177992.jpeg?auto=compress&cs=tinysrgb&w=1080',
      ],
    ],
    thumbnail: 'https://studio24.bg/pictures/studios/2/2482/thumbs/0x346/26511.jpg?auto=compress&cs=tinysrgb&w=300',
    stat: { value: 'София', label: 'Централна локация' },
    icon: MapPin,
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSalonImage, setCurrentSalonImage] = useState(0);
  const slide = slides[currentSlide];

  useEffect(() => {
    if (slide.type === 'salon' && slide.imageSlides && slide.imageSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSalonImage((prev) => (prev + 1) % slide.imageSlides.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [currentSlide, slide]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-gradient">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-8 items-center">
          {/* Content */}
          <div className="space-y-8 order-1">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow">
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
              <span className="text-sm text-gold-400 font-medium tracking-wide">{slide.badge}</span>
            </div>

            <div className="space-y-4">
              {slide.type === 'person' ? (
                <>
                  <h1 className="font-serif text-6xl lg:text-8xl text-white leading-none tracking-tight">
                    {slide.firstName}
                  </h1>
                  <h2 className="font-serif text-6xl lg:text-8xl bg-gold-shimmer bg-clip-text text-transparent leading-none tracking-tight animate-shimmer">
                    {slide.lastName}
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="font-serif text-6xl lg:text-8xl text-white leading-none tracking-tight">
                    {slide.title}
                  </h1>
                  <h2 className="font-serif text-6xl lg:text-8xl bg-gold-shimmer bg-clip-text text-transparent leading-none tracking-tight animate-shimmer">
                    {slide.titleGold}
                  </h2>
                </>
              )}
              <div className="h-1 w-32 bg-gold-shimmer animate-shimmer"></div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed max-w-xl font-light">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#services"
                className="group px-8 py-4 bg-gold-shimmer text-charcoal-600 rounded-full font-semibold transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 flex items-center gap-2"
              >
                <span>Виж услугите</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="#contact"
                className="px-8 py-4 bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-full font-semibold transition-all duration-300 hover:shadow-gold-glow"
              >
                Запази час
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-float order-3">
            {slide.type === 'salon' && slide.imageSlides ? (
              <div className="relative">
                <ImageGrid
                  images={slide.imageSlides[currentSalonImage]}
                  slideIndex={currentSalonImage}
                />

                {/* Salon Slide Navigation */}
                {slide.imageSlides.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-charcoal-400/80 backdrop-blur-md px-4 py-2 rounded-full">
                    {slide.imageSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSalonImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSalonImage
                            ? 'bg-gold-500 w-6'
                            : 'bg-gray-400 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-[650px] rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
                <img
                  src={slide.image}
                  alt={slide.type === 'person' ? `${slide.firstName} ${slide.lastName}` : slide.title}
                  className="w-full h-full object-cover brightness-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(194,164,105,0.1)]"></div>
              </div>
            )}

            <div className="absolute -bottom-8 -left-8 bg-charcoal-400 border border-gold-500/30 rounded-2xl shadow-dark-xl p-8 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gold-shimmer rounded-full flex items-center justify-center shadow-gold-glow">
                  {slide.icon ? (
                    <slide.icon className="w-8 h-8 text-charcoal-600" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-charcoal-600" />
                  )}
                </div>
                <div>
                  <p className="text-4xl font-serif font-bold bg-gold-shimmer bg-clip-text text-transparent">{slide.stat.value}</p>
                  <p className="text-sm text-gray-400 font-medium">{slide.stat.label}</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-gold-500/30 rounded-full blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gold-500/20 rounded-full blur-sm"></div>
          </div>

          {/* Thumbnails sidebar */}
          {slides.length > 1 && (
            <div className="flex lg:flex-col gap-4 justify-center lg:justify-start order-3">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                    index === currentSlide
                      ? 'ring-2 ring-gold-500 shadow-gold-glow scale-110'
                      : 'opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={s.thumbnail}
                    alt={s.type === 'person' ? `${s.firstName} ${s.lastName}` : s.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/80 to-transparent"></div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
