# Lashes by Petya Yaneva — landing

Статична страница (Vite + React + Tailwind). Снимка за херо: `public/hero.jpg`.

```bash
npm install
npm run dev
```

## SEO и публикуване

- Задайте пълния URL на сайта в `.env` като `VITE_PUBLIC_SITE_URL=https://www.petya-yaneva.com` (без краен `/`). Използва се за canonical, Open Graph и JSON-LD в `src/seo.ts` и `src/components/Seo.tsx`.
- При `npm run build` скриптът `prebuild` генерира `public/sitemap.xml` от същата променлива. Ако липсва, build-ът по подразбиране използва `https://www.petya-yaneva.com`.
- `public/robots.txt` сочи към sitemap; `public/llms.txt` е кратко резюме за AI crawlers.
- Вижте също статичните meta тагове в `index.html` (fallback преди хидратация).

## Deploy във Vercel

1. [Импортирайте репото](https://vercel.com/new) в GitHub → Vercel (или `vercel` CLI).
2. **Framework Preset:** Vite (проектът включва `vercel.json` — build `npm run build`, изход `dist`).
3. **Environment variables:** добавете **`VITE_PUBLIC_SITE_URL=https://www.petya-yaneva.com`**. Така canonical, Open Graph и sitemap при build сочат към реалния домейн.
4. След deploy проверете `/`, `robots.txt`, `sitemap.xml` и споделяне в социални мрежи (OG meta).
5. **Facebook / Messenger:** при липсващо превю използвайте [Sharing Debugger](https://developers.facebook.com/tools/debug/) — поставете URL и **„Scrape Again“**, за да се обнови кешът. Build-ът подава абсолютни `og:image` / `og:url` към `https://www.petya-yaneva.com`.
