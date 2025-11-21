import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">Контакти</h2>
          <p className="text-gray-600 text-lg">
            Посетете ни в нашето луксозно студио
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-nude-50 rounded-3xl p-8 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Адрес</h3>
                  <p className="text-gray-600">
                    123 Beauty Boulevard<br />
                    Sofia, Bulgaria 1000
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Телефон</h3>
                  <p className="text-gray-600">+359 888 123 456</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Работно време</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Понеделник - Петък: 9:00 - 19:00</p>
                    <p>Събота и неделя: Почивни дни</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex space-x-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gold-400/40 transition-colors duration-300"
                  >
                    <Instagram className="w-6 h-6 text-gold-500" />
                  </a>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Instagram</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>@lashesbyPetya</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex space-x-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gold-400/40 transition-colors duration-300"
                  >
                    <Facebook className="w-6 h-6 text-gold-500" />
                  </a>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Facebook</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Lashes by Petya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px] bg-nude-100">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-gold-400 mx-auto" />
                <p className="text-gray-600 font-medium">Местоположение на картата</p>
                <p className="text-sm text-gray-500 max-w-xs">
                  Тук може да се интегрира интерактивна карта с местоположението на студиото
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
