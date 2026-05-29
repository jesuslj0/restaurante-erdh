import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// En táctil (móvil/tablet) desactivamos syncTouch: dejamos el scroll nativo,
// que es más fluido y no entra en conflicto con el scrub de vídeo. En desktop
// mantenemos el scroll suave con rueda. Para revertir: syncTouch: true fijo.
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const lenis = new Lenis({
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