import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { SEO_SHARE_IMAGE_PATH } from './src/seo';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'html-inject-og-urls',
        transformIndexHtml(html) {
          const imageUrl = siteUrl
            ? `${siteUrl}${SEO_SHARE_IMAGE_PATH}`
            : SEO_SHARE_IMAGE_PATH;
          const canonicalMeta = siteUrl
            ? `<meta property="og:url" content="${siteUrl}/" />`
            : '';
          return html
            .replaceAll('__OG_CANONICAL_META__', canonicalMeta)
            .replaceAll('__OG_IMAGE__', imageUrl);
        },
      },
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
