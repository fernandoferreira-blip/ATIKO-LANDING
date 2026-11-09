"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { HERO } from "@/lib/contenido";
import { alEstarListo } from "@/lib/escena";
import { Flecha } from "./Marca";

// Geometría del triángulo-ventana: proporción del isotipo (ancho = 0.87 × alto).
function triangulo() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const escritorio = w >= 900;
  const alto = escritorio ? h * 0.74 : Math.min(h * 0.38, (w * 0.8) / 0.87);
  const ancho = alto * 0.87;
  const top = escritorio ? h * 0.12 : h * 0.1;
  const margen = Math.max(16, w * 0.042);
  let cx = escritorio ? w * 0.72 : w / 2;
  if (cx + ancho / 2 > w - margen) cx = w - margen - ancho / 2;
  return { w, h, ax: cx, ay: top, bx1: cx - ancho / 2, bx2: cx + ancho / 2, by: top + alto };
}

const desfaseFoto = () => {
  const t = triangulo();
  return t.w >= 900 ? t.ax - t.w / 2 : 0;
};

const poligonoTriangulo = () => {
  const t = triangulo();
  return `polygon(${t.ax}px ${t.ay}px, ${t.ax}px ${t.ay}px, ${t.bx2}px ${t.by}px, ${t.bx1}px ${t.by}px)`;
};
const poligonoCompleto = () => {
  const { w, h } = triangulo();
  return `polygon(0px 0px, ${w}px 0px, ${w}px ${h}px, 0px ${h}px)`;
};

export default function Hero() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const ventana = raiz.current!.querySelector<HTMLElement>(".hero__ventana")!;
        const svg = raiz.current!.querySelector<SVGSVGElement>(".hero__trazo")!;
        const linea = svg.querySelector("polyline")!;

        // El trazo naranja sigue exactamente al triángulo: la A abierta en la base.
        const dibujarTrazo = () => {
          const t = triangulo();
          svg.setAttribute("viewBox", `0 0 ${t.w} ${t.h}`);
          linea.setAttribute("points", `${t.bx1},${t.by} ${t.ax},${t.ay} ${t.bx2},${t.by} ${t.ax},${t.by}`);
        };
        dibujarTrazo();
        window.addEventListener("resize", dibujarTrazo);

        const titulo = new SplitText(".hero__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        const bienvenida = new SplitText(".hero__bienvenida h2", { type: "words", mask: "words" });

        // Estado inicial, oculto bajo la cortina.
        gsap.set(ventana, { clipPath: poligonoTriangulo(), opacity: 0 });
        gsap.set(".hero__zoom", { scale: 1.35 });
        gsap.set(linea, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(titulo.words, { yPercent: 115 });
        gsap.set([".hero__rotulo", ".hero__texto", ".hero__acciones", ".hero__bajar"], { opacity: 0, y: 24 });

        // La entrada se dispara desde un callback de la cortina, que corre en el contexto (y el scope) de la
        // cortina: aquí sólo van elementos ya resueltos, nunca selectores de texto.
        const q = gsap.utils.selector(raiz.current);
        const quitar = alEstarListo(() => {
          const tl = gsap.timeline({ delay: 0.35 });
          tl.to(linea, { strokeDashoffset: 0, duration: 1.4, ease: "power3.inOut" }, 0)
            .to(ventana, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0.35)
            .to(q(".hero__zoom"), { scale: 1, duration: 2.2, ease: "expo.out" }, 0.35)
            .to(q(".hero__rotulo"), { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.2)
            .to(titulo.words, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.06 }, 0.3)
            .to(q(".hero__texto, .hero__acciones, .hero__bajar"), { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12 }, 0.85);
        });

        // Al bajar, el triángulo se abre hasta llenar la pantalla: entras al ático.
        const scroll = gsap.timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: "+=140%",
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
            onRefresh: dibujarTrazo,
          },
        });
        scroll
          .to(svg, { opacity: 0, duration: 0.14, ease: "none" }, 0)
          .to(".hero__copia", { y: -90, opacity: 0, duration: 0.3, ease: "power1.in" }, 0)
          .to(".hero__bajar-envoltura", { opacity: 0, duration: 0.1 }, 0)
          .fromTo(ventana, { clipPath: poligonoTriangulo }, { clipPath: poligonoCompleto, duration: 0.56, ease: "power2.inOut" }, 0.04)
          .fromTo(".hero__foto", { scale: 1.25 }, { scale: 1, duration: 0.8, ease: "none" }, 0)
          // En escritorio la foto arranca corrida para que el centro (las lámparas) caiga dentro del triángulo.
          .fromTo(".hero__foto", { x: desfaseFoto }, { x: 0, duration: 0.46, ease: "power2.inOut" }, 0.04)
          .to(".hero__velo", { opacity: 1, duration: 0.25, ease: "none" }, 0.38)
          .to(".hero__bienvenida", { opacity: 1, duration: 0.01 }, 0.56)
          .from(bienvenida.words, { yPercent: 110, duration: 0.24, ease: "power3.out", stagger: 0.035 }, 0.56)
          .to({}, { duration: 0.14 });

        // Paralaje suave con el mouse.
        const px = gsap.quickTo(".hero__paralaje", "x", { duration: 1.2, ease: "power3" });
        const py = gsap.quickTo(".hero__paralaje", "y", { duration: 1.2, ease: "power3" });
        const mover = (e: PointerEvent) => {
          px((e.clientX / window.innerWidth - 0.5) * -26);
          py((e.clientY / window.innerHeight - 0.5) * -18);
        };
        raiz.current!.addEventListener("pointermove", mover);

        return () => {
          quitar();
          window.removeEventListener("resize", dibujarTrazo);
          raiz.current?.removeEventListener("pointermove", mover);
          titulo.revert();
          bienvenida.revert();
        };
      });
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} id="inicio" className="hero" aria-label="Inicio">
      <div className="hero__ventana">
        <div className="hero__paralaje absolute inset-0">
          <div className="hero__zoom absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero__foto"
              src="/img/cowork.webp"
              srcSet="/img/cowork-m.webp 1000w, /img/cowork.webp 2048w"
              sizes="100vw"
              alt="Área cowork de ATIKO con escritorios de madera, jardineras y lámparas de neón ondulado"
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="hero__velo" />
      </div>

      <svg className="hero__trazo" preserveAspectRatio="none" aria-hidden>
        <polyline pathLength={1} />
      </svg>

      <div className="hero__copia">
        <p className="hero__rotulo rotulo mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-white/70">
          <span>{HERO.rotulo}</span>
          <span className="inline-block h-px w-6 bg-naranja" aria-hidden />
          <span className="text-white">{HERO.ciudad}</span>
        </p>
        <h1 className="hero__titulo titulo">
          Un lugar para <span className="acento">crecer</span>, crear y conectar.
        </h1>
        <p className="hero__texto entrada mt-6 max-w-[520px] text-white/72 max-sm:hidden [@media(max-height:700px)]:hidden">{HERO.texto}</p>
        <div className="hero__acciones mt-8 flex flex-wrap gap-3">
          <a href="#contacto" className="btn btn--naranja" data-magnetico>
            Agenda tu visita <Flecha className="flecha" />
          </a>
          <a href="#espacios" className="btn btn--linea max-sm:hidden">
            Conoce los espacios
          </a>
        </div>
      </div>

      <div className="hero__bajar-envoltura">
        <div className="hero__bajar rotulo">
          <span>Desliza para entrar</span>
          <span className="linea" aria-hidden />
        </div>
      </div>

      <div className="hero__bienvenida" aria-hidden>
        <h2 className="titulo titulo-xl">{HERO.bienvenida}</h2>
      </div>
    </section>
  );
}
