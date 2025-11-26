import { Eye, Palette, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'Удължаване на мигли',
    description: 'Луксозен обем и дължина, създадени специално за вашата естествена красота с премиум материали.',
    price: '100 лв.',
    image: 'https://images.unsplash.com/photo-1674049406467-824ea37c7184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9ucyUyMGNsb3NldXB8ZW58MXx8fHwxNzYzMTMzNDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Eye,
    link: '/services/lashes',
  },
  {
    id: 2,
    title: 'Боядисване на мигли',
    description: 'Дълбок, наситен цвят, който подчертава и оформя естествените ви мигли за изразителен поглед.',
    price: '40 лв.',
    image: 'https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Palette,
    link: '/service/lash-tinting',
  },
  {
    id: 3,
    title: 'Ламиниране на мигли',
    description: 'Естествено повдигане и извивка, които отварят погледа и създават ефект на будно излъчване.',
    price: '80 лв.',
    image: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXAlMjBsYXNoZXN8ZW58MXx8fHwxNzYzMTM0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: TrendingUp,
    link: '/service/lash-lift-tint',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">Нашите услуги</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Открийте селекцията ни от прецизно изпълнени терапии за мигли, създадени да подчертаят естествената ви красота
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.link}
              className="group bg-nude-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nude-500/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-gold-500" />
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h3 className="font-serif text-2xl text-gold-600">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-center pt-4 border-t border-nude-200">
                  <span className="text-3xl font-serif text-gray-900">{service.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <a
            href="/services"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-400 to-gold-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>Виж всички услуги</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
