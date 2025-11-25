import { useState } from 'react';

interface Service {
  name: string;
  duration: string;
  price: string;
}

interface Category {
  id: string;
  name: string;
  services: Service[];
}

const categories: Category[] = [
  {
    id: 'lashes',
    name: 'Мигли',
    services: [
      {
        name: 'Удължаване на мигли косъм по косъм',
        duration: '1 ч. 30 мин.',
        price: '80 лв.'
      },
      {
        name: 'Удължаване на мигли 2D техника',
        duration: '2 ч.',
        price: '80 лв.'
      },
      {
        name: 'Удължаване на мигли 3D/4D техника',
        duration: '1 ч. 45 мин.',
        price: '90 лв.'
      },
      {
        name: 'Удължаване на мигли тип 3D W shape',
        duration: '1 ч. 45 мин.',
        price: '96 лв.'
      },
      {
        name: 'Удължаване на мигли очна линия',
        duration: '2 ч. 30 мин.',
        price: '100 лв.'
      },
      {
        name: 'Мигли руски обем',
        duration: '2 ч. 30 мин.',
        price: '140 лв.'
      },
      {
        name: 'Ламиниране + боядисване на мигли',
        duration: '1 ч.',
        price: '75 лв.'
      },
      {
        name: 'Ламиниране на мигли с Lovely',
        duration: '1 ч.',
        price: '60 лв.'
      },
      {
        name: 'Поддръжка на мигли до 3-та седмица',
        duration: '1 ч. 30 мин.',
        price: 'от 60 лв.'
      },
      {
        name: 'Сваляне на мигли',
        duration: '30 мин.',
        price: '30 лв.'
      },
      {
        name: 'Боядисване на мигли',
        duration: '30 мин.',
        price: '30 лв.'
      },
      {
        name: 'Боядисване на долни мигли',
        duration: '35 мин.',
        price: '30 лв.'
      },
      {
        name: 'Нано мъгла за мигли',
        duration: '5 мин.',
        price: '10 лв.'
      },
      {
        name: 'Камъчета (декорация) към миглите',
        duration: '10 мин.',
        price: '5 лв. / бр.'
      },
      {
        name: 'Цветни мигли (цели) към удължаване',
        duration: '1 ч.',
        price: '30 лв.'
      },
      {
        name: 'Цветни мигли (декорация) в края на миглите',
        duration: '15 мин.',
        price: '7 лв.'
      }
    ]
  },
  {
    id: 'brows',
    name: 'Вежди',
    services: [
      {
        name: 'Боядисване на вежди',
        duration: '20 мин.',
        price: '15 лв.'
      },
      {
        name: 'Оформяне на вежди с конец',
        duration: '15 мин.',
        price: '10 лв.'
      },
      {
        name: 'Микроблейдинг на вежди',
        duration: '2 ч.',
        price: '200 лв.'
      }
    ]
  },
  {
    id: 'facial',
    name: 'Други услуги за лице',
    services: [
      {
        name: 'Почистване на лице',
        duration: '1 ч.',
        price: '60 лв.'
      },
      {
        name: 'Хидратираща терапия',
        duration: '45 мин.',
        price: '50 лв.'
      },
      {
        name: 'Антиейдж масаж на лице',
        duration: '30 мин.',
        price: '40 лв.'
      }
    ]
  }
];

export default function PriceList() {
  const [activeCategory, setActiveCategory] = useState<string>('lashes');

  const currentCategory = categories.find(cat => cat.id === activeCategory);

  const services = currentCategory?.services || [];
  const shouldSplit = services.length > 6;
  const midPoint = Math.ceil(services.length / 2);
  const leftServices = shouldSplit ? services.slice(0, midPoint) : services;
  const rightServices = shouldSplit ? services.slice(midPoint) : [];

  return (
    <section id="prices" className="py-24 bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-gold-500 mb-6">Ценоразпис</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Прозрачни цени за премиум услуги за мигли и красота
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-2 shadow-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gold-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid ${shouldSplit ? 'md:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'} gap-8`}>
          <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
            <div className="space-y-5">
              {leftServices.map((service, index) => (
                <div
                  key={index}
                  className="group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-serif text-xl md:text-2xl text-gray-800 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-4">
                      <div className="hidden md:block flex-1 border-b-2 border-dotted border-gold-300 min-w-[60px]"></div>
                      <span className="font-serif text-2xl md:text-3xl text-gold-500 font-semibold whitespace-nowrap">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {index < leftServices.length - 1 && (
                    <div className="mt-5 border-b border-nude-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {shouldSplit && rightServices.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
              <div className="space-y-5">
                {rightServices.map((service, index) => (
                  <div
                    key={index}
                    className="group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-serif text-xl md:text-2xl text-gray-800 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500">{service.duration}</p>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-4">
                        <div className="hidden md:block flex-1 border-b-2 border-dotted border-gold-300 min-w-[60px]"></div>
                        <span className="font-serif text-2xl md:text-3xl text-gold-500 font-semibold whitespace-nowrap">
                          {service.price}
                        </span>
                      </div>
                    </div>

                    {index < rightServices.length - 1 && (
                      <div className="mt-5 border-b border-nude-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm italic">
            Всички процедури включват безплатна консултация и съвети за поддръжка
          </p>
        </div>
      </div>
    </section>
  );
}
