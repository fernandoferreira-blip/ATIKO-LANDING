"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { CINTA } from "@/lib/contenido";
import { Isotipo } from "./Marca";

// Dos filas en sentidos opuestos; el scroll acelera la cinta y la inclina un poco.
// Cada fila lleva dos grupos idénticos y se desplaza -50 %: si cambias una palabra, cambia en CINTA.
function Fila({ hueca, invertida }: { hueca?: boolean; invertida?: boolean }) {
  const items = invertida ? [...CINTA].reverse() : CINTA;
  const grupo = (clave: string, oculto: boolean) => (
    <div className="cinta__grupo" key={clave} aria-hidden={oculto || undefined}>
      {items.map((t) => (
        <span key={t} className={`cinta__item ${hueca ? "cinta__item--hueco" : ""}`}>
          {t}
          <Isotipo className="cinta__tri" color={hueca ? "rgba(255,255,255,.55)" : "#FF741F"} />
        </span>
      ))}
    </div>
  );
  return (
    <div className="cinta__fila" data-dir={invertida ? 1 : -1}>
      {grupo("a", false)}
      {grupo("b", true)}
    </div>
  );
}

export default function Cinta() {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const filas = gsap.utils.toArray<HTMLElement>(".cinta__fila");
        const tweens = filas.map((f) => {
          const dir = Number(f.dataset.dir);
          return gsap.fromTo(
            f,
            { xPercent: dir === -1 ? 0 : -50 },
            { xPercent: dir === -1 ? -50 : 0, duration: 38, ease: "none", repeat: -1 }
          );
        });
        const inclinar = gsap.quickTo(filas, "skewX", { duration: 0.5, ease: "power3" });
        ScrollTrigger.create({
          trigger: raiz.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (st) => {
            const v = st.getVelocity();
            const factor = 1 + Math.min(Math.abs(v) / 400, 5);
            tweens.forEach((t) => gsap.to(t, { timeScale: factor, duration: 0.2, overwrite: true }));
            inclinar(gsap.utils.clamp(-8, 8, v / -300));
          },
          onLeave: () => tweens.forEach((t) => t.pause()),
          onEnterBack: () => tweens.forEach((t) => t.resume()),
          onLeaveBack: () => tweens.forEach((t) => t.pause()),
          onEnter: () => tweens.forEach((t) => t.resume()),
        });
        // Vuelve a la velocidad normal cuando el scroll se detiene.
        const calma = () => {
          tweens.forEach((t) => gsap.to(t, { timeScale: 1, duration: 0.8, overwrite: true }));
          inclinar(0);
        };
        ScrollTrigger.addEventListener("scrollEnd", calma);
        return () => ScrollTrigger.removeEventListener("scrollEnd", calma);
      });
    },
    { scope: raiz }
  );

  return (
    <div ref={raiz} className="cinta py-6 md:py-10" aria-label="Espacios de ATIKO">
      <Fila />
      <Fila hueca invertida />
    </div>
  );
}
