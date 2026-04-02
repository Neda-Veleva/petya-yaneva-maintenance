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

## Deploy във Vercel

1. [Импортирайте репото](https://vercel.com/new) в GitHub → Vercel (или `vercel` CLI).
2. **Framework Preset:** Vite (проектът включва `vercel.json` — build `npm run build`, изход `dist`).
3. **Environment variables:** добавете **`VITE_PUBLIC_SITE_URL`** = пълният публичен URL на продукцията (напр. `https://твоят-домейн.bg`), **без** краен `/`. Така canonical, Open Graph и sitemap при build сочат към реалния домейн. При preview builds без тази променлива се ползва автоматично `VERCEL_URL` за sitemap.
4. След deploy проверете `/`, `robots.txt`, `sitemap.xml` и споделяне в социални мрежи (OG meta).
5. **Facebook / Messenger:** при липсващо превю използвайте [Sharing Debugger](https://developers.facebook.com/tools/debug/) — поставете URL и **„Scrape Again“**, за да се обнови кешът. Build-ът подава абсолютни `og:image` / `og:url` чрез `VERCEL_URL`, ако няма зададен `VITE_PUBLIC_SITE_URL`.
