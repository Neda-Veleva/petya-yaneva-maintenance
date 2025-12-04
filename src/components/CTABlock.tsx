import { Star, Sparkles, Heart, ArrowRight } from 'lucide-react';

interface CTAButton {
  text: string;
  url: string;
  style: 'primary' | 'secondary';
  icon?: string;
}

interface CTAStat {
  value: string;
  label: string;
}

interface CTABlockContent {
  icon?: string;
  title: string;
  description: string;
  buttons: CTAButton[];
  stats?: CTAStat[];
}

interface CTABlockProps {
  blockType: 'simple_cta' | 'dual_cta' | 'stats_cta';
  content: CTABlockContent;
}

const ICONS: Record<string, any> = {
  star: Star,
  sparkles: Sparkles,
  heart: Heart,
  'arrow-right': ArrowRight,
};

function SimpleCTA({ content }: { content: CTABlockContent }) {
  const IconComponent = content.icon ? ICONS[content.icon] || Star : Star;

  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-12 border border-gold-500/20 shadow-2xl">
          <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconComponent className="w-10 h-10 text-gold-400" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-4">{content.title}</h2>
          <p className="text-gray-300 mb-8 text-lg">{content.description}</p>
          {content.buttons[0] && (
            <a
              href={content.buttons[0].url}
              className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {content.buttons[0].text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function DualCTA({ content }: { content: CTABlockContent }) {
  return (
    <section className="py-20 relative bg-charcoal-600">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-serif text-5xl text-white mb-6">{content.title}</h2>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">{content.description}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {content.buttons.map((button, index) => {
            const ButtonIcon = button.icon ? ICONS[button.icon] : null;
            return (
              <a
                key={index}
                href={button.url}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                  button.style === 'primary'
                    ? 'bg-gold-500 hover:bg-gold-600 text-white'
                    : 'bg-transparent hover:bg-gold-500/10 text-gold-400 border-2 border-gold-500/30 hover:border-gold-500'
                }`}
              >
                {button.text}
                {ButtonIcon && <ButtonIcon className="w-5 h-5" />}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsCTA({ content }: { content: CTABlockContent }) {
  const IconComponent = content.icon ? ICONS[content.icon] || Sparkles : Sparkles;

  return (
    <section className="py-32 relative bg-gradient-to-b from-charcoal-700 to-charcoal-600">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="border border-gold-500/20 rounded-3xl p-16">
          <div className="absolute top-0 left-20 w-px h-20 bg-gold-500/20"></div>
          <div className="absolute top-0 right-20 w-px h-20 bg-gold-500/20"></div>
          <div className="absolute bottom-0 left-20 w-px h-20 bg-gold-500/20"></div>
          <div className="absolute bottom-0 right-20 w-px h-20 bg-gold-500/20"></div>

          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <IconComponent className="w-12 h-12 text-gold-400" />
            </div>

            <h2 className="font-serif text-5xl lg:text-6xl text-gold-400 mb-6 leading-tight">
              {content.title}
            </h2>

            <div className="h-px w-32 bg-gold-400 mx-auto mb-8"></div>

            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
              {content.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {content.buttons.map((button, index) => {
                const ButtonIcon = button.icon ? ICONS[button.icon] : null;
                return (
                  <a
                    key={index}
                    href={button.url}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                      button.style === 'primary'
                        ? 'bg-gold-500 hover:bg-gold-600 text-white'
                        : 'bg-transparent hover:bg-gold-500/10 text-gold-400 border-2 border-gold-500/30 hover:border-gold-500'
                    }`}
                  >
                    {button.text}
                    {ButtonIcon && <ButtonIcon className="w-5 h-5" />}
                  </a>
                );
              })}
            </div>
          </div>

          {content.stats && content.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gold-500/20">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-serif text-4xl lg:text-5xl text-gold-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CTABlock({ blockType, content }: CTABlockProps) {
  if (blockType === 'simple_cta') {
    return <SimpleCTA content={content} />;
  }

  if (blockType === 'dual_cta') {
    return <DualCTA content={content} />;
  }

  if (blockType === 'stats_cta') {
    return <StatsCTA content={content} />;
  }

  return null;
}
