Before doing anything, read CLAUDE.md and follow all instructions there.

Then read src/styles/variables.css to use those CSS custom properties.

Goal: Improve the SEO of the entire site so every page ranks well on Google, appears correctly in social media previews (Open Graph / Twitter Cards), and shows up in local search results.

Tasks:

1. **Global SEO base component** — Create src/components/SEO.astro:
   - Accepts props: title, description, image, url, type (default "website"), noindex
   - Outputs: <title>, meta description, canonical, Open Graph tags (og:title, og:description, og:image, og:url, og:type, og:locale), Twitter Card tags, robots meta
   - Default og:image pointing to a static /og-default.jpg
   - Language: es-ES

2. **Layout integration** — Import and use SEO.astro in src/layouts/Layout.astro (or BaseLayout), passing sensible defaults for the whole site

3. **Per-page SEO** — Update these pages to pass unique SEO props:
   - src/pages/index.astro → title "El Rincón de Héctor | Restaurante en [city]", description focused on local keywords
   - src/pages/carta.astro → title "Carta | El Rincón de Héctor", description mentioning tapas, pizzas, hamburguesas
   - Any other existing pages in src/pages/

4. **Structured data (JSON-LD)** — In Layout.astro or a new component, add a <script type="application/ld+json"> with Restaurant schema:
   - @type: Restaurant
   - name, url, telephone, address (PostalAddress), servesCuisine, menu, openingHoursSpecification
   - Fill with realistic placeholder values for El Rincón de Héctor — mark TODOs where real data is needed

5. **sitemap.xml** — Install @astrojs/sitemap, add it to astro.config.mjs integrations, set site URL as a TODO constant

6. **robots.txt** — Create public/robots.txt allowing all crawlers and pointing to /sitemap-index.xml

7. **Performance hints** (affects SEO ranking):
   - Add <link rel="preconnect"> for Google Fonts in the <head>
   - Make sure all <img> tags in existing pages have alt attributes and explicit width/height

Use only Astro, TypeScript, and vanilla CSS / CSS custom properties from variables.css. No extra dependencies except @astrojs/sitemap.
All content and meta descriptions in Spanish.