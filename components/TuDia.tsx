"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { DIA } from "@/lib/contenido";

const formatoHora = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}:${String(mm).padStart(2, "0")}`;
};

// Un reloj fijo a la izquierda avanza de 8:00 a 19:00 mientras recorres el día.
export default function TuDia() {
  const raiz = useRef<HTMLElement>(null);
  const primera = DIA.momentos[0].hora;
  const ultima = DIA.momentos[DIA.momentos.length - 1].hora;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".dia__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        gsap.from(titulo.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".dia__titulo", start: "top 85%" },
        });

        const lectura = raiz.current!.querySelector(".reloj__hora")!;
        const espacio = raiz.current!.querySelector(".reloj__espacio")!;
        const aguja = raiz.current!.querySelector(".reloj__aguja");
        const arco = raiz.current!.querySelector(".reloj__arco");
        const estado = { h: primera };

        // 8:00 a 19:00 recorre 330° del círculo (cada hora = 30°); el arco naranja marca lo recorrido.
        const pintar = () => {
          gsap.set(aguja, { rotation: (estado.h - 12) * 30, svgOrigin: "200 200" });
          gsap.set(arco, { attr: { "stroke-dasharray": `${(((estado.h - primera) / (ultima - primera)) * 330) / 360} 1` } });
          lectura.textContent = formatoHora(Math.round(estado.h * 4) / 4);
        };
        pintar();

        gsap.to(estado, {
          h: ultima,
          ease: "none",
          onUpdate: pintar,
          scrollTrigger: { trigger: ".momentos", start: "top 55%", end: "bottom 55%", scrub: 0.6 },
        });

        gsap.utils.toArray<HTMLElement>(".momento").forEach((m) => {
          ScrollTrigger.create({
            trigger: m,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (st) => {
              m.classList.toggle("activo", st.isActive);
              if (st.isActive) espacio.textContent = m.dataset.espacio ?? "";
            },
          });
        });

        return () => titulo.revert();
      });
    },
    { scope: raiz }
  );

  const marcas = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section ref={raiz} className="seccion relative bg-black" aria-labelledby="dia-titulo">
      <div className="contenedor">
        <p className="rotulo con-linea mb-6 text-white/60">{DIA.rotulo}</p>
        <h2 id="dia-titulo" className="dia__titulo titulo titulo-l mb-16 max-w-[900px] md:mb-24">
          {DIA.titulo[0]} {DIA.titulo[1]} <span className="acento">{DIA.titulo[2]}</span>
        </h2>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="sticky top-20 z-[1] self-start bg-black/85 py-4 backdrop-blur-sm lg:top-28 lg:bg-transparent lg:py-0 lg:backdrop-blur-none">
            <div className="reloj relative mx-auto max-w-[180px] lg:max-w-[440px]">
              <svg viewBox="0 0 400 400" aria-hidden>
                <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
                <circle
                  className="reloj__arco"
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="#FF741F"
                  strokeWidth="2"
                  pathLength={1}
                  strokeDasharray="0 1"
                  transform="rotate(150 200 200)"
                />
                {marcas.map((i) => {
                  const a = (i * 30 * Math.PI) / 180;
                  // Redondeado: servidor y navegador no dan los mismos decimales y la hidratación falla.
                  const r2 = (n: number) => Math.round(n * 100) / 100;
                  const x1 = r2(200 + Math.sin(a) * 160);
                  const y1 = r2(200 - Math.cos(a) * 160);
                  const x2 = r2(200 + Math.sin(a) * 170);
                  const y2 = r2(200 - Math.cos(a) * 170);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.35)" strokeWidth="1" />;
                })}
                <g className="reloj__aguja">
                  <line x1="200" y1="200" x2="200" y2="52" stroke="#fff" strokeWidth="1.5" />
                  <path d="M200 40 l6 12 h-12 Z" fill="#FF741F" />
                </g>
                <circle cx="200" cy="200" r="4" fill="#FF741F" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="reloj__hora font-display text-[32px] leading-none tracking-[-0.04em] tabular-nums lg:text-[76px]">
                  {formatoHora(primera)}
                </span>
                <span className="reloj__espacio rotulo mt-2 text-[9px] text-white/55 lg:mt-4 lg:text-[11px]">{DIA.momentos[0].espacio}</span>
              </div>
            </div>
          </div>

          <ol className="momentos">
            {DIA.momentos.map((m) => (
              <li key={m.hora} className="momento" data-espacio={m.espacio}>
                <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
                  <span className="momento__hora shrink-0 md:w-[170px]">{formatoHora(m.hora)}</span>
                  <div>
                    <p className="rotulo mb-2 text-naranja">{m.espacio}</p>
                    <p className="titulo text-[24px] leading-[1.2] md:text-[32px]">{m.texto}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
