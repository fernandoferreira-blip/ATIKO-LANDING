"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { INVITACION } from "@/lib/contenido";
import { A_EJE, Flecha } from "./Marca";

// Pieza de impacto: el único fondo completamente naranja de la página (hoja 13).
export default function Invitacion() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".invitacion__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: raiz.current, start: "top 65%" } });
        tl.from(titulo.words, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.06 })
          .from(".invitacion__texto", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.5)
          .from(".invitacion__boton", { scale: 0.6, opacity: 0, duration: 1, ease: "expo.out" }, 0.6);

        // La A gigante se dibuja con el scroll y sube a contrapelo.
        gsap.fromTo(
          ".invitacion__a path",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top 85%", end: "bottom 60%", scrub: true } }
        );
        gsap.fromTo(
          ".invitacion__a",
          { yPercent: 12 },
          { yPercent: -12, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top bottom", end: "bottom top", scrub: true } }
        );
        return () => titulo.revert();
      });
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} className="invitacion seccion relative" aria-labelledby="invitacion-titulo">
      <svg
        className="invitacion__a marca-agua right-[-62vw] top-[-6%] h-[112%] w-auto md:right-[-6vw]"
        viewBox="52 138 82 92"
        aria-hidden
      >
        <path d={A_EJE} pathLength={1} stroke="rgba(0,0,0,.4)" style={{ strokeWidth: 1.5 }} />
      </svg>
      <div className="contenedor relative">
        <p className="rotulo mb-8 text-black/70">Para emprendedores</p>
        <h2 id="invitacion-titulo" className="invitacion__titulo titulo max-w-[1200px]">
          {INVITACION.titulo.join(" ")}
        </h2>
        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="invitacion__texto entrada max-w-[520px] text-black/80">{INVITACION.texto}</p>
          <a
            href="#contacto"
            className="invitacion__boton group relative grid h-40 w-40 shrink-0 place-items-center rounded-full bg-black text-center text-white md:h-48 md:w-48"
            data-magnetico
          >
            <span className="absolute inset-0 scale-0 rounded-full bg-white transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-100" />
            <span className="relative z-[1] flex flex-col items-center gap-2 text-[15px] font-semibold transition-colors duration-500 group-hover:text-black">
              Agenda
              <br />
              tu visita
              <Flecha className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
