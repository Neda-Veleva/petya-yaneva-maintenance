import { Heart, Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-nude-100 to-nude-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl text-gold-500 mb-2">Lashes by Petya Yaneva</h3>
            <p className="text-gray-600 text-sm">Издигаме красотата, мигa по мигa</p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gold-400/20 transition-colors duration-300"
            >
              <Instagram className="w-5 h-5 text-gold-500" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gold-400/20 transition-colors duration-300"
            >
              <Facebook className="w-5 h-5 text-gold-500" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gold-400/20 transition-colors duration-300"
            >
              <Mail className="w-5 h-5 text-gold-500" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-nude-200 text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center space-x-1">
            <span>Създадено с</span>
            <Heart className="w-4 h-4 text-blush-500 fill-current" />
            <span>© 2025 Lashes by Petya Yaneva. Всички права запазени.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
