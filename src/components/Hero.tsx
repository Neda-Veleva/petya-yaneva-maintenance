import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-gradient">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Професионално Поставяне на Мигли</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-6xl lg:text-8xl text-white leading-none tracking-tight">
              Петя
            </h1>
            <h2 className="font-serif text-6xl lg:text-8xl bg-gold-shimmer bg-clip-text text-transparent leading-none tracking-tight animate-shimmer">
              Янева
            </h2>
            <div className="h-1 w-32 bg-gold-shimmer animate-shimmer"></div>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed max-w-xl font-light">
            Премиум студио за професионално удължаване и сгъстяване на мигли.
            Излъчвайте увереност с перфектен поглед, създаден с внимание към всеки детайл.
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

        <div className="relative animate-float">
          <div className="relative w-full h-[650px] rounded-3xl overflow-hidden shadow-dark-xl border border-gold-500/20">
            <img
              src="https://scontent.fsof9-1.fna.fbcdn.net/v/t39.30808-6/571557194_1207174551250893_6556861702637995904_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=x5lg9rZw5HEQ7kNvwGdgBLI&_nc_oc=AdlsR1jtOcvn9PSZ5hl4upnB9knVxOHPnf-42QChH9gBoiDRqVyeHA4J9g-y33v5gfHqAPwnKjlaJ843Wlw2MniZ&_nc_zt=23&_nc_ht=scontent.fsof9-1.fna&_nc_gid=c2QvUpJle5jLyFCZGGOLQg&oh=00_Afjlbzsxd44w4eRxCdZlMelCjJmFrYS1tAhrY2c2-BNPCg&oe=6925645E"
              alt="Petya Yaneva - Професионален специалист по мигли"
              className="w-full h-full object-cover brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/60 via-transparent to-transparent"></div>
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(194,164,105,0.1)]"></div>
          </div>

          <div className="absolute -bottom-8 -left-8 bg-charcoal-400 border border-gold-500/30 rounded-2xl shadow-dark-xl p-8 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gold-shimmer rounded-full flex items-center justify-center shadow-gold-glow">
                <Sparkles className="w-8 h-8 text-charcoal-600" />
              </div>
              <div>
                <p className="text-4xl font-serif font-bold bg-gold-shimmer bg-clip-text text-transparent">500+</p>
                <p className="text-sm text-gray-400 font-medium">Доволни клиенти</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-gold-500/30 rounded-full blur-sm"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gold-500/20 rounded-full blur-sm"></div>
        </div>
      </div>
    </section>
  );
}
