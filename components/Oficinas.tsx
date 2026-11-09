"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { OFICINAS, enlaceWhatsApp } from "@/lib/contenido";
import { A_EJE, Flecha } from "./Marca";

export default function Oficinas() {
  const raiz = useRef<HTMLElement>(null);
  const flotante = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".oficinas__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        gsap.from(titulo.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".oficinas__titulo", start: "top 85%" },
        });
        gsap.from(".formato", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".formatos", start: "top 80%" },
        });
        gsap.from(".incluye-item", {
          x: -20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".incluye-lista", start: "top 85%" },
        });
        gsap.fromTo(
          ".oficinas .marca-agua path",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top 60%", end: "bottom 60%", scrub: true } }
        );
        return () => titulo.revert();
      });

      // La foto flotante sigue al mouse sobre la lista de formatos.
      const el = flotante.current!;
      const fx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const fy = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const mover = (e: PointerEvent) => {
        fx(e.clientX);
        fy(e.clientY);
      };
      window.addEventListener("pointermove", mover, { passive: true });
      return () => window.removeEventListener("pointermove", mover);
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} id="oficinas" className="oficinas seccion claro overflow-clip" aria-labelledby="oficinas-titulo">
      <svg className="marca-agua bottom-[-12%] left-[-22vw] h-[75%] w-auto md:left-[-10vw]" viewBox="52 138 82 92" aria-hidden>
        <path d={A_EJE} pathLength={1} stroke="rgba(255,116,31,.45)" />
      </svg>

      <div className="contenedor relative grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="rotulo con-linea mb-6 text-black/60">{OFICINAS.rotulo}</p>
          <h2 id="oficinas-titulo" className="oficinas__titulo titulo titulo-l">
            {OFICINAS.titulo[0]} <span className="acento">{OFICINAS.titulo[1]}</span> {OFICINAS.titulo[2]}
          </h2>
          <p className="entrada mt-8 max-w-[460px] text-black/70">{OFICINAS.texto}</p>
          <p className="mt-4 max-w-[460px] text-[15px] text-black/55">{OFICINAS.mobiliario}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={enlaceWhatsApp("Hola, quiero información de las oficinas privadas de ATIKO.")} className="btn btn--negro" data-magnetico>
              Pregunta por disponibilidad <Flecha className="flecha" />
            </a>
          </div>
        </div>

        <div>
          <div className="formatos" onPointerLeave={() => setActiva(null)}>
            {OFICINAS.formatos.map((f, i) => (
              <article key={f.nombre} className="formato" onPointerEnter={() => setActiva(i)}>
                <div className="formato__foto-movil">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.foto.replace(".webp", "-m.webp")} alt={f.alt} loading="lazy" />
                </div>
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                  <h3 className="formato__nombre">{f.nombre}</h3>
                  <div className="flex gap-2 pb-2">
                    <span className="etiqueta">{f.medida}</span>
                    <span className="etiqueta">{f.personas}</span>
                  </div>
                </div>
                <p className="max-w-[520px] text-[16px] leading-relaxed text-black/65">{f.texto}</p>
              </article>
            ))}
          </div>

          <div className="mt-20">
            <h3 className="titulo titulo-m mb-8">La renta incluye</h3>
            <ul className="incluye-lista grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {OFICINAS.incluye.map((t) => (
                <li key={t} className="incluye-item flex gap-3 text-[16px] leading-snug text-black/80">
                  <span className="viñeta" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div ref={flotante} className={`flotante ${activa !== null ? "visible" : ""}`} aria-hidden>
        {OFICINAS.formatos.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f.nombre} src={f.foto.replace(".webp", "-m.webp")} alt="" className={activa === i ? "activa" : ""} />
        ))}
      </div>
    </section>
  );
}
