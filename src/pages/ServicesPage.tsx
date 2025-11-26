import { Eye, Palette, TrendingUp, Sparkles, Crown, Scissors, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categories = [
  {
    id: 'lashes',
    name: 'Мигли',
    icon: Eye,
    services: [
      {
        name: 'Удължаване на мигли косъм по косъм',
        duration: '1 ч. 30 мин.',
        price: '80 лв.',
        description: 'Класическа техника за естествен и елегантен вид',
        image: 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Удължаване на мигли 2D техника',
        duration: '2 ч.',
        price: '80 лв.',
        description: 'Добавя обем и плътност за по-драматичен ефект',
        image: 'https://images.pexels.com/photos/7755472/pexels-photo-7755472.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Удължаване на мигли 3D/4D техника',
        duration: '1 ч. 45 мин.',
        price: '90 лв.',
        description: 'Максимален обем и луксозен вид',
        image: 'https://images.pexels.com/photos/3997983/pexels-photo-3997983.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Удължаване на мигли тип 3D W shape',
        duration: '1 ч. 45 мин.',
        price: '96 лв.',
        description: 'Специална форма за изразителен и отворен поглед',
        image: 'https://images.pexels.com/photos/5177992/pexels-photo-5177992.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Удължаване на мигли очна линия',
        duration: '2 ч. 30 мин.',
        price: '100 лв.',
        description: 'Ефект на очна линия за по-драматичен вид',
        image: 'https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Мигли руски обем',
        duration: '2 ч. 30 мин.',
        price: '140 лв.',
        description: 'Максимален обем с множество тънки косъмчета',
        image: 'https://images.unsplash.com/photo-1674049406467-824ea37c7184?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Ламиниране + боядисване на мигли',
        duration: '1 ч.',
        price: '75 лв.',
        description: 'Повдигане и извивка с дълготраен цвят',
        image: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Ламиниране на мигли с Lovely',
        duration: '1 ч.',
        price: '60 лв.',
        description: 'Естествено повдигане с премиум продукти',
        image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Поддръжка на мигли до 3-та седмица',
        duration: '1 ч. 30 мин.',
        price: 'от 60 лв.',
        description: 'Попълване и освежаване на съществуващи мигли',
        image: 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Сваляне на мигли',
        duration: '30 мин.',
        price: '30 лв.',
        description: 'Професионално и безопасно премахване',
        image: 'https://images.pexels.com/photos/7755472/pexels-photo-7755472.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Боядисване на мигли',
        duration: '30 мин.',
        price: '30 лв.',
        description: 'Дълбок цвят за изразителен поглед',
        image: 'https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Боядисване на долни мигли',
        duration: '35 мин.',
        price: '30 лв.',
        description: 'Завършек на перфектния поглед',
        image: 'https://images.pexels.com/photos/3997983/pexels-photo-3997983.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Нано мъгла за мигли',
        duration: '5 мин.',
        price: '10 лв.',
        description: 'Допълнителна грижа и защита',
        image: 'https://images.pexels.com/photos/5177992/pexels-photo-5177992.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Камъчета (декорация) към миглите',
        duration: '10 мин.',
        price: '5 лв. / бр.',
        description: 'Изискана декорация за специални случаи',
        image: 'https://images.unsplash.com/photo-1674049406467-824ea37c7184?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Цветни мигли (цели) към удължаване',
        duration: '1 ч.',
        price: '30 лв.',
        description: 'Смел и креативен вид с цветни мигли',
        image: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Цветни мигли (декорация) в края на миглите',
        duration: '15 мин.',
        price: '7 лв.',
        description: 'Фино цветно докосване',
        image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]
  },
  {
    id: 'brows',
    name: 'Вежди',
    icon: Crown,
    services: [
      {
        name: 'Боядисване на вежди',
        duration: '20 мин.',
        price: '15 лв.',
        description: 'Перфектен цвят и дефиниция',
        image: 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Оформяне на вежди с конец',
        duration: '15 мин.',
        price: '10 лв.',
        description: 'Прецизна и деликатна техника',
        image: 'https://images.pexels.com/photos/7755472/pexels-photo-7755472.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Микроблейдинг на вежди',
        duration: '2 ч.',
        price: '200 лв.',
        description: 'Полу-перманентна техника за естествени вежди',
        image: 'https://images.pexels.com/photos/3997983/pexels-photo-3997983.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]
  },
  {
    id: 'facial',
    name: 'Други услуги за лице',
    icon: Heart,
    services: [
      {
        name: 'Почистване на лице',
        duration: '1 ч.',
        price: '60 лв.',
        description: 'Дълбоко почистване и освежаване',
        image: 'https://images.pexels.com/photos/5177992/pexels-photo-5177992.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Хидратираща терапия',
        duration: '45 мин.',
        price: '50 лв.',
        description: 'Интензивна хидратация и грижа',
        image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Антиейдж масаж на лице',
        duration: '30 мин.',
        price: '40 лв.',
        description: 'Подмладяващ и релаксиращ масаж',
        image: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?auto=compress&cs=tinysrgb&w=800'
      }
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=compress&cs=tinysrgb&w=1920"
            alt="Beauty services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/90 via-charcoal-600/80 to-charcoal-600/90"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-400/50 backdrop-blur-md rounded-full border border-gold-500/30 shadow-gold-glow mb-8">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium tracking-wide">Премиум Beauty Studio</span>
          </div>

          <h1 className="font-serif text-6xl lg:text-7xl text-white mb-6 leading-none tracking-tight">
            Нашите
          </h1>
          <h2 className="font-serif text-6xl lg:text-7xl bg-gold-shimmer bg-clip-text text-transparent mb-8 leading-none tracking-tight animate-shimmer">
            Услуги
          </h2>
          <div className="h-1 w-32 bg-gold-shimmer animate-shimmer mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Открийте нашата пълна селекция от специализирани услуги за мигли, вежди и лице.
            Всяка процедура е изпълнена с внимание към детайла и използване на премиум продукти.
          </p>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {categories.map((category, categoryIndex) => (
            <div key={category.id} className={categoryIndex > 0 ? 'mt-32' : ''}>
              {/* Category Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-shimmer rounded-full mb-6 shadow-gold-glow">
                  <category.icon className="w-10 h-10 text-charcoal-600" />
                </div>
                <h2 className="font-serif text-5xl text-gold-500 mb-4">{category.name}</h2>
                <div className="h-1 w-24 bg-gold-shimmer mx-auto"></div>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.services.map((service, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-600/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-serif text-xl text-white mb-1">{service.name}</h3>
                        <p className="text-sm text-gold-300">{service.duration}</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-gray-600 leading-relaxed text-sm">{service.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-nude-200">
                        <span className="text-2xl font-serif text-gold-500 font-semibold">{service.price}</span>
                        <a
                          href="#contact"
                          className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                        >
                          Запази
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
            Готови за промяна?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Запазете своя час днес и открийте магията на професионалната грижа за мигли
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="group px-10 py-5 bg-gold-shimmer text-charcoal-600 rounded-full font-semibold transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 flex items-center gap-2"
            >
              <span>Запази час сега</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </a>
            <a
              href="/"
              className="px-10 py-5 bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10 rounded-full font-semibold transition-all duration-300 hover:shadow-gold-glow"
            >
              Към началото
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
