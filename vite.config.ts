import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
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
  normalizeSiteUrl,
} from './src/seo';

/** Escape text за HTML атрибути в кавички */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  /** Production: Vercel задава VERCEL_URL при build — Facebook иска абсолютни og:* URL без ръчно VITE_ */
  const siteUrl = normalizeSiteUrl(
    env.VITE_PUBLIC_SITE_URL ||
    process.env.VITE_PUBLIC_SITE_URL ||
    (process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  );

  return {
    plugins: [
      react(),
      {
        name: 'html-inject-og-urls',
        transformIndexHtml(html) {
          const imageUrl = absoluteUrl(SEO_SHARE_IMAGE_PATH, siteUrl);

          const canonicalBlock = siteUrl
            ? `<link rel="canonical" href="${siteUrl}/" />
    <meta property="og:url" content="${siteUrl}/" />`
            : `<link rel="canonical" href="/" />`;

          return html
            .replaceAll('__OG_CANONICAL_BLOCK__', canonicalBlock)
            .replaceAll('__OG_IMAGE__', imageUrl)
            .replaceAll('__SEO_TITLE__', escapeAttr(SEO_TITLE))
            .replaceAll('__SEO_DESCRIPTION__', escapeAttr(SEO_DESCRIPTION))
            .replaceAll('__SEO_KEYWORDS__', escapeAttr(SEO_KEYWORDS))
            .replaceAll('__SEO_OG_SITE_NAME__', escapeAttr(SEO_OG_SITE_NAME))
            .replaceAll('__SEO_SHARE_IMAGE_TYPE__', SEO_SHARE_IMAGE_TYPE)
            .replaceAll('__SEO_SHARE_IMAGE_WIDTH__', String(SEO_SHARE_IMAGE_WIDTH))
            .replaceAll('__SEO_SHARE_IMAGE_HEIGHT__', String(SEO_SHARE_IMAGE_HEIGHT))
            .replaceAll('__SEO_OG_IMAGE_ALT__', escapeAttr(SEO_OG_IMAGE_ALT));
        },
      },
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
