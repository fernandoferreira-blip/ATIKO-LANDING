// Convierte las fotos de fotos-origen/ (sacadas de los folletos de ATIKO) a WebP en public/img/.
// Las que vienen chicas se amplían con lanczos y un enfoque ligero para que aguanten pantalla completa.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ORIGEN = "fotos-origen";
const DESTINO = "public/img";
const ANCHO_MAX = 2200;
const LADO_MIN = 1800;

fs.mkdirSync(DESTINO, { recursive: true });

for (const archivo of fs.readdirSync(ORIGEN)) {
  if (!/\.(jpe?g|png|webp)$/i.test(archivo)) continue;
  const nombre = path.parse(archivo).name;
  const img = sharp(path.join(ORIGEN, archivo)).rotate().removeAlpha();
  const { width, height } = await img.metadata();
  const ampliar = Math.max(width, height) < LADO_MIN;
  const factor = ampliar ? LADO_MIN / Math.max(width, height) : Math.min(1, ANCHO_MAX / width);
  const w = Math.round(width * factor);

  let canal = img.resize({ width: w, kernel: "lanczos3" });
  if (ampliar) canal = canal.sharpen({ sigma: 0.8, m1: 0.6, m2: 1.2 });
  const salida = path.join(DESTINO, `${nombre}.webp`);
  const info = await canal.webp({ quality: 80, effort: 5 }).toFile(salida);
  // Versión ligera para celular.
  const movil = await sharp(path.join(ORIGEN, archivo)).rotate().removeAlpha().resize({ width: 1000, kernel: "lanczos3" }).webp({ quality: 78 }).toFile(path.join(DESTINO, `${nombre}-m.webp`));
  console.log(`${nombre}: ${width}x${height} -> ${info.width}x${info.height}${ampliar ? " (ampliada)" : ""}, ${Math.round(info.size / 1024)} KB · móvil ${Math.round(movil.size / 1024)} KB`);
}
