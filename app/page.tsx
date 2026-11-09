import Cortina from "@/components/Cortina";
import Cursor from "@/components/Cursor";
import EscenaScroll from "@/components/EscenaScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Cinta from "@/components/Cinta";
import Manifiesto from "@/components/Manifiesto";
import Espacios from "@/components/Espacios";
import Oficinas from "@/components/Oficinas";
import Incluye from "@/components/Incluye";
import VisionRoom from "@/components/VisionRoom";
import Membresias from "@/components/Membresias";
import TuDia from "@/components/TuDia";
import Invitacion from "@/components/Invitacion";
import Empezar from "@/components/Empezar";
import Contacto from "@/components/Contacto";
import Pie from "@/components/Pie";
import { IconoWhatsApp } from "@/components/Marca";
import { enlaceWhatsApp } from "@/lib/contenido";

export default function Inicio() {
  return (
    <>
      <EscenaScroll />
      <Cortina />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Cinta />
        <Manifiesto />
        <Espacios />
        <Oficinas />
        <Incluye />
        <VisionRoom />
        <Membresias />
        <TuDia />
        <Invitacion />
        <Empezar />
        <Contacto />
      </main>
      <Pie />
      <a
        href={enlaceWhatsApp("Hola, quiero agendar una visita a ATIKO.")}
        className="flotante-wa oculto btn btn--naranja !h-14 !px-5 shadow-[0_12px_30px_-10px_rgba(0,0,0,.6)]"
        target="_blank"
        rel="noopener"
        aria-label="Escríbenos por WhatsApp"
      >
        <IconoWhatsApp className="h-5 w-5" /> WhatsApp
      </a>
    </>
  );
}
