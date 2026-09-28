// ============================================================
//  EL BLOG — consultas a la colección
// ------------------------------------------------------------
//  Todo en build: la web es estática, así que esto se ejecuta una
//  vez al compilar y no en cada visita.
// ============================================================
import { getCollection, type CollectionEntry } from 'astro:content';
import { minutosLectura } from './blog';

export type Post = CollectionEntry<'blog'> & { lectura: number };

/** Publicadas, de la más reciente a la más antigua. */
export async function publicados(): Promise<Post[]> {
  const todos = await getCollection('blog', ({ data }) => !data.borrador);
  return todos
    .map((p) => ({ ...p, lectura: minutosLectura(p.body) }))
    .sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());
}

/** La que encabeza el índice: la marcada, o la más reciente si no hay. */
export const destacada = (posts: Post[]) => posts.find((p) => p.data.destacado) ?? posts[0];

/**
 * Dos para "Sigue leyendo": primero las de la misma categoría, luego las
 * más recientes. Nunca la propia.
 */
export function relacionados(posts: Post[], actual: Post, n = 2): Post[] {
  const otras = posts.filter((p) => p.id !== actual.id);
  const misma = otras.filter((p) => p.data.categoria === actual.data.categoria);
  const resto = otras.filter((p) => p.data.categoria !== actual.data.categoria);
  return [...misma, ...resto].slice(0, n);
}
