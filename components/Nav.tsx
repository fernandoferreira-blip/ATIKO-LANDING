"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NAV, MARCA, enlaceWhatsApp } from "@/lib/contenido";
import { alEstarListo, obtenerLenis } from "@/lib/escena";
import { Flecha, IconoWhatsApp, Logo } from "./Marca";

export default function Nav() {
  const nav = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [abierto, setAbierto] = useState(false);

  useGSAP(() => {
    const el = nav.current!;
    // Se anima el contenido y no el <header>, que ya tiene transición CSS de transform.
    const interior = el.firstElementChild!;
    gsap.set(interior, { yPercent: -100, opacity: 0 });
    const quitar = alEstarListo(() => gsap.to(interior, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.5 }));

    // Fondo después del hero; se esconde al bajar y vuelve al subir.
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (st) => {
        const y = st.scroll();
        el.classList.toggle("con-fondo", y > window.innerHeight * 0.6);
        el.classList.toggle("escondida", st.direction === 1 && y > window.innerHeight * 1.2);
        document.querySelector(".flotante-wa")?.classList.toggle("oculto", y < window.innerHeight * 0.8);
      },
    });
    return quitar;
  });

  // El menú de celular es hermano del <header> para que el backdrop-filter no lo encierre.
  useEffect(() => {
    const lenis = obtenerLenis();
    if (abierto) lenis?.stop();
    else lenis?.start();
    if (!abierto || !menu.current) return;
    gsap.fromTo(
      menu.current.querySelectorAll(".menu-movil__item"),
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.25 }
    );
  }, [abierto]);

  return (
    <>
      <header ref={nav} className="nav">
        <div className="contenedor flex h-[76px] items-center justify-between gap-6">
          <a href="#inicio" className="relative z-10 block w-[104px] shrink-0" aria-label="ATIKO, ir al inicio" onClick={() => setAbierto(false)}>
            <Logo className="w-full" />
          </a>
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Principal">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="nav__enlace">
                {n.texto}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#contacto" className="btn btn--naranja hidden !h-11 !px-5 text-[14px] sm:inline-flex" data-magnetico>
              Agenda tu visita <Flecha className="flecha" />
            </a>
            <button
              type="button"
              className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-white/25 lg:hidden"
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setAbierto((v) => !v)}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 right-0 h-px bg-white transition-all duration-500 ${abierto ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 right-0 h-px bg-white transition-all duration-500 ${abierto ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="menu-movil" ref={menu} className={`menu-movil lg:hidden ${abierto ? "abierto" : ""}`} aria-hidden={!abierto}>
        <div className="contenedor flex h-full flex-col justify-between pb-10 pt-28">
          <nav className="flex flex-col gap-1" aria-label="Menú">
            {NAV.map((n, i) => (
              <div key={n.href} className="overflow-hidden">
                <a
                  href={n.href}
                  className="menu-movil__item titulo flex items-baseline gap-4 py-1 text-[44px]"
                  onClick={() => setAbierto(false)}
                  tabIndex={abierto ? 0 : -1}
                >
                  <span className="rotulo text-naranja">0{i + 1}</span>
                  {n.texto}
                </a>
              </div>
            ))}
          </nav>
          <div className="space-y-5">
            <a href={enlaceWhatsApp("Hola, quiero agendar una visita a ATIKO.")} className="btn btn--naranja w-full justify-center" tabIndex={abierto ? 0 : -1}>
              <IconoWhatsApp className="h-5 w-5" /> Escríbenos por WhatsApp
            </a>
            <p className="text-sm text-white/60">
              {MARCA.direccion}, {MARCA.ciudad}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
