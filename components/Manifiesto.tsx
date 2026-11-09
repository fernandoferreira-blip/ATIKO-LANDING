"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { MANIFIESTO } from "@/lib/contenido";
import { A_EJE } from "./Marca";

export default function Manifiesto() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        // El texto se enciende palabra por palabra al ritmo del scroll.
        const texto = new SplitText(".manifiesto__texto", { type: "words" });
        gsap.fromTo(
          texto.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ".manifiesto__texto", start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );

        gsap.from(".manifiesto__valor", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".manifiesto__valores", start: "top 88%" },
        });

        // Cifras que cuentan hacia arriba. No se escribe nada antes de onStart: ScrollTrigger dispara
        // onUpdate al registrarse y dejaría un 0 donde el servidor ya pintó la cifra.
        gsap.utils.toArray<HTMLElement>(".cifra__valor").forEach((el) => {
          const fin = Number(el.dataset.valor);
          const sufijo = el.dataset.sufijo ?? "";
          const n = { v: 0 };
          let iniciado = false;
          gsap.to(n, {
            v: fin,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
            onStart: () => {
              iniciado = true;
            },
            onUpdate: () => {
              if (iniciado) el.textContent = Math.round(n.v) + sufijo;
            },
          });
        });
        gsap.from(".cifra", {
          y: 50,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".cifras", start: "top 85%" },
        });

        // La marca de agua (triángulo de línea, hoja 16) se dibuja y sube con paralaje.
        gsap.fromTo(
          ".manifiesto .marca-agua path",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top 70%", end: "center center", scrub: true } }
        );
        gsap.to(".manifiesto .marca-agua", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: raiz.current, start: "top bottom", end: "bottom top", scrub: true },
        });

        return () => texto.revert();
      });
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} className="manifiesto seccion claro overflow-clip" aria-labelledby="manifiesto-titulo">
      <svg
        className="marca-agua right-[-18vw] top-[4%] h-[110%] w-auto md:right-[-8vw]"
        viewBox="52 138 82 92"
        aria-hidden
      >
        <path d={A_EJE} pathLength={1} stroke="rgba(0,0,0,.12)" />
      </svg>

      <div className="contenedor relative">
        <p id="manifiesto-titulo" className="rotulo con-linea mb-10 text-black/60">
          {MANIFIESTO.rotulo}
        </p>
        <p className="manifiesto__texto max-w-[1180px]">{MANIFIESTO.texto}</p>

        <ul className="manifiesto__valores mt-14 flex flex-wrap gap-x-10 gap-y-3">
          {MANIFIESTO.valores.map((v) => (
            <li key={v} className="manifiesto__valor rotulo flex items-center gap-3 text-black/70">
              <span className="viñeta !mt-0" aria-hidden />
              {v}
            </li>
          ))}
        </ul>

        <dl className="cifras mt-24 grid grid-cols-2 gap-x-6 gap-y-14 border-t border-black/12 pt-12 lg:grid-cols-4">
          {MANIFIESTO.cifras.map((c) => (
            <div key={c.texto} className="cifra">
              <dt className="sr-only">{c.texto}</dt>
              <dd>
                <span className="cifra__valor block" data-valor={c.valor} data-sufijo={c.sufijo}>
                  {c.valor}
                  {c.sufijo}
                </span>
                <span className="mt-3 block max-w-[220px] text-[15px] leading-snug text-black/60">{c.texto}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
