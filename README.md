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
- **Lo que entra a `main` se publica solo**: Vercel está conectado a este repositorio.
  Cualquier otra rama genera una **liga de vista previa** (aparece en el Pull Request) sin
  tocar el sitio en vivo. No hace falta desplegar a mano.
- `.vercelignore` deja fuera `fotos-origen/` (24 MB) y `scripts/`; **`fuentes/` sí se sube**,
  el build la necesita.

## Cómo trabajar

1. `git pull` en `main`.
2. Rama nueva por cambio: `git checkout -b ajuste-hero`.
3. Commit, `git push -u origin ajuste-hero` y abrir un Pull Request en GitHub.
4. Se revisa en la liga de vista previa; al fusionarlo a `main` sale en vivo.

## Publicar en el dominio de ATIKO

**Imprescindible, se haga como se haga:** definir la variable `NEXT_PUBLIC_SITIO_URL` con el
dominio final (ej. `https://atikocowork.com`, sin diagonal al final) **y volver a compilar**.
Sin ella el sitio sale con `noindex` y `robots.txt` bloquea a Google: funciona, pero no aparece
en buscadores. También fija la dirección de las vistas previas al compartir en WhatsApp y redes.

Dos caminos:

- **A. Dominio en el proyecto de Vercel que ya existe (lo más simple).** En Vercel, proyecto
  `atiko-landing` → *Settings → Domains* → agregar el dominio; Vercel muestra los registros
  DNS (`A` para el dominio raíz, `CNAME` para `www`) que se dan de alta donde esté registrado
  el dominio. Luego *Settings → Environment Variables* → `NEXT_PUBLIC_SITIO_URL` en Production
  y redesplegar. Si el DNS tiene un "URL Redirect" o "Parking" previo, hay que quitarlo.
- **B. Otro hosting.** Necesita Node 20.9 o mayor (es Next.js con servidor, no HTML suelto):
  `npm ci`, `NEXT_PUBLIC_SITIO_URL=https://… npm run build`, `npm start` (escucha en el 3080;
  en otro puerto: `npx next start -p <puerto>`). En Netlify o similares, importar el repo y
  poner la variable antes del primer build. La carpeta `fuentes/` tiene que viajar: el build
  la usa.

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
