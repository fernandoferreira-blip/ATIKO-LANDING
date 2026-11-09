"use client";

import { useRef } from "react";
import { gsap, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { MARCA, NAV, enlaceWhatsApp } from "@/lib/contenido";
import { IconoWhatsApp, Logo } from "./Marca";

export default function Pie() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        // Las letras del logotipo suben una por una, sin separarse ni reacomodarse.
        gsap.from(".pie__logo path", {
          yPercent: 100,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".pie__logo", start: "top 95%" },
        });
      });
    },
    { scope: raiz }
  );

  const año = new Date().getFullYear();

  return (
    <footer ref={raiz} className="relative overflow-clip bg-black pt-20">
      <div className="contenedor">
        <div className="grid gap-12 border-t border-white/10 pt-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="titulo text-[28px] md:text-[36px]">{MARCA.eslogan}</p>
            <a href={enlaceWhatsApp("Hola, quiero agendar una visita a ATIKO.")} className="btn btn--linea mt-8" target="_blank" rel="noopener">
              <IconoWhatsApp className="h-5 w-5" /> {MARCA.telefono}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="rotulo mb-4 text-white/45">Explora</p>
              <ul className="space-y-2">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="nav__enlace">
                      {n.texto}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="rotulo mb-4 text-white/45">Visítanos</p>
              <p className="text-[14px] leading-relaxed text-white/70">
                {MARCA.direccion}
                <br />
                {MARCA.ciudad}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="rotulo mb-4 text-white/45">Escríbenos</p>
              <a href={`mailto:${MARCA.correo}`} className="nav__enlace">
                {MARCA.correo}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="contenedor mt-20 overflow-clip pb-6">
        <Logo className="pie__logo" />
      </div>
      <div className="contenedor flex flex-col gap-2 border-t border-white/10 py-6 text-[12px] text-white/40 sm:flex-row sm:justify-between">
        <span suppressHydrationWarning>
          © {año} {MARCA.nombre} · {MARCA.descriptor}
        </span>
        <span>San Luis Potosí, México</span>
      </div>
    </footer>
  );
}
