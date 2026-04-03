import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Calendar,
  Instagram,
  Facebook,
  Heart,
} from 'lucide-react';
import { STUDIO_BOOKING_URL } from '../seo';

const FOOTER_SOCIAL = {
  instagram: 'https://www.instagram.com/petqqneva',
  facebook: 'https://www.facebook.com/petencet000',
} as const;

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  'ул. Чудомир 5, Надежда, София'
)}&output=embed`;

/** Локална снимка за херо — файл: public/hero.jpg */
const HERO_BACKGROUND_IMAGE = '/hero.jpg';

/** Име на салона (Studio24 / Google Maps) */
const STUDIO_NAME = 'Livon Hair Boutique';

const CONTACT = {
  address: 'Надежда, ул. „Чудомир“ 5',
  phone: '+359 895 809 634',
  phoneTel: '+359895809634',
  workingHours: [{ line: 'Всеки ден: 08:00 - 21:00' }],
} as const;

const HERO_STATS = [
  { value: '10+', label: 'Години опит' },
  { value: '1000+', label: 'Клиенти' },
  { value: '100%', label: 'Качество' },
] as const;

/** Логото „PY“ — същият SVG като в оригиналния Header */
function LogoSvg() {
  return (
    <svg width="60" height="33.4" viewBox="0 0 100 55.67" className="h-10 w-auto" aria-hidden>
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fff7ae" />
          <stop offset="0.21" stopColor="#9b6326" />
          <stop offset="0.38" stopColor="#fff7ae" />
          <stop offset="0.53" stopColor="#d3c175" />
          <stop offset="0.65" stopColor="#fceec4" />
          <stop offset="0.7" stopColor="#b78626" />
          <stop offset="0.82" stopColor="#fffacf" />
          <stop offset="1" stopColor="#9b6326" />
        </linearGradient>
      </defs>
      <g
        transform="matrix(3.731343389805563,0,0,3.731343389805563,-8.208955635496556,-18.95522235629017)"
        fill="url(#logoGradient)"
      >
        <path d="M7.22 11.46 l2.64 0 q2.2 0 2.2 -2.12 q0 -1.1 -0.55 -1.59 t-1.65 -0.49 l-5.48 0 l0 4.8 q0.62 -0.36 1.4 -0.5 q0.58 -0.1 1.44 -0.1 z M4.38 20 l-2.18 0 l0 -14.92 l7.66 0 q1.32 0 2.3 0.51 t1.52 1.47 t0.54 2.27 t-0.54 2.29 t-1.53 1.51 t-2.29 0.53 l-2.64 0 q-1.72 0 -2.84 0.6 l0 5.74 z M22.36 11.64 q1.34 -1.4 2.42 -3.12 t1.72 -3.44 l2.5 0 q-1.02 2.38 -2.48 4.56 q-1.32 1.98 -3.08 3.9 l0 6.46 l-2.16 0 l0 -6.46 q-1.76 -1.92 -3.08 -3.9 q-1.46 -2.18 -2.48 -4.56 l2.5 0 q0.64 1.72 1.72 3.44 t2.42 3.12 z" />
      </g>
    </svg>
  );
}

export default function Home() {
  const aboutLashesRef = useRef<HTMLElement>(null);
  const [aboutLashesVisible, setAboutLashesVisible] = useState(false);

  useEffect(() => {
    const el = aboutLashesRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutLashesVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600 flex flex-col text-gray-100">
      <header className="fixed left-0 right-0 top-0 z-50 bg-gradient-to-b from-charcoal-600/95 via-charcoal-600/92 to-charcoal-700/90 shadow-[0_4px_24px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-lg backdrop-saturate-150">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative flex h-20 items-center justify-between">
            <a href="/" className="flex shrink-0 items-center gap-3" aria-label="Lashes by Petya Yaneva">
              <LogoSvg />
            </a>
            <a
              href={STUDIO_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-gold-600 hover:shadow-lg"
            >
              Запази час
              <ArrowRight
                className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={1.75}
                aria-hidden
              />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative flex min-h-[68vh] items-center justify-center overflow-hidden md:min-h-[70vh]">
          <div className="absolute inset-0">
            <img
              src={HERO_BACKGROUND_IMAGE}
              alt="удължаване на мигли София Petya Yaneva"
              className="absolute inset-0 h-full w-full object-cover object-[15%] opacity-45 md:object-left"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal-500/60 via-charcoal-600/50 to-black/75" />
          </div>

          {/* Анимирани златисти „светлини“ */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 left-1/4 h-[800px] w-[800px] rounded-full bg-gold-500/10 blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-gold-400/15 blur-3xl animate-pulse"
              style={{ animationDelay: '2s' }}
            />
          </div>

          {/* Декоративни хоризонтални линии */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-0 top-1/2 h-px w-32 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <div className="absolute right-0 top-1/2 h-px w-32 bg-gradient-to-l from-transparent via-gold-500/50 to-transparent" />
          </div>

          {/* Декоративни ъгли (четири като в оригинала) */}
          <div className="pointer-events-none absolute left-8 top-24 h-16 w-16 border-l-2 border-t-2 border-gold-500/40 md:top-28" aria-hidden />
          <div className="pointer-events-none absolute right-8 top-24 h-16 w-16 border-r-2 border-t-2 border-gold-500/40 md:top-28" aria-hidden />
          <div className="pointer-events-none absolute bottom-8 left-8 h-16 w-16 border-b-2 border-l-2 border-gold-500/40" aria-hidden />
          <div className="pointer-events-none absolute bottom-8 right-8 h-16 w-16 border-b-2 border-r-2 border-gold-500/40" aria-hidden />

          <div className="relative z-10 mx-auto w-full max-w-5xl space-y-8 px-6 pb-12 pt-28 text-center md:space-y-10 md:pb-16 md:pt-32">
            <div className="space-y-4 md:space-y-6">
              <h1 className="sr-only">Удължаване на мигли в София</h1>
              <h2 className="font-serif text-5xl leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
                Lashes by
                <span className="mt-2 block bg-gold-shimmer bg-clip-text text-transparent animate-shimmer leading-normal">
                  Petya Yaneva
                </span>
              </h2>

              <div className="flex justify-center">
                <div className="h-px w-24 animate-shimmer bg-gold-shimmer" />
              </div>

              <p className="mx-auto max-w-2xl text-xl font-light tracking-wide text-gray-200 md:text-2xl">
                Открийте света на луксозната грижа за мигли
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-10 pt-4 md:gap-16 md:pt-6">
              {HERO_STATS.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mb-2 font-serif text-4xl font-bold text-transparent bg-gold-shimmer bg-clip-text md:text-5xl">
                    {item.value}
                  </div>
                  <div className="text-sm uppercase tracking-widest text-gray-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={aboutLashesRef}
          className={`about-lashes-block border-t border-gold-200/40 bg-gradient-to-b from-[#faf8f5] via-white to-[#f3efe8] ${aboutLashesVisible ? 'is-visible' : ''}`}
          aria-labelledby="about-lashes-heading"
        >
          <div className="mx-auto max-w-2xl px-6 py-20 md:max-w-3xl md:px-8 md:py-28">
            <div className="flex items-stretch gap-6 md:gap-8">
              <div className="relative w-1 shrink-0 self-stretch overflow-hidden rounded-full" aria-hidden>
                <div className="about-line-inner absolute inset-0 rounded-full bg-gradient-to-b from-amber-700/50 via-amber-600/35 to-amber-500/15" />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="about-lashes-heading"
                  className="about-title font-serif text-2xl font-normal leading-snug tracking-tight text-stone-800 sm:text-[1.75rem] md:text-3xl"
                >
                  Професионално удължаване на мигли в София
                </h2>
                <div className="about-body mt-9 max-w-prose space-y-6 text-[1.02rem] font-normal leading-[1.82] text-stone-600 sm:text-[1.05rem] md:mt-11 md:leading-[1.78]">
                  <p className="text-pretty">
                    Работим с различни техники като косъм по косъм, 2D, 3D и руски обем, като акцентът е
                    върху <strong className="font-semibold text-stone-800">UV lashes</strong>, съвременна
                    технология, достъпна само в ограничен брой салони, която осигурява по-добра фиксация,
                    повече комфорт и дълготраен резултат.
                  </p>
                  <p className="text-pretty text-stone-600">
                    Петя Янева посреща своите клиенти в Livon Hair Boutique в кв. Надежда, София, където ще
                    получите спокойна атмосфера и професионална грижа. Независимо дали търсите естествен
                    ефект или по-драматична визия, ще създадем най-подходящото решение за вас.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-gold-200/40 bg-gradient-to-b from-[#faf8f5] via-white to-[#f3efe8]">
          <div className="px-6 pb-20 pt-16 md:pb-24 md:pt-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex flex-col items-center gap-8 md:gap-10">
                <h2 className="font-serif text-4xl leading-tight text-gold-600 drop-shadow-sm sm:text-5xl md:text-6xl">
                  В процес на разработка сме
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                  Работим по новия уебсайт
                </p>
                <p className="font-serif text-xl text-gold-600 md:text-2xl">
                  Очаквайте скоро новата ни визия онлайн.
                </p>
                <p className="max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
                  Междувременно можете да запазите час онлайн или да се свържете с нас по телефон.
                </p>
              </div>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-14 md:mt-16 sm:flex-row">
                <a
                  href={STUDIO_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gold-500 px-8 py-4 text-lg font-medium text-charcoal-600 shadow-lg shadow-gold-500/25 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-400/35 sm:w-auto"
                >
                  <Calendar className="h-6 w-6 shrink-0" aria-hidden />
                  Запази час онлайн
                  <ArrowRight
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </a>
              </div>
            </div>
          </div>

        </section>

        <section className="px-6 py-20 md:py-28" aria-labelledby="contact-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center md:mb-12">
              <h2
                id="contact-heading"
                className="font-serif text-3xl text-white md:text-4xl"
              >
                Заповядайте при нас
              </h2>
              <p className="mt-3 font-serif text-lg tracking-wide text-[#c9a673] md:text-xl">
                {STUDIO_NAME}
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-stretch">
              <div className="relative overflow-hidden rounded-[28px] border-2 border-[#c9a673]/50 bg-[#2c241e] p-8 shadow-[0_0_40px_rgba(201,166,115,0.35),0_0_80px_rgba(201,166,115,0.12)] backdrop-blur-xl sm:p-10">
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a673]/10 to-transparent animate-shimmer"
                  aria-hidden
                />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-start gap-4 border-b border-[#c9a673]/15 pb-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9a673]/35 bg-[#c9a673]/10">
                      <MapPin className="h-6 w-6 text-[#c9a673]" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 font-serif text-xl font-semibold text-white">Адрес</h3>
                      <p className="font-sans leading-relaxed text-white/90">{CONTACT.address}</p>
                      <p className="mt-2 text-sm font-medium text-[#c9a673]/95">{STUDIO_NAME}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-b border-[#c9a673]/15 pb-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9a673]/35 bg-[#c9a673]/10">
                      <Phone className="h-6 w-6 text-[#c9a673]" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 font-serif text-xl font-semibold text-white">Телефон</h3>
                      <a
                        href={`tel:${CONTACT.phoneTel}`}
                        className="font-sans text-lg font-medium text-[#c9a673] transition-colors hover:text-[#d4b87a]"
                      >
                        {CONTACT.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9a673]/35 bg-[#c9a673]/10">
                      <Clock className="h-6 w-6 text-[#c9a673]" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 font-serif text-xl font-semibold text-white">Работно време</h3>
                      <div className="space-y-1 font-sans text-white/90">
                        {CONTACT.workingHours.map((row) => (
                          <p key={row.line}>{row.line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-h-[320px] overflow-hidden rounded-[28px] border-2 border-[#c9a673]/50 bg-[#2c241e] shadow-[0_0_40px_rgba(201,166,115,0.35),0_0_80px_rgba(201,166,115,0.12)] lg:min-h-[360px]">
                <iframe
                  title="Lashes by Petya Yaneva Sofia location"
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  className="min-h-[320px] w-full border-0 lg:min-h-[360px]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
              <a href="/" className="flex shrink-0 items-center" aria-label="Lashes by Petya Yaneva — начало">
                <LogoSvg />
              </a>
              <div className="text-center sm:text-left sm:leading-tight">
                <h3 className="mb-2 font-serif text-2xl text-gold-500">Lashes by Petya Yaneva</h3>
                <p className="text-sm text-gray-400">Издигаме красотата, мигла по мигла</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={FOOTER_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors duration-300 hover:bg-gold-400/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gold-500" aria-hidden />
              </a>
              <a
                href={FOOTER_SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors duration-300 hover:bg-gold-400/20"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gold-500" aria-hidden />
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-500">
              <span>Създадено с</span>
              <Heart className="h-4 w-4 shrink-0 fill-gray-400 text-gray-400" aria-hidden />
              <span>
                © {new Date().getFullYear()} Lashes by Petya Yaneva. Всички права запазени.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
