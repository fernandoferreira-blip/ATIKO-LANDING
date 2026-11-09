"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { EMPEZAR } from "@/lib/contenido";

export default function Empezar() {
  const raiz = useRef<HTMLElement>(null);
  const [tipo, setTipo] = useState<"fisica" | "moral">("fisica");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".empezar__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        gsap.from(titulo.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".empezar__titulo", start: "top 85%" },
        });
        gsap.from(".paso", {
          y: 70,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".pasos", start: "top 82%" },
        });
        gsap.fromTo(
          ".pasos__linea",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".pasos", start: "top 75%", end: "bottom 60%", scrub: true } }
        );
        return () => titulo.revert();
      });
    },
    { scope: raiz }
  );

  // Al cambiar de pestaña, la lista entra escalonada.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".requisito", { y: 14, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.04 });
    },
    { scope: raiz, dependencies: [tipo] }
  );

  const lista = EMPEZAR.requisitos[tipo];

  return (
    <section ref={raiz} className="seccion claro" aria-labelledby="empezar-titulo">
      <div className="contenedor">
        <p className="rotulo con-linea mb-6 text-black/60">{EMPEZAR.rotulo}</p>
        <h2 id="empezar-titulo" className="empezar__titulo titulo titulo-l mb-16 md:mb-24">
          {EMPEZAR.titulo[0]} <span className="acento">{EMPEZAR.titulo[1]}</span>
        </h2>

        <div className="pasos relative grid gap-12 md:grid-cols-3 md:gap-8">
          <span className="pasos__linea absolute left-0 right-0 top-0 hidden h-px origin-left bg-black/20 md:block" aria-hidden />
          {EMPEZAR.pasos.map((p, i) => (
            <div key={p.titulo} className="paso md:pt-10">
              <span className="paso__numero block">0{i + 1}</span>
              <h3 className="titulo mt-6 text-[28px] md:text-[34px]">{p.titulo}</h3>
              <p className="mt-3 max-w-[340px] text-[16px] leading-relaxed text-black/65">{p.texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid gap-10 rounded-md bg-white p-7 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:p-12">
          <div>
            <h3 className="titulo titulo-m">Requisitos de inscripción</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-black/60">
              Tenlos a la mano para tu visita y firmamos el mismo día.
            </p>
            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Tipo de persona">
              {(["fisica", "moral"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tipo === t}
                  aria-controls="lista-requisitos"
                  className="pestaña"
                  onClick={() => setTipo(t)}
                >
                  Persona {t === "fisica" ? "física" : "moral"}
                </button>
              ))}
            </div>
          </div>
          <ul id="lista-requisitos" role="tabpanel" className="grid content-start gap-x-10 gap-y-4 sm:grid-cols-2">
            {lista.map((r) => (
              <li key={`${tipo}-${r}`} className="requisito flex gap-3 text-[16px] leading-snug text-black/80">
                <span className="viñeta" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
