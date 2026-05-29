 Veo el problema exacto. Hay una race condition en applySeek: cuando el usuario entra en la sección por primera vez, el
  vídeo todavía no tiene duration disponible (está cargando), así que la condición isFinite(video.duration) &&
  video.duration > 0 falla silenciosamente y el currentTime nunca se actualiza. La cadena de callbacks sigue corriendo,
  pero si el usuario deja de hacer scroll antes de que cargue la metadata, la cadena se detiene con seeking = false y el
  fotograma queda congelado.

  En recargas funciona porque el vídeo está cacheado y la metadata está disponible al instante.

  El fix: cuando la metadata cargue tarde, hacer un seek inmediato a state.progress actual. También hay que limpiar el
  prepareVideo que puede mover el currentTime sin reposicionarlo.

  Read 1 file (ctrl+o to expand)

● Aquí está el <script> corregido para reemplazar el tuyo:

  <script>
      import { gsap } from "gsap";
      import { ScrollTrigger } from "gsap/ScrollTrigger";

      gsap.registerPlugin(ScrollTrigger);

      const section = document.getElementById("burger-del-mes");
      const video = document.getElementById("burger-video") as HTMLVideoElement | null;

      if (section && video) {
          const state = { progress: 0 };
          let queuedProgress: number | null = null;
          let seeking = false;

          const applySeek = () => {
              if (queuedProgress === null) { seeking = false; return; }
              const p = queuedProgress;
              queuedProgress = null;
              if (isFinite(video.duration) && video.duration > 0) {
                  video.currentTime = p * video.duration;
              }
              if ("requestVideoFrameCallback" in video) {
                  (video as any).requestVideoFrameCallback(applySeek);
              } else {
                  requestAnimationFrame(applySeek);
              }
          };

          gsap.to(state, {
              progress: 1,
              ease: "none",
              scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                  invalidateOnRefresh: true,
              },
              onUpdate: () => {
                  queuedProgress = state.progress;
                  if (!seeking) {
                      seeking = true;
                      applySeek();
                  }
              },
          });

          // FIX PRINCIPAL: cuando la metadata llega tarde (primera visita sin caché),
          // hacemos seek inmediato a donde esté el usuario en ese momento.
          const initVideo = () => {
              // 1. Seek al progreso actual del scroll
              if (isFinite(video.duration) && video.duration > 0) {
                  video.currentTime = state.progress * video.duration;
              }
              // 2. Despierta el decoder y reposiciona tras el play/pause
              video.play().then(() => {
                  video.pause();
                  if (isFinite(video.duration) && video.duration > 0) {
                      video.currentTime = state.progress * video.duration;
                  }
              }).catch(() => {});
          };

          if (video.readyState >= 1) {
              initVideo();
          } else {
              video.addEventListener("loadedmetadata", initVideo, { once: true });
          }

          // Refresh en window.load (más seguro que rAF solo)
          window.addEventListener("load", () => {
              ScrollTrigger.refresh();
          });
      }
  </script>

  ---
  Qué cambió y por qué:

  ┌───────────────────────────────┬──────────────────────────────────┬──────────────────────────────────────────────┐
  │           Problema            │              Causa               │                     Fix                      │
  ├───────────────────────────────┼──────────────────────────────────┼──────────────────────────────────────────────┤
  │                               │ loadedmetadata llega después de  │ initVideo() en el evento loadedmetadata hace │
  │ Burger congelada en frame 0   │ que el usuario ya pasó por la    │  seek a state.progress actual                │
  │                               │ sección                          │                                              │
  ├───────────────────────────────┼──────────────────────────────────┼──────────────────────────────────────────────┤
  │ prepareVideo podía mover      │ play().then() avanzaba el vídeo  │ Añadido seek dentro del .then()              │
  │ currentTime                   │ y no se reposicionaba            │                                              │
  ├───────────────────────────────┼──────────────────────────────────┼──────────────────────────────────────────────┤
  │ ScrollTrigger.refresh()       │ Un solo rAF no garantiza que el  │ Movido a window.addEventListener("load")     │
  │ demasiado temprano            │ DOM y Lenis estén listos         │                                              │
  └───────────────────────────────┴──────────────────────────────────┴──────────────────────────────────────────────┘

  La clave es que ahora, aunque la metadata tarde 3 segundos en cargar, en el momento que llegue se hace seek al frame
  exacto donde está el scroll del usuario en ese instante.