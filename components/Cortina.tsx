"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { marcarListo, obtenerLenis } from "@/lib/escena";
import { A_EJE, A_RELLENO } from "./Marca";

// Entrada: la A se dibuja, cuenta de 0 a 100 y la cortina sube para dejar ver el hero.
export default function Cortina() {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = raiz.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.display = "none";
        marcarListo();
        return;
      }
      el.style.animation = "none";
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      document.documentElement.style.overflow = "hidden";
      // Lenis se crea en el efecto del hermano; se detiene en cuanto exista.
      const detener = requestAnimationFrame(() => obtenerLenis()?.stop());

      const trazo = el.querySelector<SVGPathElement>(".cortina__trazo")!;
      const relleno = el.querySelector(".cortina__relleno");
      const cuenta = el.querySelector(".cortina__cuenta")!;
      const n = { v: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          el.style.display = "none";
          document.documentElement.style.overflow = "";
          obtenerLenis()?.start();
          ScrollTrigger.refresh();
        },
      });
      tl.set(trazo, { strokeDasharray: 1, strokeDashoffset: 1 })
        .to(trazo, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.15)
        .to(
          n,
          {
            v: 100,
            duration: 1.35,
            ease: "power2.inOut",
            onUpdate: () => {
              cuenta.textContent = String(Math.round(n.v)).padStart(3, "0");
            },
          },
          0
        )
        .fromTo(".cortina__frase", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.35)
        .to(relleno, { opacity: 1, duration: 0.3 }, 1.15)
        .to(trazo, { opacity: 0, duration: 0.3 }, 1.15)
        .to(".cortina__marca", { scale: 0.9, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.55)
        .to([".cortina__frase", cuenta], { opacity: 0, duration: 0.3 }, 1.55)
        .add(() => marcarListo(), 1.75)
        .to(el, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, 1.75);

      return () => cancelAnimationFrame(detener);
    },
    { scope: raiz }
  );

  return (
    <div ref={raiz} className="cortina" aria-hidden>
      <svg className="cortina__marca" viewBox="52 138 82 92" overflow="visible">
        <path
          className="cortina__trazo"
          d={A_EJE}
          pathLength={1}
          fill="none"
          stroke="#FF741F"
          strokeWidth={6.2}
          strokeLinejoin="miter"
        />
        <path className="cortina__relleno" d={A_RELLENO} fill="#FF741F" style={{ opacity: 0 }} />
      </svg>
      <p className="cortina__frase rotulo">Un lugar para crecer, crear y conectar</p>
      <span className="cortina__cuenta">000</span>
    </div>
  );
}
