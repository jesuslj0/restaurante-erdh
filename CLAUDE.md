# El Rincón de Héctor — contexto del proyecto

## Stack

- **Astro 6** con TypeScript
- **Tailwind CSS v4** via `@tailwindcss/vite` (sin `tailwind.config.js` — la config va en CSS)
- **astro-icon** para iconos (`lucide:*` y `simple-icons:*`)
- Node ≥ 22.12

Arrancar en local: `npm run dev` (puerto 4321)

---

## Estructura de archivos relevantes

```
src/
  components/      # Componentes Astro reutilizables
  layouts/
    Layout.astro   # Layout base con slots: header, hero (dentro de <main>), footer
  pages/
    index.astro    # Única página actual; aquí se montan los componentes y se pasan props
  styles/
    global.css     # Punto de entrada de CSS (@import tailwindcss + variables + buttons)
    variables.css  # Tokens de color (@theme de Tailwind v4)
    buttons.css    # Clases de componente: .btn-primary y .btn-secondary
    fonts.css      # Fuentes (vacío por ahora)
```

---

## Sistema de colores

Definido en `src/styles/variables.css` con `@theme` (Tailwind v4):

| Token Tailwind   | Variable CSS          | Valor     | Uso principal                     |
|------------------|-----------------------|-----------|-----------------------------------|
| `text-primary`   | `--color-primary`     | `#ffffff` | Texto principal, títulos          |
| `text-secondary` | `--color-secondary`   | `#d4d4d4` | Texto secundario, links nav       |
| `bg-bg`          | `--color-bg`          | `#171717` | Fondos: footer, nav panel, botones|
| `text-accent`    | `--color-accent`      | `#6ee7b7` | Acento: subtítulos, botones       |

Variantes de opacidad disponibles: `text-secondary/60`, `bg-accent/50`, `bg-primary/30`, etc.

**Regla:** usar siempre estos tokens en lugar de clases `neutral-*` o `emerald-*` hard-coded.

---

## Botones

Clases en `src/styles/buttons.css` (usar en cualquier `<a>` o `<button>`):

```html
<a href="..." class="btn-primary">Reservar mesa</a>
<a href="..." class="btn-secondary">Ver la carta</a>
```

- `btn-primary`: fondo `accent/50`, texto `primary`, hover relleno `accent`
- `btn-secondary`: fondo `primary/30`, texto `primary`, hover fondo `primary` + texto `bg`

No crear estilos de botón inline; extender en `buttons.css` si se necesita una variante nueva.

---

## Componentes existentes

### `Layout.astro`
Props: `restaurantName: string`
Slots: `header`, `hero` (dentro de `<main>`), `about` (dentro de `<main>`), `footer`

```astro
<Layout restaurantName="El Rincón de Héctor">
  <Header slot="header" ... />
  <Hero slot="hero" ... />
  <About slot="about" ... />
  <Footer slot="footer" ... />
</Layout>
```

---

### `Header.astro`
Props:
```ts
elements: Array<{ link: string; name: string; icon: string }>
```
- En desktop: links en barra fija translúcida (`bg-bg/30 backdrop-blur-sm`)
- En móvil: botón hamburguesa (`lucide:menu`) → panel fullscreen negro con animación slide desde la derecha (`translate-x-full → translate-x-0`)
- El `<nav>` del panel móvil va **fuera** del `<header>` para evitar que `backdrop-filter` rompa `position: fixed`
- Cierre: icono `lucide:x`, tecla Escape, o clic fuera (overlay)

---

### `Hero.astro`
Props:
```ts
title: string
subtitle?: string
cta?: { label: string; link: string; icon: string }
secondaryCta?: { label: string; link: string; icon: string }
```
- Fondo: imagen local con overlay negro 50% (via `<style>` scoped)
- Título: `text-primary`, subtítulo: `text-accent`
- Botones: `btn-primary` / `btn-secondary`

---

### `About.astro`
Props:
```ts
eyebrow?: string
title: string
description: string
kpis?: Array<{ icon: string; label: string; value: string }>
```
- Sección oscura (`bg-bg`) con eyebrow en `text-accent`, título `text-primary`, descripción `text-secondary`
- KPIs: cards con icono lucide en `bg-accent/15`, etiqueta en `text-secondary/60`, valor en `text-primary`

---

### `Footer.astro`
Props:
```ts
elements: Array<{ link: string; name: string }>
socialElements: Array<{ link: string; name: string; icon: string; username: string }>
restaurantName: string
year?: number   // por defecto: año actual
```
- Fondo `bg-bg`, texto `text-secondary`
- Iconos de redes con `simple-icons:*`

---

## Iconos

Se usa `astro-icon`. Importar y usar así:
```astro
import { Icon } from 'astro-icon/components'
<Icon name="lucide:calendar" class="size-4" />
```

Colecciones disponibles: `lucide` y `simple-icons` (ver `package.json`).

---

## Reglas para nuevos componentes

1. **Solo Tailwind** para estilos. No usar `style=""` inline ni clases CSS propias salvo casos imposibles con utilidades (como `background-image` con URL local — ver Hero).
2. **Tokens de color** (`text-primary`, `text-secondary`, `bg-bg`, `text-accent`). Nunca colores de la paleta Tailwind directamente (`neutral-*`, `emerald-*`, etc.).
3. **Tipado explícito** de props con `interface` o `type` en el frontmatter.
4. **Props opcionales** con `?` y valores por defecto en la desestructuración.
5. **Iconos** solo de las colecciones ya instaladas (`lucide` o `simple-icons`).
6. **`@apply`** en `buttons.css` solo puede usar utilidades de Tailwind, no clases CSS propias.
7. Los componentes se **montan en `pages/index.astro`** pasando los datos como props.
