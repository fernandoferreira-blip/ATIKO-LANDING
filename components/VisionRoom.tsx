"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, CON_MOVIMIENTO } from "@/lib/gsap";
import { VISION, enlaceWhatsApp } from "@/lib/contenido";
import { A_EJE, Flecha } from "./Marca";

// Posición de la marca de agua en cada póster (el triángulo nunca se gira, hoja 11).
const TRIANGULOS = [
  { left: "-30%", top: "-6%", height: "120%" },
  { left: "35%", top: "18%", height: "95%" },
  { left: "-10%", top: "40%", height: "80%" },
  { left: "10%", top: "-35%", height: "110%" },
  { left: "45%", top: "-10%", height: "70%" },
  { left: "-45%", top: "20%", height: "130%" },
  { left: "20%", top: "50%", height: "90%" },
  { left: "-5%", top: "5%", height: "60%" },
];

const SIMBOLOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#<>+*";

// Partículas de polvo flotando dentro del haz del proyector.
function crearPolvo(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let id = 0;
  type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; f: number };
  let ps: P[] = [];

  const medir = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(160, (w * h) / 9000));
    ps = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.08 - 0.03,
      a: Math.random() * 0.6 + 0.2,
      f: Math.random() * Math.PI * 2,
    }));
  };

  const cuadro = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const ox = w / 2;
    const oy = -h * 0.12;
    for (const p of ps) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      // Más brillo cuanto más cerca del eje del haz.
      const ang = Math.abs(Math.atan2(p.x - ox, p.y - oy));
      const enHaz = Math.max(0, 1 - ang / 0.3);
      const titileo = 0.6 + 0.4 * Math.sin(t * 0.002 + p.f);
      const alfa = p.a * titileo * (0.08 + enHaz * 0.92);
      if (alfa < 0.02) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 236, 214, ${alfa})`;
      ctx.fill();
    }
    id = requestAnimationFrame(cuadro);
  };

  medir();
  window.addEventListener("resize", medir);
  return {
    iniciar: () => {
      cancelAnimationFrame(id);
      id = requestAnimationFrame(cuadro);
    },
    detener: () => cancelAnimationFrame(id),
    destruir: () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", medir);
    },
  };
}

export default function VisionRoom() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(CON_MOVIMIENTO, () => {
        const escena = raiz.current!.querySelector<HTMLElement>(".vr__escena")!;
        const canvas = raiz.current!.querySelector<HTMLCanvasElement>(".vr__polvo")!;
        const polvo = crearPolvo(canvas);

        // La linterna: --mx/--my siguen al puntero; sin mouse (o quieto) la luz vaga sola.
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const aplicar = () => {
          escena.style.setProperty("--mx", `${pos.x}px`);
          escena.style.setProperty("--my", `${pos.y}px`);
        };
        const qx = gsap.quickTo(pos, "x", { duration: 0.7, ease: "power3", onUpdate: aplicar });
        const qy = gsap.quickTo(pos, "y", { duration: 0.7, ease: "power3", onUpdate: aplicar });
        let ultimo = 0;
        const mover = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const r = escena.getBoundingClientRect();
          ultimo = performance.now();
          qx(e.clientX - r.left);
          qy(e.clientY - r.top);
        };
        escena.addEventListener("pointermove", mover);
        const vagar = (t: number) => {
          if (performance.now() - ultimo < 2200) return;
          const s = t * 0.35;
          qx(escena.clientWidth * (0.5 + 0.3 * Math.sin(s)));
          qy(escena.clientHeight * (0.52 + 0.2 * Math.sin(s * 1.7)));
        };

        ScrollTrigger.create({
          trigger: raiz.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (st) => {
            if (st.isActive) {
              polvo.iniciar();
              gsap.ticker.add(vagar);
            } else {
              polvo.detener();
              gsap.ticker.remove(vagar);
            }
          },
        });

        const frase1 = new SplitText(".vr__f1 p", { type: "words" });
        const frase2 = new SplitText(".vr__f2 p", { type: "words" });
        const titulo = new SplitText(".vr__titulo h2", { type: "chars" });
        const diagonal = () => Math.hypot(escena.clientWidth, escena.clientHeight) * 4 + "px";

        gsap.set(escena, { "--r": "0px", "--barra": "0%" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: escena,
            start: "top top",
            end: "+=420%",
            scrub: 0.9,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        tl.addLabel("silencio", 0)
          .fromTo(frase1.words, { opacity: 0, filter: "blur(10px)", y: 16 }, { opacity: 1, filter: "blur(0px)", y: 0, stagger: 0.12, duration: 0.5 }, 0.1)
          .to(frase1.words, { opacity: 0, filter: "blur(8px)", stagger: 0.06, duration: 0.4 }, 1)
          .addLabel("misterio", 1.4)
          .fromTo(frase2.words, { opacity: 0, filter: "blur(12px)", y: 20 }, { opacity: 1, filter: "blur(0px)", y: 0, stagger: 0.08, duration: 0.6 }, 1.4)
          .to(frase2.words, { opacity: 0, filter: "blur(10px)", stagger: 0.03, duration: 0.5 }, 2.7)
          // Se enciende el proyector y aparece la linterna.
          .addLabel("linterna", 3)
          .to(".vr__haz-envoltura", { opacity: 0.85, duration: 0.6 }, 3)
          .to(escena, { "--r": "190px", duration: 0.9, ease: "power2.out" }, 3.1)
          .fromTo(".vr__pista", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 3.3)
          .to(escena, { "--r": "320px", duration: 1.6 }, 4)
          .to(".vr__pista", { opacity: 0, duration: 0.3 }, 5.1)
          // Oscuridad y cuenta regresiva de película.
          .addLabel("cuenta", 5.3)
          .to(escena, { "--r": "0px", duration: 0.35, ease: "power2.in" }, 5.2)
          .to(".vr__cuenta", { opacity: 1, duration: 0.2 }, 5.4);

        ["3", "2", "1"].forEach((n, i) => {
          const t0 = 5.5 + i * 0.5;
          tl.set(".vr__numero", { opacity: 0 }, t0)
            .set(`.vr__numero[data-n="${n}"]`, { opacity: 1 }, t0)
            .fromTo(".vr__barrido", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5 }, t0);
        });

        tl.to(".vr__cuenta", { opacity: 0, duration: 0.12 }, 7)
          // Destello: se abre la sala en formato cinemascope.
          .addLabel("revelacion", 7)
          .to(".vr__destello", { opacity: 0.9, duration: 0.1 }, 7)
          .set(escena, { "--r": diagonal }, 7.1)
          .to(".vr__destello", { opacity: 0, duration: 0.6, ease: "power2.out" }, 7.1)
          .to(".vr__haz-envoltura", { opacity: 0.35, duration: 0.8 }, 7.1)
          .fromTo(".vr__foto", { scale: 1.18 }, { scale: 1, duration: 2.6, ease: "power1.out" }, 7.1)
          .to(escena, { "--barra": "10%", duration: 0.8, ease: "power2.inOut" }, 7.3)
          .to(".vr__titulo-velo", { opacity: 1, duration: 0.6 }, 7.8)
          .fromTo(".vr__titulo .rotulo", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, 8)
          .fromTo(
            titulo.chars,
            { opacity: 0, filter: "blur(14px)", yPercent: 18 },
            { opacity: 1, filter: "blur(0px)", yPercent: 0, stagger: 0.06, duration: 0.5, ease: "power2.out" },
            8.05
          )
          .fromTo(".vr__titulo .entrada", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, 8.6)
          .to({}, { duration: 0.8 });

        // Ficha técnica: cada dato se "descifra" al aparecer.
        // El texto real sale de data-final (no del DOM, que puede estar revuelto) y no se toca hasta onStart:
        // ScrollTrigger dispara onUpdate al registrarse, antes de que la animación empiece.
        gsap.utils.toArray<HTMLElement>(".creditos dd").forEach((dd, i) => {
          const final = dd.dataset.final ?? "";
          const p = { v: 0 };
          let iniciado = false;
          gsap.to(p, {
            v: 1,
            duration: 1.3,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: dd, start: "top 90%" },
            onStart: () => {
              iniciado = true;
            },
            onUpdate: () => {
              if (!iniciado) return;
              const visibles = Math.floor(p.v * final.length);
              let s = "";
              for (let k = 0; k < final.length; k++) {
                const c = final[k];
                s += k < visibles || c === " " ? c : SIMBOLOS[(Math.random() * SIMBOLOS.length) | 0];
              }
              dd.textContent = s;
            },
            onComplete: () => {
              dd.textContent = final;
            },
          });
        });
        gsap.from(".creditos dt", {
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          scrollTrigger: { trigger: ".creditos", start: "top 85%" },
        });
        gsap.from(".marquesina", {
          scale: 0.92,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".marquesina", start: "top 88%" },
        });
        gsap.from(".poster", {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".cartelera", start: "top 85%" },
        });

        return () => {
          polvo.destruir();
          gsap.ticker.remove(vagar);
          escena.removeEventListener("pointermove", mover);
          frase1.revert();
          frase2.revert();
          titulo.revert();
        };
      });
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} id="vision-room" className="vr" aria-labelledby="vr-titulo">
      <div className="vr__escena" data-linterna>
        <div className="vr__pantalla">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="vr__foto"
            src="/img/vision-room.webp"
            srcSet="/img/vision-room-m.webp 1000w, /img/vision-room.webp 1800w"
            sizes="100vw"
            alt="Vision Room: sala de proyección con butacas, pantalla de 100 pulgadas e iluminación LED"
            loading="lazy"
          />
        </div>

        <div className="vr__haz-envoltura pointer-events-none absolute inset-0 opacity-0" aria-hidden>
          <div className="vr__haz parpadea" />
          <canvas className="vr__polvo" />
        </div>

        <div className="vr__frase vr__f1" aria-hidden>
          <p className="titulo titulo-m text-white/85">{VISION.frases[0]}</p>
        </div>
        <div className="vr__frase vr__f2" aria-hidden>
          <p className="titulo titulo-l max-w-[1100px]">
            {VISION.frases[1]} {VISION.frases[2].replace("a oscuras.", "")}
            <span className="acento">a oscuras.</span>
          </p>
        </div>

        <div className="vr__pista rotulo opacity-0" aria-hidden>
          <span className="relative grid h-7 w-7 place-items-center rounded-full border border-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="cursor-txt">{VISION.pistaCursor}</span>
          <span className="tactil">{VISION.pistaTactil}</span>
        </div>

        <div className="vr__cuenta" aria-hidden>
          <div className="parpadea-cuenta relative h-full w-full">
            <svg viewBox="0 0 200 200">
              <circle
                className="vr__barrido"
                cx="100"
                cy="100"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,.14)"
                strokeWidth="80"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" />
              <path d="M100 -20V220M-20 100H220" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
            </svg>
            {["3", "2", "1"].map((n) => (
              <span key={n} className="vr__numero" data-n={n}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="vr__barras absolute inset-0" aria-hidden />
        <div className="vr__destello" aria-hidden />
        <div className="vr__titulo-velo" aria-hidden />
        <div className="vr__titulo">
          <p className="rotulo mb-5 text-white/75">{VISION.rotulo} · 28 lugares</p>
          <h2 id="vr-titulo">
            Vision <span className="acento">Room</span>
          </h2>
          <p className="entrada mt-5 max-w-[520px] text-white/80">{VISION.subtitulo}</p>
        </div>
        <div className="grano" aria-hidden />
      </div>

      {/* Ficha técnica como créditos */}
      <div className="relative overflow-clip pb-28 pt-24 md:pb-40 md:pt-32">
        <div className="grano opacity-[0.05]" aria-hidden />
        <div className="contenedor relative">
          <p className="rotulo mb-12 text-center text-white/50">Ficha técnica</p>
          <dl className="creditos">
            {VISION.ficha.map((f) => (
              <div key={f.rol} className="contents">
                <dt>{f.rol}</dt>
                <dd data-final={f.valor}>{f.valor}</dd>
              </div>
            ))}
          </dl>
          <p className="mx-auto mt-16 max-w-[620px] text-center text-[16px] leading-relaxed text-white/60">
            Somos más que una sala didáctica: butacas cómodas, pantalla de cine y sonido que llena el cuarto. Tu audiencia
            pone atención porque no hay nada más que ver.
          </p>
        </div>
      </div>

      {/* Cartelera */}
      <div className="relative pb-28 md:pb-40">
        <div className="contenedor mb-12 flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="marquesina">
            <p className="titulo text-[34px] tracking-[-0.02em] md:text-[52px]">En cartelera</p>
          </div>
          <p className="max-w-[440px] text-[16px] leading-relaxed text-white/60">
            Capacitaciones, cursos, talleres y lanzamientos. Tú pones el contenido; la sala hace que nadie lo olvide.
          </p>
        </div>

        <div className="cartelera lg:!grid lg:grid-cols-4 lg:!overflow-visible">
          {VISION.cartelera.map((p, i) => (
            <article key={p.titulo} className="poster lg:!flex-none" data-cursor="Reservar">
              <div className="poster__luz" aria-hidden />
              <svg className="poster__tri" viewBox="52 138 82 92" style={{ ...TRIANGULOS[i], width: "auto" }} aria-hidden>
                <path d={A_EJE} />
              </svg>
              <div className="poster__barrido" aria-hidden />
              <div className="relative z-[2] flex items-center justify-between">
                <span className="rotulo text-[10px] text-white/60">{p.genero}</span>
                <span className="rotulo text-[10px] text-naranja">0{i + 1}</span>
              </div>
              <div className="relative z-[2]">
                <h3 className="titulo text-[34px] leading-none">{p.titulo}</h3>
                <p className="mt-3 text-[14px] leading-snug text-white/70">{p.frase}</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/12 pt-3">
                  <span className="rotulo text-[9px] text-white/45">ATIKO · Vision Room</span>
                  <span className="rotulo text-[9px] text-white/45">Por horas</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="contenedor mt-20 grid gap-12 border-t border-white/10 pt-14 md:grid-cols-2">
          <div>
            <h3 className="titulo titulo-m mb-6">Servicios adicionales</h3>
            <ul className="space-y-3">
              {VISION.adicionales.map((a) => (
                <li key={a} className="flex gap-3 text-[16px] text-white/75">
                  <span className="viñeta" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-8">
            <p className="entrada text-white/70">
              {VISION.planes} Si rentas una oficina en ATIKO, tienes 20 % de descuento en cada hora.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={enlaceWhatsApp("Hola, quiero información de la Vision Room para un taller o curso.")}
                className="btn btn--naranja"
                data-magnetico
              >
                Aparta tu función <Flecha className="flecha" />
              </a>
              <a href="#contacto" className="btn btn--linea">
                Conocer la sala
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
