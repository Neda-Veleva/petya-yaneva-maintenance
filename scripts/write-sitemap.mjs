import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

let base = process.env.VITE_PUBLIC_SITE_URL?.trim();
if (!base && process.env.VERCEL_URL) {
  base = `https://${process.env.VERCEL_URL}`;
}
if (!base) {
  try {
    const env = readFileSync(resolve(root, '.env'), 'utf8');
    const m = env.match(/^\s*VITE_PUBLIC_SITE_URL\s*=\s*(.+)$/m);
    if (m) base = m[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    /* no .env */
  }
}
if (!base) base = 'https://example.com';
base = base.replace(/\/$/, '');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8');
console.log('[write-sitemap] public/sitemap.xml →', `${base}/`);
