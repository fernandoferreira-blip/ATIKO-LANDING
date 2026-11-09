"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { ESPACIOS } from "@/lib/contenido";
import { Flecha } from "./Marca";

// En escritorio la sección se fija y las tarjetas corren de lado con el scroll;
// en celular es un carrusel nativo que se desliza con el dedo.
export default function Espacios() {
  const raiz = useRef<HTMLElement>(null);
  const total = ESPACIOS.length + 1;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".espacios__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        gsap.from(titulo.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".espacios__titulo", start: "top 85%" },
        });
        return () => titulo.revert();
      });

      mm.add(`(min-width: 900px) and ${CON_MOVIMIENTO}`, () => {
        const pista = raiz.current!.querySelector<HTMLElement>(".espacios__pista")!;
        const distancia = () => pista.scrollWidth - window.innerWidth;
        const contador = raiz.current!.querySelector(".espacios__actual")!;

        const recorrido = gsap.to(pista, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: ".espacios__pin",
            start: "top top",
            end: () => "+=" + distancia(),
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              gsap.set(".barra-progreso span", { scaleX: st.progress });
              const i = Math.min(total, Math.floor(st.progress * total) + 1);
              contador.textContent = String(i).padStart(2, "0");
            },
          },
        });

        // Dentro de cada tarjeta la foto se desplaza a contrapelo (paralaje horizontal) y se descubre con una cortina.
        const tarjetas = gsap.utils.toArray<HTMLElement>(".tarjeta-espacio");
        const visibles = tarjetas.filter((t) => t.getBoundingClientRect().left < window.innerWidth);
        gsap.from(visibles, {
          y: 90,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: raiz.current, start: "top 65%" },
        });
        tarjetas.forEach((t) => {
          const img = t.querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { xPercent: -9 },
              {
                xPercent: 9,
                ease: "none",
                scrollTrigger: { trigger: t, containerAnimation: recorrido, start: "left right", end: "right left", scrub: true },
              }
            );
          }
          if (visibles.includes(t)) return;
          gsap.fromTo(
            t.querySelector(".tarjeta-espacio__foto"),
            { clipPath: "inset(0 0 0 100%)" },
            {
              clipPath: "inset(0 0 0 0%)",
              ease: "power2.out",
              scrollTrigger: { trigger: t, containerAnimation: recorrido, start: "left 98%", end: "left 55%", scrub: true },
            }
          );
        });
      });
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} id="espacios" className="espacios relative bg-black py-24 md:py-0" aria-labelledby="espacios-titulo">
      <div className="espacios__pin">
        <div className="contenedor mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="rotulo con-linea mb-6 text-white/60">Conoce los espacios</p>
            <h2 id="espacios-titulo" className="espacios__titulo titulo titulo-l max-w-[900px]">
              Cada rincón, <span className="acento">listo</span> para trabajar.
            </h2>
          </div>
          <div className="hidden w-[260px] shrink-0 md:block">
            <div className="rotulo mb-3 flex justify-between text-white/60">
              <span>
                <span className="espacios__actual text-white">01</span> / {String(total).padStart(2, "0")}
              </span>
              <span>Desliza</span>
            </div>
            <div className="barra-progreso">
              <span />
            </div>
          </div>
        </div>

        <div className="espacios__pista">
          {ESPACIOS.map((e, i) => (
            <article key={e.id} className="tarjeta-espacio" data-cursor="Ver">
              <div className="tarjeta-espacio__foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.foto}
                  srcSet={`${e.foto.replace(".webp", "-m.webp")} 1000w, ${e.foto} 1800w`}
                  sizes="(min-width: 900px) 32vw, 82vw"
                  alt={e.alt}
                  loading="lazy"
                />
              </div>
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <p className="rotulo mb-2 text-naranja">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="titulo text-[30px] md:text-[36px]">{e.nombre}</h3>
                </div>
              </div>
              <p className="mt-3 max-w-[420px] text-[15px] leading-relaxed text-white/65">{e.texto}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {e.datos.map((d) => (
                  <span key={d} className="etiqueta">
                    {d}
                  </span>
                ))}
              </div>
            </article>
          ))}

          {/* La Vision Room no se enseña aquí: sólo se insinúa. */}
          <a href="#vision-room" className="tarjeta-espacio tarjeta-secreta block" data-cursor="Entrar">
            <div className="tarjeta-espacio__foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/vision-room-m.webp" alt="" loading="lazy" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="rotulo rounded-full border border-white/25 px-4 py-2 text-white/80">Clasificado</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="rotulo mb-2 text-naranja">{String(total).padStart(2, "0")}</p>
              <h3 className="titulo text-[30px] md:text-[36px]">Falta uno.</h3>
            </div>
            <p className="mt-3 max-w-[420px] text-[15px] leading-relaxed text-white/65">
              Lo que sigue no se cuenta, se ve. Sigue bajando.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-naranja">
              Descúbrela <Flecha direccion="abajo" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
