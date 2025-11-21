import { useState } from 'react';
import { Calendar, User, Mail, Sparkles } from 'lucide-react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-nude-100 via-nude-50 to-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-400/20 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-gold-500" />
          </div>
          <h2 className="font-serif text-5xl text-gold-500 mb-4">Запази час</h2>
          <p className="text-gray-600 text-lg">
            Резервирайте своето място за луксозно изживяване с мигли
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 ml-1">
              Пълно име
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-nude-50 border border-nude-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                placeholder="Въведете вашето име"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 ml-1">
              Имейл адрес
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-nude-50 border border-nude-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                placeholder="vashe@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 ml-1">
              Изберете услуга
            </label>
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-nude-50 border border-nude-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Изберете услуга</option>
                <option value="extensions">Удължаване на мигли - 100 лв.</option>
                <option value="tinting">Боядисване на мигли - 40 лв.</option>
                <option value="lift">Ламиниране на мигли - 80 лв.</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 ml-1">
              Предпочитана дата
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-nude-50 border border-nude-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blush-500 hover:bg-blush-600 text-white text-gold-50 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <span className="text-lg">Изпрати запитване</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
