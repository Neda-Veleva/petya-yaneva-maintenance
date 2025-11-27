import { useState } from 'react';
import { Eye, Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const serviceCategories = [
    { label: 'Мигли', href: '/services/lashes' },
    { label: 'Вежди', href: '/services/brows' },
    { label: 'Други услуги за лице', href: '/services/facial' }
  ];

  const menuItems = [
    { label: 'Ценоразпис', href: '#prices' },
    { label: 'Отзиви', href: '#reviews' },
    { label: 'Блог', href: '/blog' },
    { label: 'Промоции', href: '/promotions' },
    { label: 'Галерия', href: '#gallery' },
    { label: 'Контакти', href: '#contact' }
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-b from-charcoal-600/98 via-charcoal-600/95 to-charcoal-600/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-b border-gold-500/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center h-20 relative">
          <div className="absolute left-0 flex items-center gap-3">
            <a href="/">
              <svg width="60" height="33.4" viewBox="0 0 100 55.67" className="h-10 w-auto">
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#fff7ae"></stop>
                    <stop offset="0.21" stopColor="#9b6326"></stop>
                    <stop offset="0.38" stopColor="#fff7ae"></stop>
                    <stop offset="0.53" stopColor="#d3c175"></stop>
                    <stop offset="0.65" stopColor="#fceec4"></stop>
                    <stop offset="0.7" stopColor="#b78626"></stop>
                    <stop offset="0.82" stopColor="#fffacf"></stop>
                    <stop offset="1" stopColor="#9b6326"></stop>
                  </linearGradient>
                </defs>
                <g transform="matrix(3.731343389805563,0,0,3.731343389805563,-8.208955635496556,-18.95522235629017)" fill="url(#logoGradient)">
                  <path d="M7.22 11.46 l2.64 0 q2.2 0 2.2 -2.12 q0 -1.1 -0.55 -1.59 t-1.65 -0.49 l-5.48 0 l0 4.8 q0.62 -0.36 1.4 -0.5 q0.58 -0.1 1.44 -0.1 z M4.38 20 l-2.18 0 l0 -14.92 l7.66 0 q1.32 0 2.3 0.51 t1.52 1.47 t0.54 2.27 t-0.54 2.29 t-1.53 1.51 t-2.29 0.53 l-2.64 0 q-1.72 0 -2.84 0.6 l0 5.74 z M22.36 11.64 q1.34 -1.4 2.42 -3.12 t1.72 -3.44 l2.5 0 q-1.02 2.38 -2.48 4.56 q-1.32 1.98 -3.08 3.9 l0 6.46 l-2.16 0 l0 -6.46 q-1.76 -1.92 -3.08 -3.9 q-1.46 -2.18 -2.48 -4.56 l2.5 0 q0.64 1.72 1.72 3.44 t2.42 3.12 z"></path>
                </g>
              </svg>
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <div className="relative group">
              <a
                href="/services"
                className="text-gold-400 hover:text-white transition-colors duration-300 font-medium text-sm flex items-center gap-1"
                onMouseEnter={() => setIsServicesOpen(true)}
              >
                Услуги
                <ChevronDown className="w-4 h-4" />
              </a>

              {isServicesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-charcoal-600/98 backdrop-blur-md rounded-2xl shadow-2xl border border-gold-500/20 overflow-hidden"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <div className="py-2">
                    {serviceCategories.map((category) => (
                      <a
                        key={category.href}
                        href={category.href}
                        className="block px-6 py-3 text-gold-400 hover:text-white hover:bg-gold-500/10 transition-all duration-300 text-sm font-medium"
                      >
                        {category.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gold-400 hover:text-white transition-colors duration-300 font-medium text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden lg:block absolute right-0 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            Запази час
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden absolute right-0 p-2 text-gold-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-charcoal-600/98 to-charcoal-600/95 border-t border-gold-500/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <nav className="flex flex-col py-4 px-6 space-y-4">
            <div>
              <a
                href="/services"
                className="text-gold-400 hover:text-white transition-colors duration-300 font-medium py-2 block"
              >
                Услуги
              </a>
              <div className="pl-4 space-y-2 mt-2">
                {serviceCategories.map((category) => (
                  <a
                    key={category.href}
                    href={category.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gold-300 hover:text-white transition-colors duration-300 text-sm py-2 block"
                  >
                    {category.label}
                  </a>
                ))}
              </div>
            </div>

            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gold-400 hover:text-white transition-colors duration-300 font-medium py-2"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-md text-center"
            >
              Запази час
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
