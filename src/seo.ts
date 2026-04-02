/** SEO / sharing — used in index.html and Seo.tsx */
export const DEFAULT_SITE_URL = 'https://www.petya-yaneva.com';

export const SEO_TITLE =
  'Петя Янева София | Lashes by Petya Yaneva | Удължаване на мигли';

/** Main description for meta, Open Graph and Twitter */
export const SEO_DESCRIPTION =
  'Петя Янева в София предлага професионално удължаване на мигли, UV lashes, 2D, 3D, руски обем и ламиниране с индивидуален подход и професионална грижа.';

/** Extended description for JSON-LD */
export const SEO_STRUCTURED_DESCRIPTION =
  'Петя Янева София е бранд за професионално удължаване на мигли с техники косъм по косъм, 2D, 3D, руски обем и UV lashes, съвременна технология, достъпна само в ограничен брой салони. Петя Янева посреща своите клиенти в Livon Hair Boutique, кв. Надежда, ул. „Чудомир“ 5, София. Налични са онлайн записване и контакт по телефон.';

/** Short slogan used in structured data */
export const SEO_SLOGAN =
  'Професионално удължаване на мигли в София';

/** Keywords (low SEO weight but fine to keep) */
export const SEO_KEYWORDS =
  'Петя Янева София, Петя Янева, мигли Петя Янева София, мигли София, удължаване на мигли София, мигли косъм по косъм София, UV lashes София, 2D мигли София, 3D мигли София, руски обем мигли София, ламиниране на мигли София, ламиниране на вежди София, Livon Hair Boutique, eyelash extensions Sofia, lash artist Sofia, Russian volume lashes Sofia';

/** Public booking link */
export const STUDIO_BOOKING_URL =
  'https://studio24.bg/m/livon-hair-boutique-s2482?m';

/** Share image for Open Graph, Twitter and JSON-LD */
export const SEO_SHARE_IMAGE_PATH = '/og-share.jpg';
export const SEO_SHARE_IMAGE_TYPE = 'image/jpeg';
export const SEO_SHARE_IMAGE_WIDTH = 1200;
export const SEO_SHARE_IMAGE_HEIGHT = 630;

/** og:site_name — кратко име за Facebook / Messenger */
export const SEO_OG_SITE_NAME = 'Lashes by Petya Yaneva Sofia';

/** og:image:alt */
export const SEO_OG_IMAGE_ALT =
  'Lashes by Petya Yaneva Sofia — мигли и вежди, Петя Янева';

export function normalizeSiteUrl(value?: string | null): string {
  return typeof value === 'string' ? value.trim().replace(/\/$/, '') : '';
}

export function getSiteUrl(): string {
  const env = normalizeSiteUrl(import.meta.env.VITE_PUBLIC_SITE_URL);

  if (env) {
    return env;
  }

  if (typeof document !== 'undefined') {
    const candidates = [
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ];

    for (const candidate of candidates) {
      const normalized = normalizeSiteUrl(candidate);
      if (/^https?:\/\//i.test(normalized)) {
        return normalized;
      }
    }
  }

  if (typeof window !== 'undefined') {
    return normalizeSiteUrl(window.location.origin);
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
          'Петя Янева София',
          'Петя Янева',
          'мигли Петя Янева София',
        ],
        slogan: SEO_SLOGAN,
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
          postalCode: '1220',
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
        openingHoursSpecification: [
          {
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
        ],
        priceRange: '$$',
        knowsAbout: [
          'удължаване на мигли',
          'мигли косъм по косъм',
          'UV lashes',
          '2D мигли',
          '3D мигли',
          'руски обем мигли',
          'ламиниране на мигли',
          'ламиниране на вежди',
          'eyelash extensions Sofia',
          'lash artist Sofia',
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
        name: 'Lashes by Petya Yaneva',
        alternateName: [
          'Lashes by Petya Yaneva Sofia',
          'Петя Янева София',
        ],
        description: SEO_DESCRIPTION,
        inLanguage: 'bg-BG',
        publisher: { '@id': `${siteUrl}/#business` },
        about: { '@id': `${siteUrl}/#business` },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: SEO_TITLE,
        description: SEO_DESCRIPTION,
        inLanguage: 'bg-BG',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#business` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl(SEO_SHARE_IMAGE_PATH, siteUrl),
        },
      },
    ],
  };
}
