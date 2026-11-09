"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registrarLenis } from "@/lib/escena";

// Scroll suave con Lenis sincronizado con el reloj de GSAP, para que ScrollTrigger y el scroll vayan al mismo paso.
export default function EscenaScroll() {
  useEffect(() => {
    // Las fuentes y fotos cambian alturas: recalcular los disparadores cuando terminen de cargar.
    const refrescar = () => ScrollTrigger.refresh();
    window.addEventListener("load", refrescar);
    document.fonts?.ready.then(refrescar);

    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido) {
      return () => window.removeEventListener("load", refrescar);
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
    registrarLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Enlaces internos (#seccion) con desplazamiento suave.
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const destino = document.querySelector<HTMLElement>(id);
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino, { offset: 0, duration: 1.6 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", alClic);

    return () => {
      document.removeEventListener("click", alClic);
      window.removeEventListener("load", refrescar);
      gsap.ticker.remove(tick);
      lenis.destroy();
      registrarLenis(null);
    };
  }, []);

  return null;
}
