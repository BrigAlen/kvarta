// Готовит фото для сайта: кропит исходники из photos-src/ и сжимает в WebP в public/photos/.
// Запуск: node scripts/photos.mjs
// sharp не добавлен в package.json: он ставится вместе с Next как его зависимость.
// Источник всех фото — Unsplash, подробности и авторы в docs/design.md.
import { mkdir } from "node:fs/promises";
import { statSync } from "node:fs";
import sharp from "sharp";

const jobs = [
  // широкая полоса в подписке: кадр целиком, CSS подрежет по высоте
  { src: "ichsan-chairul-iwcZmTKFo0w-unsplash.jpg", out: "roaster-tray", crop: null, widths: [800, 1600] },
  // первый экран: ростер и руки, вертикальный кроп 4:5 без оранжевого знака и деревянной ручки вверху
  { src: "mon-jester-3eAJ8NItqgg-unsplash.jpg", out: "hero-roaster", crop: { left: 0, top: 880, width: 3667, height: 4584 }, widths: [480, 800] },
  // форма: вертикальный кроп 4:5 вокруг холдера
  { src: "thom-holmes-HAOeV9vlAqo-unsplash.jpg", out: "portafilter", crop: { left: 1546, top: 276, width: 2208, height: 2760 }, widths: [480, 800] },
];

await mkdir(new URL("../public/photos/", import.meta.url), { recursive: true });
for (const job of jobs) {
  const input = new URL(`../photos-src/${job.src}`, import.meta.url);
  for (const width of job.widths) {
    let image = sharp(input.pathname.replace(/^\/([A-Za-z]:)/, "$1")).rotate();
    if (job.crop) image = image.extract(job.crop);
    const file = new URL(`../public/photos/${job.out}-${width}.webp`, import.meta.url);
    const path = file.pathname.replace(/^\/([A-Za-z]:)/, "$1");
    const info = await image.resize({ width }).webp({ quality: 72, effort: 5 }).toFile(path);
    console.log(`${job.out}-${width}.webp  ${info.width}x${info.height}  ${(statSync(path).size / 1024).toFixed(0)} КБ`);
  }
}
