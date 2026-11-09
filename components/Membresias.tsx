"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { MEMBRESIAS, enlaceWhatsApp } from "@/lib/contenido";
import { Flecha, Isotipo, Logo } from "./Marca";

// Tarjeta ATIKO Rewards que se inclina con el mouse y refleja la luz.
function TarjetaRewards() {
  const tarjeta = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = tarjeta.current!;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ry((x - 0.5) * 22);
      rx((0.5 - y) * 16);
      el.style.setProperty("--bx", `${x * 100}%`);
      el.style.setProperty("--by", `${y * 100}%`);
    };
    const salir = () => {
      rx(0);
      ry(0);
    };
    const zona = el.parentElement!;
    zona.addEventListener("pointermove", mover);
    zona.addEventListener("pointerleave", salir);
    return () => {
      zona.removeEventListener("pointermove", mover);
      zona.removeEventListener("pointerleave", salir);
    };
  });

  return (
    <div className="flex justify-center py-6 [perspective:1100px]">
      <div ref={tarjeta} className="tarjeta-rewards" role="img" aria-label="Tarjeta de miembro ATIKO Rewards">
        <div className="absolute inset-0 p-[7%]">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <Logo className="w-[34%]" />
              <span className="rotulo text-[10px] text-white/60">Rewards</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="rotulo text-[9px] text-white/45">Membership card</p>
                <p className="mt-1 font-display text-[clamp(16px,2.4vw,22px)] tracking-[-0.01em]">Miembro ATIKO</p>
              </div>
              <Isotipo className="w-[12%] opacity-90" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-[5px]" aria-hidden>
          <span className="w-1/2 bg-naranja" />
          <span className="w-1/2 bg-white/10" />
        </div>
        <div className="tarjeta-rewards__brillo" />
      </div>
    </div>
  );
}

export default function Membresias() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".membresias__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        gsap.from(titulo.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".membresias__titulo", start: "top 85%" },
        });
        gsap.from(".plan", {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".planes", start: "top 82%" },
        });
        gsap.from(".tarjeta-rewards", {
          rotationX: 50,
          y: 80,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".membresias__todas", start: "top 80%" },
        });
        return () => titulo.revert();
      });
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} id="membresias" className="seccion claro" aria-labelledby="membresias-titulo">
      <div className="contenedor">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="rotulo con-linea mb-6 text-black/60">{MEMBRESIAS.rotulo}</p>
            <h2 id="membresias-titulo" className="membresias__titulo titulo titulo-l">
              {MEMBRESIAS.titulo[0]} <span className="acento">{MEMBRESIAS.titulo[1]}</span>
            </h2>
          </div>
          <p className="entrada max-w-[460px] text-black/65 md:justify-self-end">{MEMBRESIAS.texto}</p>
        </div>

        <div className="planes grid gap-4 md:grid-cols-3">
          {MEMBRESIAS.planes.map((p, i) => (
            <article key={p.nombre} className="plan">
              <span className="plan__numero">0{i + 1}</span>
              <div>
                <h3 className="titulo text-[30px] md:text-[34px]">{p.nombre}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-black/60">{p.resumen}</p>
              </div>
              <ul className="space-y-2.5 border-t border-black/10 pt-6">
                {p.puntos.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] text-black/80">
                    <span className="viñeta" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
              <a
                href={enlaceWhatsApp(`Hola, quiero información de la membresía ${p.nombre} de ATIKO.`)}
                className="btn btn--tinta-linea mt-auto justify-center"
              >
                Quiero esta membresía <Flecha className="flecha" />
              </a>
            </article>
          ))}
        </div>

        <div className="membresias__todas mt-20 grid items-center gap-12 rounded-md bg-black p-8 text-white md:grid-cols-2 md:p-14">
          <TarjetaRewards />
          <div>
            <h3 className="titulo titulo-m">Todas las membresías incluyen</h3>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {MEMBRESIAS.todas.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] leading-snug text-white/80">
                  <span className="viñeta" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
