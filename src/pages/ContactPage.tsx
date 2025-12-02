import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert('Благодарим ви! Вашето съобщение е изпратено успешно. Ще се свържем с вас скоро.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600">
      <Header />

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(212,175,55,0.05),transparent_50%)]"></div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-8">
            <MessageCircle className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Контакти</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Свържете се с Нас
          </h1>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Очакваме вашето запитване. Ще се радваме да отговорим на всички ваши въпроси
          </p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-8 h-8 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl mb-2">Адрес</h3>
                    <p className="text-gray-300 leading-relaxed">
                      ул. Примерна 123
                      <br />
                      София 1000, България
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-8 h-8 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl mb-2">Телефон</h3>
                    <a
                      href="tel:+359888123456"
                      className="text-gray-300 hover:text-gold-400 transition-colors text-lg"
                    >
                      +359 888 123 456
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-8 h-8 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl mb-2">Email</h3>
                    <a
                      href="mailto:info@example.com"
                      className="text-gray-300 hover:text-gold-400 transition-colors text-lg"
                    >
                      info@example.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-8 h-8 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl mb-3">Работно време</h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Понеделник - Петък</span>
                        <span className="text-gold-400 font-medium">09:00 - 19:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Събота</span>
                        <span className="text-gold-400 font-medium">10:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Неделя</span>
                        <span className="text-gray-500 font-medium">Почивен ден</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl p-8 border border-gold-500/10 shadow-2xl">
                <h2 className="font-serif text-3xl text-white mb-6">Изпратете запитване</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Име *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-charcoal-600/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                      placeholder="Вашето име"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-charcoal-600/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-charcoal-600/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                      placeholder="+359 888 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Съобщение *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-charcoal-600/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                      placeholder="Как можем да ви помогнем?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="w-5 h-5" />
                    {sending ? 'Изпращане...' : 'Изпрати съобщение'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-charcoal-500 to-charcoal-600 rounded-3xl overflow-hidden border border-gold-500/10 shadow-2xl">
            <div className="aspect-[21/9] bg-charcoal-700/50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gold-400/50 mx-auto mb-4" />
                <p className="text-gray-400">Карта на локацията</p>
                <p className="text-sm text-gray-500 mt-2">
                  Интеграция с Google Maps може да бъде добавена тук
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
