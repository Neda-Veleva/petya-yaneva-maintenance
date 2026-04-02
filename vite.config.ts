import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import {
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_OG_IMAGE_ALT,
  SEO_OG_SITE_NAME,
  SEO_SHARE_IMAGE_PATH,
  SEO_TITLE,
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
  const siteUrl = (
    env.VITE_PUBLIC_SITE_URL ||
    process.env.VITE_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  )
    .trim()
    .replace(/\/$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'html-inject-og-urls',
        transformIndexHtml(html) {
          const imageUrl = siteUrl
            ? `${siteUrl}${SEO_SHARE_IMAGE_PATH}`
            : SEO_SHARE_IMAGE_PATH;

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
            .replaceAll('__SEO_OG_IMAGE_ALT__', escapeAttr(SEO_OG_IMAGE_ALT));
        },
      },
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
