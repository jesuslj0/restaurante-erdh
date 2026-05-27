Before doing anything, read CLAUDE.md and follow all instructions there.

Then read src/styles/variables.css and use those CSS custom properties for all colors, spacing, and typography — do not hardcode any design tokens.

Create the file src/pages/carta.astro for a restaurant menu page called "El Rincón de Héctor".

Tech stack:
- Astro component (.astro) with TypeScript in the frontmatter
- Tailwind CSS for layout and spacing utilities
- CSS custom properties from src/styles/variables.css for all colors and design tokens (never hardcode hex values or raw color names)
- No external UI frameworks (no React, Vue, etc.)

The page must include all these sections on a single page with tab navigation (no page reloads):
- Tapas (cold and hot, with "popular" and "new" badges)
- Pizzas (classic and special, with a chef's note about sourdough)
- Hamburguesas & bocadillos (burgers and sandwiches, separated by type)
- Menú de fin de semana (two menus: "Menú A · Temporada" and "Menú B · De la casa", each with starter + main choice, price includes bread/dessert/drink)
- Bodega (whites, reds, rosé/sparkling in a 2-column card grid with copa/botella prices, plus beers and soft drinks)

Astro frontmatter (TypeScript):
- Define typed interfaces for all data structures: Dish, WineCard, MenuOption, Section
- Define all menu content as typed const arrays in the frontmatter
- No data fetching, everything static

Tailwind usage:
- Use Tailwind utilities for layout (flex, grid, gap, padding, margin, overflow)
- Use Tailwind for responsive breakpoints (sm:, md:)
- Do NOT use Tailwind for colors — use CSS custom properties from variables.css via inline style or a <style> block

Styling:
- Google Fonts: Playfair Display (headings) + DM Sans (body), loaded in <head>
- Minimal flat aesthetic: no gradients, no shadows, 0.5px borders using var(--color-border) or equivalent from variables.css
- Smooth fade-in animation when switching tabs (CSS keyframes, opacity + translateY)
- Category labels: small uppercase, letter-spacing, gold color from variables.css
- Each dish row: name + description left, price right-aligned in accent color
- Wine cards: 2-column CSS grid with auto-fit minmax
- Weekend menu cards: surface background from variables.css, rounded corners, total price row at the bottom
- Chef's note: left border accent using accent color from variables.css

Tab navigation:
- Pure TypeScript in a <script> tag (no framework)
- Clicking a tab hides all sections and shows only the active one
- Active tab gets a distinct style using CSS class toggling

All content in Spanish, prices in euros (€).