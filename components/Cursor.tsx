"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Cursor propio (sólo con mouse): punto naranja, aro que sigue con retraso y etiqueta con data-cursor="Ver".
// También mueve hacia el puntero los elementos con data-magnetico.
export default function Cursor() {
  const raiz = useRef<HTMLDivElement>(null);
  const texto = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fino.matches) return;
    const el = raiz.current!;
    const punto = el.querySelector(".cursor__punto")!;
    const aro = el.querySelector(".cursor__aro")!;
    document.documentElement.classList.add("con-cursor");

    const px = gsap.quickTo(punto, "x", { duration: 0.08, ease: "power3" });
    const py = gsap.quickTo(punto, "y", { duration: 0.08, ease: "power3" });
    const ax = gsap.quickTo(aro, "x", { duration: 0.45, ease: "power3" });
    const ay = gsap.quickTo(aro, "y", { duration: 0.45, ease: "power3" });

    let magnetico: HTMLElement | null = null;

    const mover = (e: PointerEvent) => {
      el.classList.remove("oculto");
      px(e.clientX);
      py(e.clientY);
      ax(e.clientX);
      ay(e.clientY);
      if (magnetico) {
        const r = magnetico.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(magnetico, { x: dx * 0.28, y: dy * 0.36, duration: 0.6, ease: "power3.out" });
      }
    };

    const sobre = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const conTexto = t.closest<HTMLElement>("[data-cursor]");
      const linterna = t.closest("[data-linterna]");
      const enlace = t.closest("a, button, label, [role='tab']");
      el.classList.toggle("con-texto", !!conTexto);
      el.classList.toggle("linterna", !!linterna && !conTexto);
      el.classList.toggle("es-enlace", !!enlace && !conTexto);
      if (texto.current) texto.current.textContent = conTexto?.dataset.cursor ?? "";

      const m = t.closest<HTMLElement>("[data-magnetico]");
      if (m !== magnetico) {
        if (magnetico) gsap.to(magnetico, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
        magnetico = m;
      }
    };

    const salir = () => el.classList.add("oculto");
    const entrar = () => el.classList.remove("oculto");

    window.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerover", sobre);
    document.documentElement.addEventListener("pointerleave", salir);
    document.documentElement.addEventListener("pointerenter", entrar);
    return () => {
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerover", sobre);
      document.documentElement.removeEventListener("pointerleave", salir);
      document.documentElement.removeEventListener("pointerenter", entrar);
      document.documentElement.classList.remove("con-cursor");
    };
  }, []);

  return (
    <div ref={raiz} className="cursor oculto" aria-hidden>
      <div className="cursor__aro">
        <span ref={texto} className="cursor__texto" />
      </div>
      <div className="cursor__punto" />
    </div>
  );
}
