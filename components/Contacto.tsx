"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { CONTACTO, MARCA, enlaceWhatsApp } from "@/lib/contenido";
import { Flecha, IconoWhatsApp } from "./Marca";

// El formulario no guarda nada: arma el mensaje y abre WhatsApp con el texto listo.
export default function Contacto() {
  const raiz = useRef<HTMLElement>(null);
  const [intereses, setIntereses] = useState<string[]>([]);
  const [error, setError] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(CON_MOVIMIENTO, () => {
        const titulo = new SplitText(".contacto__titulo", { type: "lines,words", mask: "lines", linesClass: "linea-mascara" });
        gsap.from(titulo.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".contacto__titulo", start: "top 85%" },
        });
        gsap.from(".contacto__bloque", {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".contacto__cuerpo", start: "top 82%" },
        });
        return () => titulo.revert();
      });
    },
    { scope: raiz }
  );

  const alternar = (x: string) => setIntereses((v) => (v.includes(x) ? v.filter((y) => y !== x) : [...v, x]));

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const telefono = String(datos.get("telefono") ?? "").trim();
    if (!nombre || !telefono) {
      setError("Escribe tu nombre y un teléfono para poder contestarte.");
      return;
    }
    setError("");
    const empresa = String(datos.get("empresa") ?? "").trim();
    const cuando = String(datos.get("cuando") ?? "").trim();
    const mensaje = String(datos.get("mensaje") ?? "").trim();
    const lineas = [
      `Hola, soy ${nombre}${empresa ? ` de ${empresa}` : ""}. Quiero agendar una visita a ATIKO.`,
      intereses.length ? `Me interesa: ${intereses.join(", ")}.` : "",
      cuando ? `Me gustaría ir: ${cuando}.` : "",
      mensaje,
      `Mi teléfono: ${telefono}`,
    ].filter(Boolean);
    window.open(enlaceWhatsApp(lineas.join("\n")), "_blank", "noopener");
  };

  return (
    <section ref={raiz} id="contacto" className="seccion bg-black" aria-labelledby="contacto-titulo">
      <div className="contenedor">
        <p className="rotulo con-linea mb-6 text-white/60">{CONTACTO.rotulo}</p>
        <h2 id="contacto-titulo" className="contacto__titulo titulo titulo-l mb-16 max-w-[1100px] md:mb-24">
          <span className="acento">{CONTACTO.titulo[0]}</span> {CONTACTO.titulo[1]} {CONTACTO.titulo[2]}
        </h2>

        <div className="contacto__cuerpo grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <form className="contacto__bloque space-y-10" onSubmit={enviar} noValidate>
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="rotulo text-white/50">Nombre *</span>
                <input name="nombre" className="campo" placeholder="¿Cómo te llamas?" autoComplete="name" />
              </label>
              <label className="block">
                <span className="rotulo text-white/50">Teléfono *</span>
                <input name="telefono" type="tel" className="campo" placeholder="444 000 0000" autoComplete="tel" inputMode="tel" />
              </label>
              <label className="block">
                <span className="rotulo text-white/50">Empresa o proyecto</span>
                <input name="empresa" className="campo" placeholder="Opcional" autoComplete="organization" />
              </label>
              <label className="block">
                <span className="rotulo text-white/50">¿Cuándo te gustaría venir?</span>
                <input name="cuando" className="campo" placeholder="Ej. martes en la mañana" />
              </label>
            </div>

            <fieldset>
              <legend className="rotulo mb-4 text-white/50">¿Qué te interesa?</legend>
              <div className="flex flex-wrap gap-2">
                {CONTACTO.intereses.map((x) => (
                  <button key={x} type="button" className="chip" aria-pressed={intereses.includes(x)} onClick={() => alternar(x)}>
                    {x}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="rotulo text-white/50">Cuéntanos más</span>
              <textarea name="mensaje" rows={3} className="campo resize-none" placeholder="Tamaño de tu equipo, fechas para un taller, lo que necesites." />
            </label>

            {error && (
              <p className="text-[15px] text-naranja" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-5">
              <button type="submit" className="btn btn--naranja" data-magnetico>
                <IconoWhatsApp className="h-5 w-5" /> Enviar por WhatsApp <Flecha className="flecha" />
              </button>
              <p className="text-[13px] text-white/45">Se abre WhatsApp con tu mensaje listo para enviar.</p>
            </div>
          </form>

          <div className="contacto__bloque space-y-10">
            <a href={MARCA.mapa} target="_blank" rel="noopener" className="mapa block" data-cursor="Abrir">
              <iframe src={MARCA.mapaEmbed} title="Ubicación de ATIKO en Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="pointer-events-none" />
            </a>
            <dl className="grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="rotulo mb-2 text-white/45">Dirección</dt>
                <dd className="text-[16px] leading-relaxed text-white/85">
                  {MARCA.direccion}
                  <br />
                  {MARCA.ciudad}
                </dd>
              </div>
              <div>
                <dt className="rotulo mb-2 text-white/45">Horario</dt>
                <dd className="space-y-1 text-[16px] leading-relaxed text-white/85">
                  {MARCA.horario.map((h) => (
                    <span key={h.dias} className="block">
                      {h.dias}: {h.horas}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="rotulo mb-2 text-white/45">Teléfono</dt>
                <dd>
                  <a href={MARCA.telefonoLink} className="text-[16px] text-white/85 underline-offset-4 hover:text-naranja hover:underline">
                    {MARCA.telefono}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="rotulo mb-2 text-white/45">Correo</dt>
                <dd>
                  <a href={`mailto:${MARCA.correo}`} className="text-[16px] text-white/85 underline-offset-4 hover:text-naranja hover:underline">
                    {MARCA.correo}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
