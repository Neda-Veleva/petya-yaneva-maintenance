import { useState } from 'react';
import { Eye, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Услуги', href: '#services' },
    { label: 'Ценоразпис', href: '#prices' },
    { label: 'Отзиви', href: '#reviews' },
    { label: 'Блог', href: '#blog' },
    { label: 'Промоции', href: '#promotions' },
    { label: 'Галерия', href: '#gallery' },
    { label: 'Контакти', href: '#contact' }
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center h-20 relative">
          <div className="absolute left-0 flex items-center gap-3">
       
            <div>
              <h1 className="font-serif text-6xl text-gold-600 font-bold">PY</h1>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-gold-600 transition-colors duration-300 font-medium text-sm"
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
            className="lg:hidden absolute right-0 p-2 text-gray-700 hover:text-gold-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-nude-200 shadow-lg">
          <nav className="flex flex-col py-4 px-6 space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-gold-600 transition-colors duration-300 font-medium py-2"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#"
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
