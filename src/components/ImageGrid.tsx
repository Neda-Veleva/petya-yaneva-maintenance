interface ImageGridProps {
  images: string[];
  slideIndex: number;
}

export default function ImageGrid({ images, slideIndex }: ImageGridProps) {
  const imageCount = images.length;

  if (imageCount === 1) {
    return (
      <div className="relative w-full h-[650px] rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
        <img
          src={images[0]}
          alt="Studio"
          className="w-full h-full object-cover brightness-110 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(194,164,105,0.1)]"></div>
      </div>
    );
  }

  if (imageCount === 2) {
    return (
      <div className="relative w-full h-[650px]">
        <div className="flex flex-col gap-3 h-full">
          <div className="flex-1 rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
            <img
              src={images[0]}
              alt="Studio 1"
              className="w-full h-full object-cover brightness-110 transition-all duration-500"
            />
          </div>
          <div className="flex-1 rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
            <img
              src={images[1]}
              alt="Studio 2"
              className="w-full h-full object-cover brightness-110 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    );
  }

  const isEvenSlide = slideIndex % 2 === 0;

  return (
    <div className="relative w-full h-[650px]">
      <div className="grid grid-cols-2 gap-3 h-full">
        {isEvenSlide ? (
          <>
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
              <img
                src={images[0]}
                alt="Studio 1"
                className="w-full h-full object-cover brightness-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(194,164,105,0.1)]"></div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
              <img
                src={images[1]}
                alt="Studio 2"
                className="w-full h-full object-cover brightness-110 transition-all duration-500"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
              <img
                src={images[2]}
                alt="Studio 3"
                className="w-full h-full object-cover brightness-110 transition-all duration-500"
              />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
              <img
                src={images[0]}
                alt="Studio 1"
                className="w-full h-full object-cover brightness-110 transition-all duration-500"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
              <img
                src={images[1]}
                alt="Studio 2"
                className="w-full h-full object-cover brightness-110 transition-all duration-500"
              />
            </div>
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
              <img
                src={images[2]}
                alt="Studio 3"
                className="w-full h-full object-cover brightness-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(194,164,105,0.1)]"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
