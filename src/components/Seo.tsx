import { useEffect } from 'react';
import {
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_OG_IMAGE_ALT,
  SEO_OG_SITE_NAME,
  SEO_SHARE_IMAGE_HEIGHT,
  SEO_SHARE_IMAGE_PATH,
  SEO_SHARE_IMAGE_TYPE,
  SEO_SHARE_IMAGE_WIDTH,
  SEO_TITLE,
  absoluteUrl,
  buildJsonLd,
  getSiteUrl,
} from '../seo';

function setMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkByRel(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo() {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    if (!siteUrl) return;

    document.title = SEO_TITLE;
    setMetaByName('description', SEO_DESCRIPTION);
    setMetaByName('keywords', SEO_KEYWORDS);
    setMetaByName('author', 'Petya Yaneva');
    setMetaByName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    setLinkByRel('canonical', `${siteUrl}/`);

    const ogImage = absoluteUrl(SEO_SHARE_IMAGE_PATH, siteUrl);
    setLinkByRel('image_src', ogImage);
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:locale', 'bg_BG');
    setMetaProperty('og:url', `${siteUrl}/`);
    setMetaProperty('og:title', SEO_TITLE);
    setMetaProperty('og:description', SEO_DESCRIPTION);
    setMetaProperty('og:image', ogImage);
    setMetaProperty('og:image:url', ogImage);
    setMetaProperty('og:image:secure_url', ogImage);
    setMetaProperty('og:image:type', SEO_SHARE_IMAGE_TYPE);
    setMetaProperty('og:image:width', String(SEO_SHARE_IMAGE_WIDTH));
    setMetaProperty('og:image:height', String(SEO_SHARE_IMAGE_HEIGHT));
    setMetaProperty('og:image:alt', SEO_OG_IMAGE_ALT);
    setMetaProperty('og:site_name', SEO_OG_SITE_NAME);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', SEO_TITLE);
    setMetaByName('twitter:description', SEO_DESCRIPTION);
    setMetaByName('twitter:image', ogImage);
    setMetaByName('twitter:image:alt', SEO_OG_IMAGE_ALT);

    const jsonLd = buildJsonLd(siteUrl);
    const old = document.getElementById('jsonld-seo');
    if (old) old.remove();
    const script = document.createElement('script');
    script.id = 'jsonld-seo';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
