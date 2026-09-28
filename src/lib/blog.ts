// ============================================================
//  EL BLOG — piezas puras (sin consultas)
// ------------------------------------------------------------
//  Lo importan a la vez src/content.config.ts (las categorías del
//  schema) y las páginas. Por eso aquí NO se importa astro:content:
//  el config no puede depender de la colección que él mismo define.
//  Las consultas viven en blog-posts.ts.
// ============================================================

/** Las cuatro categorías, en el orden en que se enseñan. */
export const CATEGORIAS = ['Pizzas y burgers', 'Para llevar', 'Cenas y tapeo', 'Fin de semana'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

// ------------------------------------------------------------
//  Paginación del índice
// ------------------------------------------------------------

/**
 * Tarjetas por página en /blog, sin contar la destacada. Seis, múltiplo de
 * las tres columnas y de las dos: la última fila siempre sale completa.
 */
export const POR_PAGINA = 6;

export interface Pagina<T> {
  items: T[];
  actual: number;
  total: number;
}

/** Corta una lista ya ordenada. `null` si la página no existe (es un 404). */
export function paginar<T>(todos: T[], actual: number, porPagina = POR_PAGINA): Pagina<T> | null {
  const total = Math.max(1, Math.ceil(todos.length / porPagina));
  if (!Number.isInteger(actual) || actual < 1 || actual > total) return null;
  const desde = (actual - 1) * porPagina;
  return { items: todos.slice(desde, desde + porPagina), actual, total };
}

/** La primera página es /blog y no /blog/pagina/1: una sola URL por listado. */
export const urlPagina = (n: number) => (n <= 1 ? '/blog' : `/blog/pagina/${n}`);

// ------------------------------------------------------------
//  Formato
// ------------------------------------------------------------

/** Minutos de lectura a 200 palabras por minuto, mínimo uno. */
export function minutosLectura(markdown = ''): number {
  const palabras = markdown.replace(/[#*_>\-|`[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

export const fechaCorta = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const fechaLarga = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** 'YYYY-MM-DD' para el atributo datetime y el JSON-LD. */
export const fechaISO = (d: Date) => d.toISOString().slice(0, 10);

const MARCA = 'El Rincón de Héctor';

/**
 * El <title> de una entrada. La marca solo se añade si el conjunto cabe en
 * los ~60 caracteres que enseña Google; si no, se cortaría justo la parte que
 * dice de qué va el artículo.
 */
export const tituloSEO = (titulo: string) =>
  titulo.length + MARCA.length + 3 <= 62 ? `${titulo} | ${MARCA}` : titulo;
