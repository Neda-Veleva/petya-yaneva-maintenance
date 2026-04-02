/** SEO / споделяне — използва се в index.html и Seo.tsx */
export const SEO_TITLE =
  'Lashes by Petya Yaneva Sofia | мигли Петя Янева София';

/** Основно описание за meta, Open Graph, Twitter (~120–160 знака е идеално за snippet) */
export const SEO_DESCRIPTION =
  'Открийте света на перфектните мигли и вежди. Запазете час днес и се насладете на луксозна грижа с професионален подход.';

/**
 * По-пълно описание за JSON-LD — допълва основното с локация и контакт,
 * без да променя краткия snippet в социалните мрежи.
 */
export const SEO_STRUCTURED_DESCRIPTION = `${SEO_DESCRIPTION} Студио Livon Hair Boutique, кв. Надежда, ул. „Чудомир“ 5, София. Телефон: +359 888 123 456. Работно време: всеки ден 08:00–21:00. Онлайн запис през Studio24.`;

export const SEO_KEYWORDS =
  'Петя Янева, мигли София, вежди София, мигли и вежди, Lashes by Petya Yaneva Sofia, Livon Hair Boutique, студио мигли, мигли Надежда, разширяване мигли, ламиниране вежди, Russian volume, eyelash extensions Sofia, lash artist Sofia';

/** Публичен линк за запис — съвпада с бутона „Запази час“ на сайта */
export const STUDIO_BOOKING_URL =
  'https://studio24.bg/m/livon-hair-boutique-s2482?m';

/**
 * Снимка за Open Graph, Twitter и JSON-LD `image` — избраната „fav“ визия (public/favicon.png).
 * Фонът на херо на страницата остава отделен файл — виж Home.tsx.
 */
export const SEO_SHARE_IMAGE_PATH = '/favicon.png';

export function getSiteUrl(): string {
  const env = import.meta.env.VITE_PUBLIC_SITE_URL;
  if (env && typeof env === 'string' && env.trim()) {
    return env.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}

export function absoluteUrl(path: string, siteUrl: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${p}`;
}

export function buildJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BeautySalon',
        '@id': `${siteUrl}/#business`,
        name: 'Lashes by Petya Yaneva',
        alternateName: [
          'Lashes by Petya Yaneva Sofia',
          'Livon Hair Boutique',
          'Петя Янева мигли',
          'мигли Петя Янева София',
        ],
        slogan: SEO_DESCRIPTION,
        description: SEO_STRUCTURED_DESCRIPTION,
        url: `${siteUrl}/`,
        image: absoluteUrl(SEO_SHARE_IMAGE_PATH, siteUrl),
        logo: absoluteUrl('/favicon.png', siteUrl),
        telephone: '+359888123456',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. „Чудомир“ 5',
          addressLocality: 'София',
          addressRegion: 'София',
          addressCountry: 'BG',
        },
        areaServed: {
          '@type': 'City',
          name: 'София',
          containedInPlace: {
            '@type': 'Country',
            name: 'България',
          },
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 42.735,
          longitude: 23.305,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '08:00',
          closes: '21:00',
        },
        priceRange: '$$',
        knowsAbout: [
          'разширяване на мигли',
          'мигли София',
          'перфектни мигли',
          'вежди',
          'грижа за мигли',
          'lash extensions',
          'Russian volume lashes',
        ],
        sameAs: [
          'https://www.instagram.com/petqqneva',
          'https://www.facebook.com/petencet000',
        ],
        potentialAction: {
          '@type': 'ReserveAction',
          name: 'Запазване на час онлайн',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: STUDIO_BOOKING_URL,
            inLanguage: 'bg-BG',
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
          },
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: SEO_TITLE,
        alternateName: [
          'Lashes by Petya Yaneva',
          'Lashes by Petya Yaneva Sofia',
        ],
        description: SEO_DESCRIPTION,
        inLanguage: 'bg-BG',
        publisher: { '@id': `${siteUrl}/#business` },
        about: { '@id': `${siteUrl}/#business` },
      },
    ],
  };
}
