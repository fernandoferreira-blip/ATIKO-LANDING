// Todo el texto de la landing vive aquí. Para cambiar copy, datos de contacto o espacios
// no hace falta tocar los componentes.
// Fuentes: Manual de identidad de marca v1.0 (oct 2026), folletos ATIKO 2025 / Marzo 2026 / Rooms 2025
// e Información de oficinas privadas 2025.

export const MARCA = {
  nombre: "ATIKO COWORK",
  eslogan: "Un lugar para crecer, crear y conectar.",
  descriptor: "Executive offices",
  telefono: "444 674 1298",
  telefonoLink: "tel:+524446741298",
  whatsapp: "524446741298",
  correo: "ventas@atikocowork.com",
  direccion: "Montes Kelut 175, Lomas 2a. Sección",
  ciudad: "C.P. 78210, San Luis Potosí, S.L.P.",
  mapa: "https://www.google.com/maps/search/?api=1&query=Montes+Kelut+175,+Lomas+2a+Secci%C3%B3n,+78210+San+Luis+Potos%C3%AD",
  mapaEmbed: "https://maps.google.com/maps?q=Montes%20Kelut%20175%2C%20Lomas%202a%20Secci%C3%B3n%2C%2078210%20San%20Luis%20Potos%C3%AD&z=16&output=embed",
  horario: [
    { dias: "Lunes a viernes", horas: "8:00 a 19:00 h" },
    { dias: "Sábado", horas: "9:00 a 15:00 h" },
  ],
};

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export const NAV = [
  { href: "#espacios", texto: "Espacios" },
  { href: "#oficinas", texto: "Oficinas" },
  { href: "#vision-room", texto: "Vision Room" },
  { href: "#membresias", texto: "Membresías" },
  { href: "#contacto", texto: "Contacto" },
];

export const HERO = {
  rotulo: "Oficinas privadas · Cowork · Salas",
  ciudad: "San Luis Potosí",
  texto:
    "Oficinas ejecutivas, cowork, salas de juntas y una sala de proyección en Lomas. Llegas con tu equipo y empiezas a trabajar el mismo día.",
  bienvenida: "Bienvenido al ático.",
};

export const CINTA = [
  "Oficinas privadas",
  "Cowork",
  "Focus Room",
  "Nexus Room",
  "Vision Room",
  "Confort Room",
  "ATIKO Academy",
  "ATIKO Rewards",
];

export const MANIFIESTO = {
  rotulo: "La marca",
  texto:
    "ATIKO viene de ático, el piso más alto de un edificio. Un espacio por encima de lo cotidiano, ordenado y bien atendido, donde un negocio se instala para trabajar en serio.",
  valores: ["Profesionalismo", "Colaboración", "Innovación", "Customer Centricity"],
  cifras: [
    { valor: 8, sufijo: "", texto: "oficinas privadas" },
    { valor: 28, sufijo: "", texto: "lugares en la Vision Room" },
    { valor: 100, sufijo: "″", texto: "de pantalla 4K para tus talleres" },
    { valor: 82, sufijo: " m²", texto: "en nuestra oficina más grande" },
  ],
};

export type Espacio = {
  id: string;
  nombre: string;
  texto: string;
  datos: string[];
  foto: string;
  alt: string;
};

export const ESPACIOS: Espacio[] = [
  {
    id: "recepcion",
    nombre: "Recepción",
    texto: "Tus clientes llegan a un lugar que habla bien de ti. Recibimos a tus visitas y tu paquetería.",
    datos: ["Visitas", "Paquetería"],
    foto: "/img/recepcion.webp",
    alt: "Recepción de ATIKO con muros oscuros, luz cálida y letrero de neón",
  },
  {
    id: "cowork",
    nombre: "Cowork Space",
    texto: "Escritorios en un área compartida con luz cálida, buena conexión y gente que también viene a avanzar.",
    datos: ["Escritorios compartidos", "Internet de alta velocidad"],
    foto: "/img/cowork.webp",
    alt: "Área cowork de ATIKO con escritorios de madera, jardineras y lámparas de neón ondulado",
  },
  {
    id: "oficinas",
    nombre: "Oficinas privadas",
    texto: "Desde 6 m² para una persona hasta 82 m² para un equipo de 20. Con llave y a tu nombre.",
    datos: ["6 a 82 m²", "1 a 20 personas"],
    foto: "/img/oficina-equipo.webp",
    alt: "Oficina privada de ATIKO con escritorio de madera, silla ejecutiva y dos sillas de visita",
  },
  {
    id: "focus",
    nombre: "Focus Room Exclusive",
    texto: "Un espacio exclusivo y en silencio para concentrarte sin dejar de ser parte de la comunidad.",
    datos: ["Uso exclusivo", "Cancel de cristal"],
    foto: "/img/focus-room.webp",
    alt: "Focus Room de ATIKO con cancel de cristal negro, escritorio y panel iluminado",
  },
  {
    id: "nexus",
    nombre: "Nexus Room",
    texto: "Tus juntas nunca habían sido tan profesionales. Pantalla 4K de 85″, luz ambientada y mobiliario ejecutivo.",
    datos: ["10 personas", "Pantalla 4K de 85″"],
    foto: "/img/nexus-room.webp",
    alt: "Sala de juntas Nexus Room con mesa de granito, sillas ejecutivas de piel y pantalla",
  },
  {
    id: "confort",
    nombre: "Confort Room",
    texto: "El área para miembros: sala, futbolito, Coffee Station y snacks para despejarte entre pendientes.",
    datos: ["Coffee Station", "Snacks ilimitados"],
    foto: "/img/confort-atiko.webp",
    alt: "Confort Room de ATIKO con sillones, futbolito, mesas altas y letrero ATIKO",
  },
];

export const OFICINAS = {
  rotulo: "Oficinas privadas",
  titulo: ["Tu oficina,", "lista", "para trabajar."],
  texto:
    "Recepción, internet, limpieza y sala de juntas incluidos en la renta. Llegas con tu equipo y empiezas a trabajar el mismo día.",
  formatos: [
    {
      nombre: "Individual",
      medida: "6 a 19 m²",
      personas: "1 a 3 personas",
      texto: "Para el profesional independiente que necesita privacidad y una dirección seria donde recibir.",
      foto: "/img/oficina-individual.webp",
      alt: "Oficina individual con escritorio negro, silla ejecutiva y dos sillas de visita",
    },
    {
      nombre: "Equipo",
      medida: "28 a 39 m²",
      personas: "4 a 12 personas",
      texto: "Para el equipo que ya creció y quiere su propio espacio sin meterse en una obra.",
      foto: "/img/oficina-equipo.webp",
      alt: "Oficina para equipo con escritorio de madera y lámpara lineal",
    },
    {
      nombre: "Corporativa",
      medida: "82 m²",
      personas: "18 a 20 personas",
      texto: "Un piso de trabajo para tu operación completa, con todos los servicios de ATIKO alrededor.",
      foto: "/img/oficina-ejecutiva.webp",
      alt: "Oficina ejecutiva amplia con ventanal, escritorio y sala",
    },
  ],
  incluye: [
    "Horas de Nexus Room cada mes",
    "Recepción de tus clientes e invitados",
    "Internet, luz y agua",
    "Acceso al Área Confort y Coffee Station",
    "Tarjeta de miembro ATIKO Rewards",
    "Kit de bienvenida: taza, agenda y pluma",
    "20 % de descuento en la Vision Room",
    "Precio especial en copias e impresiones",
    "Precio especial en bebidas y snacks selectos",
    "Acceso preferencial a talleres y cursos",
  ],
  mobiliario: "Mobiliario ATIKO opcional, con precio preferencial.",
};

export const INCLUYE = {
  rotulo: "Lo que incluye",
  titulo: ["Todo incluido.", "Tú sólo llegas", "a trabajar."],
  tarjetas: [
    {
      id: "internet",
      titulo: "Internet de alta velocidad",
      texto: "Para videollamadas, la nube y todo lo que tu negocio mueve en línea, sin pelearte con la señal.",
    },
    {
      id: "cafe",
      titulo: "Coffee Station y snacks ilimitados",
      texto: "Café cuando lo necesitas, que suele ser seguido.",
    },
    {
      id: "recepcion",
      titulo: "Recepción de visitas",
      texto: "Alguien recibe a tus clientes por su nombre y te avisa que llegaron.",
    },
    {
      id: "juntas",
      titulo: "Sala de juntas equipada",
      texto: "Pantalla, mobiliario ejecutivo y una mesa a la altura de tus propuestas.",
    },
    {
      id: "confort",
      titulo: "Área Confort",
      texto: "Sillones, futbolito y un respiro sin salir del edificio.",
    },
    {
      id: "eventos",
      titulo: "Talleres y eventos",
      texto: "Talleres, charlas y encuentros mensuales para impulsar colaboraciones entre miembros.",
    },
    {
      id: "rewards",
      titulo: "ATIKO Rewards",
      texto: "Tu tarjeta de miembro y beneficios exclusivos por ser parte de la comunidad.",
    },
  ],
  extras: ["Casilleros", "Copias e impresiones", "Paquetería", "Luz y agua", "Limpieza"],
};

export const VISION = {
  frases: ["Silencia tu celular.", "Hay una sala en ATIKO", "que se descubre a oscuras."],
  pistaCursor: "Mueve la luz",
  pistaTactil: "Mira con atención",
  rotulo: "Sala de proyección didáctica",
  titulo: "Vision Room",
  subtitulo: "El espacio para expandir tus ideas.",
  ficha: [
    { rol: "Capacidad", valor: "28 personas" },
    { rol: "Asientos", valor: "Didácticos" },
    { rol: "Pantalla", valor: "Smart TV 4K de 100″" },
    { rol: "Iluminación", valor: "LED controlada" },
    { rol: "Audio", valor: "Equipo profesional" },
    { rol: "Clima", valor: "Aire acondicionado" },
    { rol: "Funciones", valor: "Por hora, desde 2 horas" },
  ],
  cartelera: [
    { titulo: "Talleres", genero: "Práctico", frase: "Esta vez el protagonista es lo que aprendes." },
    { titulo: "Cursos", genero: "Temporada completa", frase: "Varias sesiones, un mismo lugar, cero distracciones." },
    { titulo: "Capacitaciones", genero: "Para tu equipo", frase: "Tu equipo sale distinto de como entró." },
    { titulo: "Lanzamientos", genero: "Estreno", frase: "El estreno que tu marca estaba esperando." },
    { titulo: "Conferencias", genero: "Con clientes", frase: "Una voz, 28 lugares y toda la atención." },
    { titulo: "Networking", genero: "Comunidad", frase: "Llegas con tarjetas, te vas con socios." },
    { titulo: "Coaching grupal", genero: "Integración", frase: "La historia de cómo tu equipo hizo clic." },
    { titulo: "Presentaciones", genero: "Estrategia", frase: "Tu idea, en una pantalla de 100 pulgadas." },
  ],
  adicionales: [
    "Grabación profesional del evento",
    "Coffee break personalizado o premium",
    "Ambientación y decoración",
    "Kit de bienvenida ATIKO",
    "Horas adicionales con descuento",
  ],
  planes: "Planes mensuales Silver, Gold, Platinum y Elite: entre más horas reservas, menos pagas por hora.",
};

export const MEMBRESIAS = {
  rotulo: "Membresías cowork",
  titulo: ["Tu lugar", "en la comunidad."],
  texto: "El espacio ideal si eres emprendedor, empresario o estudiante. Eliges cómo trabajar y nosotros nos encargamos del resto.",
  planes: [
    {
      nombre: "Cowork Access",
      resumen: "Lo esencial para trabajar a tu ritmo en el área cowork.",
      puntos: ["Espacio cowork y Área Confort", "Horas de sala de juntas al mes", "Coffee Station y snacks", "Impresiones incluidas"],
    },
    {
      nombre: "Cowork Advanced",
      resumen: "Más horas de sala, más impresiones y Coffee Station avanzado.",
      puntos: ["Todo lo de Access", "Más horas de sala de juntas", "Coffee Station avanzado", "Más impresiones al mes"],
    },
    {
      nombre: "Focus Room Exclusive",
      resumen: "Un espacio de trabajo exclusivo, sólo tuyo, dentro de la comunidad.",
      puntos: ["Focus Room de uso exclusivo", "El mayor número de horas de sala", "Casillero y publicidad interna", "Talleres y eventos especiales"],
    },
  ],
  todas: [
    "Acceso a espacios cowork",
    "Acceso al Área Confort",
    "Acceso a sala de juntas",
    "Acceso preferencial a talleres y eventos",
    "Tarjeta de miembro ATIKO Rewards",
    "Internet de alta velocidad",
    "Coffee Station y snacks ilimitados",
  ],
};

export const DIA = {
  rotulo: "Imagina tu día en ATIKO",
  titulo: ["Un día normal", "se ve", "así."],
  momentos: [
    { hora: 8, texto: "Abrimos. Saludas en recepción y tu lugar ya está listo.", espacio: "Recepción" },
    { hora: 9.5, texto: "Café de la Coffee Station y a lo importante, sin ruido de casa.", espacio: "Cowork Space" },
    { hora: 11, texto: "Llega tu cliente. Lo recibimos por su nombre y lo pasamos a la Nexus Room.", espacio: "Nexus Room" },
    { hora: 14, texto: "Una pausa en el Área Confort. Una reta de futbolito despeja más que el celular.", espacio: "Confort Room" },
    { hora: 17, texto: "Taller en la Vision Room con otros emprendedores. Sales con ideas y con contactos.", espacio: "Vision Room" },
    { hora: 19, texto: "Cierras la puerta de tu oficina. Mañana todo sigue en su lugar.", espacio: "Oficina privada" },
  ],
};

export const INVITACION = {
  titulo: ["Deja de trabajar", "en la mesa", "del comedor."],
  texto:
    "Tu proyecto merece un lugar donde la gente llega, te encuentra y te toma en serio. Sube al ático.",
};

export const EMPEZAR = {
  rotulo: "Cómo empezar",
  titulo: ["Empezar es", "sencillo."],
  pasos: [
    { titulo: "Agenda tu visita", texto: "Conoce los espacios en persona, resuelve tus dudas y elige el tuyo." },
    { titulo: "Reúne tus documentos", texto: "Una lista corta, según seas persona física o moral." },
    { titulo: "Firma y entra", texto: "Firmas el acuerdo comercial, cubres los pagos iniciales y empiezas a trabajar." },
  ],
  requisitos: {
    fisica: [
      "Identificación oficial vigente",
      "Comprobante de domicilio fiscal no mayor a 3 meses",
      "Constancia de Situación Fiscal del SAT del mes en curso",
      "Firma del acuerdo comercial",
      "Pagos iniciales correspondientes",
      "Depósito en garantía (Focus Room y oficinas privadas)",
    ],
    moral: [
      "Acta constitutiva",
      "Poder del representante legal",
      "Identificación oficial vigente del representante legal",
      "Identificación oficial de los usuarios del servicio",
      "Constancia de Situación Fiscal del SAT del mes en curso",
      "Comprobante de domicilio fiscal de la empresa no mayor a 3 meses",
      "Firma del acuerdo comercial",
      "Pagos iniciales correspondientes",
      "Depósito en garantía (Focus Room y oficinas privadas)",
    ],
  },
};

export const CONTACTO = {
  rotulo: "Contacto",
  titulo: ["Agenda tu visita", "y transforma tu forma", "de trabajar."],
  intereses: ["Oficina privada", "Membresía cowork", "Focus Room", "Vision Room", "Nexus Room", "Sólo quiero conocer"],
};
