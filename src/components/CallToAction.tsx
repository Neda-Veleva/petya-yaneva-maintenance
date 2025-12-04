import { ArrowRight, Sparkles } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600"></div>

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]"></div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-400/30 rounded-full blur-xl animate-pulse"></div>
            <Sparkles className="relative w-16 h-16 text-gold-400" />
          </div>
        </div>

        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-6 leading-tight tracking-tight animate-shimmer">
          Готови за промяна?
        </h2>

        <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

        <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
          Заповядайте в нашия салон и открийте света на перфектните мигли и вежди.
          Запазете час днес и се насладете на луксозна грижа с професионален подход.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gold-shimmer text-charcoal-600 rounded-full font-bold text-lg transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105"
          >
            <span>Запази час сега</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/services"
            className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-gold-400/50 text-gold-400 rounded-full font-bold text-lg transition-all duration-300 hover:bg-gold-400/10 hover:border-gold-400 hover:scale-105"
          >
            <span>Разгледай услугите</span>
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: '500+', label: 'Доволни клиенти' },
            { value: '5+', label: 'Години опит' },
            { value: '100%', label: 'Качествени продукти' },
            { value: '24/7', label: 'Грижа за теб' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-serif bg-gold-shimmer bg-clip-text text-transparent font-bold mb-2 animate-shimmer">
                {stat.value}
              </div>
              <div className="text-sm text-gray-300 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold-500/30"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold-500/30"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold-500/30"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold-500/30"></div>
    </section>
  );
}
