"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { INCLUYE } from "@/lib/contenido";
import { Isotipo } from "./Marca";

// Íconos de línea, del mismo grueso que el trazo del isotipo.
function Icono({ id }: { id: string }) {
  const comun = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "internet":
      return (
        <svg viewBox="0 0 48 48" className="bento__icono ondas" aria-hidden>
          <path d="M8 19a23 23 0 0 1 32 0" />
          <path d="M13.5 25a15 15 0 0 1 21 0" />
          <path d="M19 31a7 7 0 0 1 10 0" />
          <circle cx="24" cy="37" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "cafe":
      return (
        <svg viewBox="0 0 48 48" className="bento__icono" aria-hidden>
          <g className="vapor">
            <path d="M18 8c-2 2 2 4 0 6" {...comun} />
            <path d="M24 6c-2 2 2 4 0 6" {...comun} />
            <path d="M30 8c-2 2 2 4 0 6" {...comun} />
          </g>
          <path d="M10 20h26v10a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10V20Z" {...comun} />
          <path d="M36 23h2a5 5 0 0 1 0 10h-3" {...comun} />
        </svg>
      );
    case "recepcion":
      return (
        <svg viewBox="0 0 48 48" className="bento__icono" aria-hidden {...comun}>
          <path d="M10 34a14 14 0 0 1 28 0" />
          <path d="M6 34h36M24 20v-4M20 16h8" />
          <path d="M24 26v-2" className="pulso" />
        </svg>
      );
    case "juntas":
      return (
        <svg viewBox="0 0 48 48" className="bento__icono" aria-hidden {...comun}>
          <rect x="12" y="6" width="24" height="14" rx="1" />
          <path d="M8 30h32M14 30v10M34 30v10" />
          <circle cx="12" cy="25" r="2" />
          <circle cx="24" cy="25" r="2" />
          <circle cx="36" cy="25" r="2" />
        </svg>
      );
    case "confort":
      return (
        <svg viewBox="0 0 48 48" className="bento__icono" aria-hidden {...comun}>
          <path d="M10 22v-5a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v5" />
          <path d="M6 26a4 4 0 0 1 8 0v4h20v-4a4 4 0 0 1 8 0v10H6V26Z" />
          <path d="M10 36v4M38 36v4" />
        </svg>
      );
    case "eventos":
      return (
        <svg viewBox="0 0 48 48" className="bento__icono" aria-hidden {...comun}>
          <path d="M24 6 8 40h32L24 6Z" opacity=".35" />
          <circle cx="16" cy="30" r="3" />
          <circle cx="24" cy="26" r="3" />
          <circle cx="32" cy="30" r="3" />
          <path d="M11 40a5 5 0 0 1 10 0M19 36a5 5 0 0 1 10 0M27 40a5 5 0 0 1 10 0" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="bento__icono" aria-hidden {...comun}>
          <rect x="5" y="12" width="38" height="24" rx="3" />
          <path d="M5 19h38M11 30h8" />
          <path d="M33 27l3-6 3 6h-6Z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export default function Incluye() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".incluye__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        gsap.from(titulo.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".incluye__titulo", start: "top 85%" },
        });
        gsap.from(".bento__tarjeta", {
          y: 70,
          opacity: 0,
          scale: 0.97,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".bento", start: "top 80%" },
        });
        gsap.from(".incluye__extra", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.05,
          scrollTrigger: { trigger: ".incluye__extras", start: "top 92%" },
        });
        // Al salir, la sala se queda a oscuras: viene la Vision Room.
        gsap.to(".apagon", {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: raiz.current, start: "bottom 95%", end: "bottom 25%", scrub: true },
        });
        return () => titulo.revert();
      });
    },
    { scope: raiz }
  );

  // Luz que sigue al puntero dentro de cada tarjeta.
  const alMover = (e: React.PointerEvent<HTMLElement>) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>(".bento__tarjeta");
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--x", `${e.clientX - r.left}px`);
    t.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={raiz} className="incluye seccion relative bg-[#0e0e0e]" aria-labelledby="incluye-titulo">
      <div className="contenedor relative z-[1]">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="rotulo con-linea mb-6 text-white/60">{INCLUYE.rotulo}</p>
            <h2 id="incluye-titulo" className="incluye__titulo titulo titulo-l">
              <span className="acento">{INCLUYE.titulo[0]}</span> {INCLUYE.titulo[1]} {INCLUYE.titulo[2]}
            </h2>
          </div>
          <p className="entrada max-w-[440px] text-white/60 md:justify-self-end">
            Un solo pago al mes cubre lo que en otro lado son cinco recibos y diez pendientes.
          </p>
        </div>

        <div className="bento" onPointerMove={alMover}>
          {INCLUYE.tarjetas.map((t) => (
            <article key={t.id} className={`bento__tarjeta b-${t.id}`}>
              <Icono id={t.id} />
              <div>
                <h3 className={`titulo ${t.id === "internet" ? "text-[36px] md:text-[52px]" : "text-[26px] md:text-[30px]"}`}>{t.titulo}</h3>
                <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-white/60">{t.texto}</p>
              </div>
              {t.id === "rewards" && (
                <div className="absolute -right-8 -top-8 hidden h-36 w-56 rounded-xl sm:block border border-white/10 bg-gradient-to-br from-[#202020] to-black p-4 opacity-80" aria-hidden>
                  <Isotipo className="h-6 w-6" />
                  <span className="rotulo absolute bottom-4 left-4 text-[9px] text-white/60">Membership card</span>
                </div>
              )}
            </article>
          ))}
        </div>

        <ul className="incluye__extras mt-10 flex flex-wrap gap-2">
          <li className="rotulo mr-3 self-center text-white/50">Y también</li>
          {INCLUYE.extras.map((x) => (
            <li key={x} className="incluye__extra etiqueta">
              {x}
            </li>
          ))}
        </ul>
      </div>
      <div className="apagon pointer-events-none absolute inset-0 z-[2] bg-black opacity-0" aria-hidden />
    </section>
  );
}
