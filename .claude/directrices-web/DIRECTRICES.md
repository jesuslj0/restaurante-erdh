# Directrices de desarrollo web

> Documento de contexto **transversal** para todos nuestros proyectos web.
> Define el stack, la estructura y las convenciones que seguimos por defecto en cada
> nueva página, **hasta que se indique lo contrario**.
>
> Cada proyecto puede tener además su propio `CLAUDE.md` con los detalles concretos
> de ese cliente (paleta, componentes, copy). Este documento manda en lo general;
> el `CLAUDE.md` del proyecto manda en lo específico.

---

## 1. Stack tecnológico

| Capa            | Herramienta                                   | Notas                                              |
|-----------------|-----------------------------------------------|----------------------------------------------------|
| Framework       | **Astro 6** + TypeScript                      | SSG por defecto. Islas solo cuando hagan falta.    |
| Estilos         | **Tailwind CSS v4** vía `@tailwindcss/vite`   | Sin `tailwind.config.js`: la config vive en CSS.   |
| CSS custom      | CSS propio solo para lo imposible con Tailwind | Tokens, capas de componentes, `background-image`.  |
| Interactividad  | **React** (islas Astro) **solo si es necesario** | Preferir Astro + JS vanilla / GSAP antes que React. |
| Iconos          | **Lucide** (`astro-icon` → `lucide:*`)        | Redes sociales: `simple-icons:*`.                  |
| Animación       | **GSAP** + **ScrollTrigger** (opcional)       | Para scroll-driven, scrub de vídeo, reveals.       |
| Scroll suave    | **Lenis** (opcional)                          | Integrado con el ticker de GSAP.                   |
| SEO             | `@astrojs/sitemap` + componente `SEO.astro`   | Open Graph, Twitter Card, JSON-LD.                 |
| Node            | **≥ 22.12**                                   | Declarar en `engines` de `package.json`.           |

**Cuándo añadir React:** solo para UI con estado complejo en cliente (formularios
ricos, filtros interactivos, widgets). Para hover, menús, slide-ins y scroll usamos
Astro + un `<script>` o GSAP. No instalar `@astrojs/react` "por si acaso".

Arranque en local: `npm run dev` (puerto 4321).

---

## 2. Estructura de carpetas y archivos

Misma estructura en todos los proyectos:

```
proyecto/
  astro.config.mjs        # site URL + integraciones (icon, sitemap) + plugin tailwind
  tsconfig.json           # extends "astro/tsconfigs/strict"
  CLAUDE.md               # contexto específico del cliente
  public/
    favicon/              # set completo (ico, png 16/32, apple-touch, webmanifest)
    favicon.svg
    robots.txt
    imgs/                 # imágenes optimizadas del sitio
    videos/               # vídeo (versión normal + versión -scrub si hay scroll-scrub)
  src/
    components/           # componentes Astro reutilizables (un archivo por componente)
    data/                 # datos extraídos del markup (nav.ts, menús, etc.)
    layouts/
      Layout.astro        # layout base con <head>, SEO, JSON-LD y slots
    pages/
      index.astro         # páginas; aquí se montan componentes y se pasan props
      carta.astro         # (páginas adicionales según proyecto)
      404.astro
    scripts/              # JS de cliente (lenis.js, animaciones GSAP)
    styles/
      global.css          # punto de entrada: @import tailwindcss + variables + buttons
      variables.css       # tokens de color y fuentes (@theme de Tailwind v4)
      buttons.css         # clases de componente (.btn-primary, .btn-secondary)
      fonts.css           # @font-face si las fuentes son locales
```

Reglas de organización:
- **Un componente por archivo** en `src/components/`, PascalCase.
- **Los datos repetitivos** (enlaces de nav, redes, ítems de menú) van a `src/data/*.ts`
  tipados y se importan donde hagan falta. No hardcodear listas en el markup.
- **El JS de cliente** vive en `src/scripts/` y se importa desde un `<script>` del layout
  o del componente, nunca inline largo.
- **Las páginas montan y orquestan**; la lógica visual vive en los componentes.

---

## 3. Sistema de estilos (Tailwind v4)

### 3.1 Tokens de color y fuentes — `variables.css`

Toda la paleta se define con `@theme` (no hay `tailwind.config.js`):

```css
@theme {
  --color-primary: #ffffff;     /* texto principal, títulos        */
  --color-secondary: #d4d4d4;   /* texto secundario, links         */
  --color-bg: #171717;          /* fondos                          */

  --color-accent: #c97a2b;      /* acento principal                */
  --color-accent-light: #...;   /* variantes del acento            */
  --color-accent-dark: #...;
  --color-text-accent: #...;    /* texto sobre acento              */

  --font-body: 'Jost', sans-serif;
  --font-display: 'Cormorant Garamond', serif;
}
```

Esto genera utilidades: `text-primary`, `bg-bg`, `text-accent`, `font-display`, etc.,
con variantes de opacidad (`text-secondary/60`, `bg-accent/50`, …).

### 3.2 Punto de entrada — `global.css`

```css
@import "tailwindcss";
@import "./variables.css";
@import "./buttons.css";

body, html {
  @apply min-h-screen bg-bg text-secondary font-body;
  overflow-x: clip;
}
```

### 3.3 Botones — `buttons.css`

Clases de componente con `@layer components` y `@apply`. Reutilizables en cualquier
`<a>` o `<button>`. Definir las variantes base aquí; **nunca** estilos de botón inline.

```css
@layer components {
  .btn-primary  { @apply inline-flex items-center gap-2 ... bg-accent/50 text-primary hover:bg-accent hover:text-bg; }
  .btn-secondary{ @apply inline-flex items-center gap-2 ... bg-primary/30 text-primary hover:bg-primary hover:text-bg; }
}
```

### Reglas de estilo

1. **Solo Tailwind** para estilos. Nada de `style=""` inline ni CSS propio salvo lo
   imposible con utilidades (p. ej. `background-image` con URL local → `<style>` scoped).
2. **Siempre tokens de color** (`text-primary`, `bg-bg`, `text-accent`…). Nunca colores
   crudos de la paleta Tailwind (`neutral-*`, `emerald-*`, `#hex` sueltos).
3. **`@apply`** solo con utilidades de Tailwind, nunca con clases propias.
4. Personalización por cliente = cambiar los **tokens**, no los componentes.

---

## 4. Convenciones de componentes Astro

1. **Tipado explícito** de props con `interface Props` en el frontmatter.
2. **Props opcionales** con `?` y **valores por defecto** en la desestructuración.
3. Los componentes reciben datos **por props**; se montan en las páginas.
4. **Iconos** solo de colecciones instaladas (`lucide`, `simple-icons`) vía
   `import { Icon } from 'astro-icon/components'`.
5. Cuidado con `backdrop-filter`: rompe `position: fixed` de los hijos. Si un panel
   fijo va dentro de un contenedor con `backdrop-blur`, sácalo de ese contenedor.
6. Accesibilidad básica: navegación por teclado (Escape para cerrar), `lang` correcto,
   textos alternativos, foco visible.

Ejemplo de patrón de props:

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  cta?: { label: string; link: string; icon: string };
}
const { title, subtitle, cta } = Astro.props;
---
```

---

## 5. Layout base

`Layout.astro` centraliza `<head>`, fuentes, favicons, SEO y JSON-LD, y expone
**slots con nombre** para componer la página:

```astro
<Layout restaurantName="..." seo={{ title, description, image }}>
  <Header slot="header" ... />
  <Hero slot="hero" ... />
  <About slot="about" ... />
  <Footer slot="footer" ... />
</Layout>
```

El `<body>` ordena: `header` → `<main>` (hero, showcase, about, reviews, …) → `footer`.

Incluye siempre:
- `<html lang="es">` (o el idioma del cliente).
- `viewport` con `viewport-fit=cover`.
- Set completo de favicons desde `public/favicon/`.
- Preconnect + stylesheet de fuentes con `display=swap`.
- Carga del JS de cliente al final (`import '../scripts/lenis.js'`).

---

## 6. SEO (obligatorio en todo proyecto)

- Componente **`SEO.astro`** con props `title`, `description`, `image?`, `url?`,
  `type?`, `noindex?`. Genera `<title>`, meta description, canonical, robots,
  **Open Graph** y **Twitter Card**. La imagen se resuelve a URL absoluta.
- **JSON-LD** (`application/ld+json`) en el layout con el `@type` adecuado al negocio
  (`Restaurant`, `LocalBusiness`, `Organization`…) y datos reales: dirección, teléfono,
  geo, horarios, etc.
- `site` configurado en `astro.config.mjs` + integración `sitemap()`.
- `public/robots.txt` y `public/favicon/` completos.
- Definir `SITE_URL` y dejarla lista para producción.

---

## 7. Rendimiento y animación

- **Imágenes** optimizadas (formato y peso) en `public/imgs/`.
- **Vídeo con scroll-scrub:** mantener dos versiones (`*.mp4` normal y `*-scrub.mp4`),
  y en táctil simplificar la experiencia (ver `scripts/lenis.js`).
- **Lenis + GSAP:** un solo ticker (`gsap.ticker.add` → `lenis.raf`). En táctil
  desactivar `syncTouch` para no pelear con el scroll nativo ni con el scrub.
- `overflow-x: clip` en `body, html` para evitar scroll horizontal por animaciones.
- Cuidado con **race conditions** de ScrollTrigger en la primera vista: registrar
  plugins y refrescar tras carga de assets.

---

## 8. Checklist de arranque de un proyecto nuevo

- [ ] `astro.config.mjs` con `site`, `icon()`, `sitemap()` y plugin de Tailwind.
- [ ] `tsconfig.json` extendiendo `astro/tsconfigs/strict`.
- [ ] `styles/` con `global.css`, `variables.css`, `buttons.css` (y `fonts.css` si aplica).
- [ ] Tokens de color y fuentes del cliente en `variables.css`.
- [ ] `Layout.astro` con SEO, JSON-LD del negocio y slots.
- [ ] `SEO.astro` configurado.
- [ ] `public/favicon/` completo + `robots.txt`.
- [ ] Datos repetitivos en `src/data/`.
- [ ] `CLAUDE.md` propio del proyecto documentando paleta, componentes y props.
- [ ] Node ≥ 22.12 en `engines`.
```
