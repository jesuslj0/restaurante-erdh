// ============================================================
//  COLECCIONES DE CONTENIDO
// ------------------------------------------------------------
//  El blog vive en src/content/blog/*.md: un archivo por entrada,
//  y el nombre del archivo es la URL (/blog/<nombre>). Por eso un
//  archivo publicado NO se renombra nunca: cambiarle el nombre
//  convierte en 404 la URL que Google ya tenía indexada.
//
//  Las portadas están en src/assets/blog/ y se referencian con
//  ruta relativa desde el .md (../../assets/blog/x.webp). Así
//  Astro las optimiza en el build; desde /public no podría.
// ============================================================
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIAS } from './lib/blog';

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      /** 45-60 caracteres: es lo que enseña Google antes de cortar. */
      titulo: z.string().max(90),
      /** 140-160 caracteres: la línea gris bajo el título en el buscador. */
      descripcion: z.string().max(170),
      categoria: z.enum(CATEGORIAS),
      imagen: image(),
      /** Qué se ve en la foto. Es lo que lee Google Imágenes. */
      imagen_alt: z.string().max(200),
      /** Fecha editorial (la que se enseña), no la del commit. */
      fecha: z.coerce.date(),
      actualizado: z.coerce.date().optional(),
      /** Solo una puede ir en true: la que encabeza /blog. */
      destacado: z.boolean().default(false),
      /** Para dejar una entrada escrita pero sin publicar. */
      borrador: z.boolean().default(false),
    }),
});

export const collections = { blog };
