import { Star, Quote } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  service: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Мария Иванова',
    rating: 5,
    date: '15 Ноември 2025',
    text: 'Изключително професионално отношение и невероятен резултат! Миглите ми изглеждат естествени и красиви. Определено ще се върна отново.',
    service: 'Удължаване на мигли 3D',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 2,
    name: 'Елена Георгиева',
    rating: 5,
    date: '10 Ноември 2025',
    text: 'Петя е истински майстор на своето дело! Студиото е чисто и уютно, а резултатът надмина очакванията ми. Препоръчвам на всички!',
    service: 'Ламиниране на мигли',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 3,
    name: 'Виктория Димитрова',
    rating: 5,
    date: '5 Ноември 2025',
    text: 'Най-добрите мигли, които съм правила досега! Много внимание към детайла и перфектна техника. Благодаря за страхотното изживяване!',
    service: 'Руски обем',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 4,
    name: 'Деница Петрова',
    rating: 5,
    date: '1 Ноември 2025',
    text: 'Страхотна атмосфера и невероятен резултат! Миглите ми издържаха много дълго време и изглеждаха перфектно. Много съм доволна!',
    service: 'Удължаване на мигли 2D',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 5,
    name: 'Симона Стоянова',
    rating: 5,
    date: '28 Октомври 2025',
    text: 'Най-после намерих перфектния специалист! Петя е много професионална и внимателна. Резултатът е невероятен!',
    service: 'Удължаване на мигли косъм по косъм',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 6,
    name: 'Ани Христова',
    rating: 5,
    date: '20 Октомври 2025',
    text: 'Безупречна работа! Миглите изглеждат много естествено и красиво.Studiото е уютно и чисто. Горещо препоръчвам!',
    service: 'Ламиниране + боядисване',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const stats = [
  { label: 'Доволни клиенти', value: '500+' },
  { label: 'Среден рейтинг', value: '5.0' },
  { label: 'Положителни отзиви', value: '98%' },
  { label: 'Години опит', value: '5+' }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-6">Отзиви от клиенти</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Вижте какво споделят нашите клиенти за техния опит с нас
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-nude-50 to-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl font-serif text-gold-500 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-nude-50 via-white to-nude-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold-400"
                  />
                  <div>
                    <h3 className="font-serif text-lg text-gray-900">{review.name}</h3>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-gold-400/30" />
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'fill-gold-500 text-gold-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{review.text}</p>

              <div className="pt-4 border-t border-nude-200">
                <span className="inline-block px-3 py-1 text-xs font-medium text-gold-600 bg-gold-50 rounded-full">
                  {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-gradient-to-r from-gold-50 via-nude-50 to-gold-50 rounded-3xl p-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 fill-gold-500 text-gold-500" />
              <span className="text-5xl font-serif text-gold-600">5.0</span>
            </div>
            <p className="text-gray-700 text-lg mb-4">
              Базирано на <span className="font-semibold text-gold-600">500+ отзива</span>
            </p>
            <p className="text-gray-600">
              Вашето мнение е важно за нас! Споделете вашия опит и помогнете на други клиенти да направят избор.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
