import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import { MARCA } from "@/lib/contenido";
import "./globals.css";

// Títulos: TeX Gyre Adventor, la versión libre de ITC Avant Garde Gothic que pide el manual.
const adventor = localFont({
  src: [
    { path: "../fuentes/texgyreadventor-regular.otf", weight: "400", style: "normal" },
    { path: "../fuentes/texgyreadventor-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-adventor",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const sitio = process.env.NEXT_PUBLIC_SITIO_URL
  ? process.env.NEXT_PUBLIC_SITIO_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://atikocowork.com";

// Mientras no haya dominio definitivo (NEXT_PUBLIC_SITIO_URL), la dirección de Vercel no se indexa:
// el posicionamiento debe empezar en el dominio propio, y aún hay datos por confirmar (README).
const indexable = !!process.env.NEXT_PUBLIC_SITIO_URL;

export const metadata: Metadata = {
  metadataBase: new URL(sitio),
  robots: indexable ? undefined : { index: false, follow: false },
  title: "ATIKO COWORK · Oficinas privadas, cowork y salas en San Luis Potosí",
  description:
    "Oficinas ejecutivas privadas, cowork, Focus Rooms, sala de juntas y la Vision Room, una sala de proyección para talleres y cursos. Recepción y servicios incluidos en Lomas, San Luis Potosí.",
  openGraph: {
    title: "ATIKO COWORK · Un lugar para crecer, crear y conectar",
    description:
      "Oficinas privadas, cowork y salas en San Luis Potosí. Llegas con tu equipo y empiezas a trabajar el mismo día.",
    locale: "es_MX",
    type: "website",
    siteName: "ATIKO COWORK",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const datosEstructurados = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: MARCA.nombre,
  description: "Oficinas ejecutivas privadas, cowork, salas de juntas y sala de proyección en San Luis Potosí.",
  telephone: "+52 444 674 1298",
  email: MARCA.correo,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Montes Kelut 175, Lomas 2a. Sección",
    postalCode: "78210",
    addressLocality: "San Luis Potosí",
    addressRegion: "S.L.P.",
    addressCountry: "MX",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "15:00" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${adventor.variable} ${montserrat.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
        />
      </body>
    </html>
  );
}
