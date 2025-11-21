import { useEffect, useState } from 'react';

export default function BrandsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const brands = [
    { name: 'Lash Perfect', logo: 'https://images.pexels.com/photos/5868272/pexels-photo-5868272.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'NovaLash', logo: 'https://images.pexels.com/photos/8132582/pexels-photo-8132582.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Xtreme Lashes', logo: 'https://images.pexels.com/photos/5128259/pexels-photo-5128259.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Borboleta', logo: 'https://images.pexels.com/photos/6191353/pexels-photo-6191353.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Glad Lash', logo: 'https://images.pexels.com/photos/7755473/pexels-photo-7755473.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'BL Lashes', logo: 'https://images.pexels.com/photos/8132594/pexels-photo-8132594.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [brands.length]);

  const getVisibleBrands = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(brands[(currentIndex + i) % brands.length]);
    }
    return visible;
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">
            Премиум брандове, на които се доверяваме
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Работим само с най-добрите международни марки, за да гарантираме изключително качество и дълготрайни резултати
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex justify-center items-center gap-8 md:gap-12">
            {getVisibleBrands().map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center group"
              >
                <div className="relative w-full h-full">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center pb-3">
                    <span className="text-white text-xs font-medium">{brand.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {brands.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-gold-500 w-8' : 'bg-gray-300'
                }`}
                aria-label={`Към слайд ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
