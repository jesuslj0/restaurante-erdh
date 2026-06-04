# Prompt ejemplo — Vídeo burguer scrub (Veo 3.1)

Prompt **validado** para generar el vídeo de la burguer apilándose que usamos en la
sección "Burguer del Verano" (componente `BurgerScroll.astro`). Este es el prompt que
dio un resultado bueno **a la primera**, evitando los problemas típicos (pan de arriba
que sale volando, rebotes raros, corte seco al final).

> Objetivo: no gastar créditos generando 8 vídeos para sacar 1 decente. Partir de este
> prompt y ajustar solo lo mínimo.

---

## Cómo se usa (modo first frame → last frame)

1. Se generan/aportan **dos imágenes**: 
   - **Start frame**: ingredientes flotando en "exploded view".
   - **End frame**: burguer montada y compacta (estado final EXACTO).
2. Se usa la función **first frame + last frame** de Veo 3.1, con el prompt de abajo.
3. Claves que evitan los fallos conocidos:
   - El pan de arriba baja **la misma distancia** que el resto (sin lift extra).
   - **Sin rebote**: deceleración suave a cero en cada aterrizaje.
   - El movimiento **converge exactamente al end frame** y **se queda quieto 1s** →
     evita el corte/salto brusco al final.
   - Cámara totalmente fija y fondo `#171717` constante → imprescindible para que el
     scroll-scrub de la web no "salte".

---

## Prompt (copiar/pegar verbatim)

```
Smooth cinematic food assembly video.
Start frame: burger ingredients floating in exploded view.
End frame: fully assembled compact burger — this is the EXACT final state 
the video must reach completely.

CRITICAL: every single ingredient must fully complete its descent 
and make full contact with the layer below it before the video ends.
No ingredient stays floating. No ingredient stops mid-air.
The bottom beef patty must touch the orange sauce and bottom bun.
Every layer must physically touch the layer below and above it.
The final frame must be identical to the provided end frame image,
all layers compressed together into one single solid burger structure.

Motion: each ingredient falls straight down with natural gravity,
slow and controlled, no bouncing, no overshooting.
The bottom layers land first, upper layers follow sequentially.
Every piece decelerates smoothly and locks into position.

TOP BUN: descends the same distance as all other ingredients,
no extra lift, no extra separation, same controlled short drop.

STEAM: single extremely thin barely visible wisp only,
no thick clouds, no heavy smoke, almost invisible.

As layers compress on landing:
- sauces spread very slightly outward, no splashing
- mozzarella oozes minimally between patties
- everything stays clean and premium

Camera: completely locked, zero movement, zero zoom, zero pan.
Background: solid flat #171717 throughout, no flicker, no change.
Speed: slow deliberate assembly over 4-5 seconds.
Easing: smooth deceleration to zero on each landing, zero bounce.

ENDING: all ingredients fully stacked and touching,
burger identical to end frame reference image,
holds perfectly still for 1 full second.
No cut, no jump, no fade, continuous fluid motion throughout.

Style: luxury food commercial, Michelin-star, photorealistic.
```

---

## Cómo adaptarlo a otra burguer

- Cambiar **solo las imágenes** start/end (con los ingredientes ya con su display
  correcto). El prompt describe la **física del montaje**, no los ingredientes, así que
  normalmente **no hay que tocar el texto**.
- Si la burguer no lleva "beef patty" en la base, ajustar esa única línea
  (`The bottom beef patty must touch...`) al ingrediente real de la base.
- Mantener fondo `#171717` y aspecto vertical 9:16 para que encaje en la web.

---

## Post-proceso obligatorio: re-encode a scrub (all-keyframe)

El vídeo que sale de Veo **no sirve tal cual** para el scroll-scrub: solo trae 1
keyframe al inicio y el seek va a tirones. Hay que re-encodearlo a **GOP=1 (todos los
frames keyframe)**, formato H.264 720×1280 24fps, igual que el resto:

```bash
ffmpeg -y -i ENTRADA.mp4 \
  -an \
  -vf "scale=720:1280:flags=lanczos,fps=24" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -preset slow -crf 18 -movflags +faststart \
  SALIDA-scrub.mp4
```

Verificar que **no quedan frames no-keyframe** (debe imprimir `0`):

```bash
ffprobe -v error -select_streams v:0 -show_entries frame=key_frame -of csv=p=0 SALIDA-scrub.mp4 | grep -c '^0$'
```

Luego dejar el `*-scrub.mp4` en `public/videos/` y apuntar `videoSrc` en
`src/components/BurgerScroll.astro`.
```
