import type { MetadataRoute } from "next";

// Sin dominio definitivo (NEXT_PUBLIC_SITIO_URL) no se deja rastrear nada; ver app/layout.tsx.
export default function robots(): MetadataRoute.Robots {
  if (!process.env.NEXT_PUBLIC_SITIO_URL) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }] };
}
