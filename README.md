# Lashes by Petya Yaneva — landing

Статична страница (Vite + React + Tailwind). Снимка за херо: `public/hero.png`.

```bash
npm install
npm run dev
```

## SEO и публикуване

- Задайте пълния URL на сайта в `.env` като `VITE_PUBLIC_SITE_URL=https://вашият-домейн.bg` (без краен `/`). Използва се за canonical, Open Graph и JSON-LD в `src/seo.ts` и `src/components/Seo.tsx`.
- При `npm run build` скриптът `prebuild` генерира `public/sitemap.xml` от същата променлива (или от `.env` в корена, или временно `https://example.com` — сменете преди продукция).
- `public/robots.txt` сочи към sitemap; `public/llms.txt` е кратко резюме за AI crawlers.
- Вижте също статичните meta тагове в `index.html` (fallback преди хидратация).
