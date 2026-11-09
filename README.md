# ATIKO COWORK · Landing corporativa

Next.js 16 + React 19 + Tailwind 4 + GSAP (ScrollTrigger, SplitText) + Lenis. Sin base de datos.

```
npm run dev      # http://localhost:3080
npm run build && npm start
npm run fotos    # convierte fotos-origen/ a public/img/*.webp (+ versión -m para celular)
```

Primera vez: `npm install` y luego `npm run dev`. No hace falta `.env`; la única variable
(`NEXT_PUBLIC_SITIO_URL`) está explicada en `.env.example`.

## En vivo y despliegue

- **En vivo:** https://atiko-landing.vercel.app (proyecto `atiko-landing` del equipo `fisco1` en Vercel).
- **Sale con `noindex`** y `robots.txt` bloquea a los buscadores mientras no exista
  `NEXT_PUBLIC_SITIO_URL`. Cuando haya dominio: agregar esa variable en Vercel y redesplegar.
- **`git push` NO despliega**: el proyecto de Vercel no está conectado a este repositorio.
  Se publica a mano desde la carpeta: `npx vercel deploy --prod --yes --scope fisco1`.
  Por eso lo que está en `main` no es necesariamente lo que está en vivo.
- `.vercelignore` deja fuera `fotos-origen/` (24 MB) y `scripts/`; **`fuentes/` sí se sube**,
  el build la necesita.

## Cómo trabajar

1. `git pull` en `main`.
2. Rama nueva por cambio: `git checkout -b ajuste-hero`.
3. Commit, `git push -u origin ajuste-hero` y abrir un Pull Request en GitHub.
4. Se revisa, se fusiona a `main` y desde `main` se despliega.

## Dónde se cambia qué

- **Todo el texto y los datos de contacto**: `lib/contenido.ts`. No hace falta tocar componentes.
- **Fotos**: se ponen en `fotos-origen/` con el mismo nombre y se corre `npm run fotos`.
- **Marca**: paleta, tipografía y logotipos salen del *Manual de identidad v1.0* (oct 2026).
  Títulos en TeX Gyre Adventor (versión libre de ITC Avant Garde, `fuentes/`), textos en Montserrat.
  El logotipo se dibuja desde el vector oficial (`components/Marca.tsx`), nunca con una fuente.

## Secciones

Cortina de entrada → Hero (la foto aparece dentro de la «A» y se abre al bajar) → Cinta →
La marca → Espacios (galería horizontal fija) → Oficinas privadas → Lo que incluye →
**Vision Room** (escena a oscuras con linterna, cuenta 3-2-1, revelación en cinemascope,
ficha técnica como créditos y cartelera) → Membresías → Tu día en ATIKO → Invitación →
Cómo empezar → Contacto (el formulario arma el mensaje y abre WhatsApp; no guarda nada) → Pie.

Con `prefers-reduced-motion` no hay animaciones y todo queda visible.

## Trampas que ya costaron tiempo

- **Callbacks de GSAP corren en el contexto de quien los creó.** La entrada del hero se dispara
  desde un callback de la cortina, así que un selector de texto (`".hero__rotulo"`) se buscaba
  dentro de la cortina y no encontraba nada. En código que corre desde `alEstarListo()` sólo van
  elementos ya resueltos (`gsap.utils.selector(raiz.current)`).
- **ScrollTrigger dispara `onUpdate` al registrarse**, antes de que la animación empiece. Los
  contadores y la ficha técnica no escriben en el DOM hasta `onStart`, y el texto final sale de
  `data-*`, no del DOM (en desarrollo React monta dos veces y el DOM ya puede venir revuelto).
- Las clases propias van en `@layer components`: si no, le ganan a `hidden` de Tailwind 4.
- Las coordenadas calculadas con `Math.sin` se redondean: servidor y navegador no dan los mismos
  decimales y la hidratación falla.

## Pendiente de confirmar

- Que el **444 674 1298** tenga WhatsApp (todos los botones apuntan ahí).
- El **horario** (L-V 8:00-19:00, sáb 9:00-15:00) salió de la cotización de horario extendido.
- Las fotos vienen de los folletos; varias son ilustrativas. La de la Vision Room es de 1024 px:
  conviene sustituirla por una foto real en alta.
- Sin precios a propósito (cambian con cada promoción). Redes sociales sin enlazar: no hay cuentas confirmadas.
