// ============================================================
//  DATOS DEL NEGOCIO QUE USA EL BLOG
// ------------------------------------------------------------
//  ⚠️ El horario es COPIA del que enseña la home
//  (src/pages/index.astro, bloques About y Reservations). Si se
//  cambia allí, hay que cambiarlo aquí también: es lo que sale en
//  el bloque de reserva al final de cada entrada.
//
//  Las entradas que citan horas en el propio texto se encuentran
//  con:  grep -rln "20:00\|23:00\|12:00" src/content/blog
// ============================================================

export const TELEFONO = '967 37 05 82';
export const TELEFONO_TEL = '+34967370582';

export const HORARIO = [
  'Viernes · 20:00 – 23:00 h',
  'Sáb y Dom · 12:00 – 16:00 / 20:00 – 23:00 h',
];

export const DIRECCION = 'Calle Calderas, 4 · 02610 El Bonillo (Albacete)';
export const MAPS = 'https://maps.app.goo.gl/FhWj4s6dDa92pkKx5';
