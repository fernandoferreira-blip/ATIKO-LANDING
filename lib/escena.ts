"use client";

import type Lenis from "lenis";

// Estado compartido de la página: la instancia de Lenis y el aviso de que terminó la cortina de entrada.
let lenis: Lenis | null = null;
let listo = false;
const esperando = new Set<() => void>();

export function registrarLenis(instancia: Lenis | null) {
  lenis = instancia;
}

export function obtenerLenis() {
  return lenis;
}

export function irA(destino: string | HTMLElement, desfase = 0) {
  const el = typeof destino === "string" ? document.querySelector<HTMLElement>(destino) : destino;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: desfase, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function marcarListo() {
  if (listo) return;
  listo = true;
  esperando.forEach((fn) => fn());
  esperando.clear();
}

// Ejecuta fn cuando la cortina de entrada termina (o de inmediato si ya terminó).
export function alEstarListo(fn: () => void) {
  if (listo) {
    fn();
    return () => {};
  }
  esperando.add(fn);
  return () => esperando.delete(fn);
}
