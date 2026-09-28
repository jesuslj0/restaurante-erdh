import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// En táctil (móvil/tablet) desactivamos syncTouch: dejamos el scroll nativo,
// que es más fluido y no entra en conflicto con el scrub de vídeo. En desktop
// mantenemos el scroll suave con rueda. Para revertir: syncTouch: true fijo.
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: !isTouch,
  syncTouchLerp: 0.075,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Lenis calcula hasta dónde se puede bajar vigilando el tamaño de <html>,
// pero el Layout fija html y body al 100 % de la ventana (height: 100%) y el
// contenido desborda por encima: <html> nunca cambia de tamaño y Lenis se
// queda con la altura de la carga inicial. En la carta eso bloqueaba la rueda
// al cambiar a una pestaña más larga (Bodega): el tope seguía siendo el de
// "Platos y Tapas", más o menos a la altura de las cervezas, y solo se podía
// bajar arrastrando la barra. Vigilar <main>, que sí crece con el contenido,
// hace que el tope se recalcule en cuanto cambia la página.
const main = document.querySelector('main');
if (main && 'ResizeObserver' in window) {
  new ResizeObserver(() => lenis.resize()).observe(main);
}
