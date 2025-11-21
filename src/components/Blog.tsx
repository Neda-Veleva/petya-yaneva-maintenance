import { ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Грижа за миглите',
    title: 'Важни съвети за дълготрайни удължавания на мигли',
    excerpt: 'Научете най-добрите практики за поддръжка на красивите ви мигли и как да изглеждат свежи седмици наред.',
    link: '#',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXAlMjBsYXNoZXN8ZW58MXx8fHwxNzYzMTM0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Съвети за красота',
    title: 'Перфектният сутрешен ритуал за здрави мигли',
    excerpt: 'Разберете как да се грижите за естествените си мигли и да създадете нежен сутрешен режим за растеж и здравина.',
    link: '#',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1730226995154-efe9e13db300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9ucyUyMHZvbHVtZXxlbnwxfHx8fDE3NjMxMzQwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Подготовка',
    title: 'Как да се подготвите за първата си процедура за мигли',
    excerpt: 'Всичко, което трябва да знаете преди първата си сесия за удължаване, за да постигнете отлични резултати и преживяване.',
    link: '#',
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-gradient-to-br from-nude-50 via-nude-100 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-4">Най-нови статии</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Научете как да се грижите за миглите си, как да се подготвите за посещение и как да поддържате изискан бюти ритуал.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-medium text-gold-600 bg-gold-50 rounded-full mb-3">
                  {article.category}
                </span>

                <h3 className="font-serif text-2xl text-gray-900 mb-3 group-hover:text-gold-600 transition-colors duration-300">
                  {article.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                <a
                  href={article.link}
                  className="inline-flex items-center space-x-2 text-nude-500 hover:text-gold-600 font-medium transition-colors duration-300 group/link"
                >
                  <span>Прочети повече</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
