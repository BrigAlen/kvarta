// Рисует public/og.jpg (1200x630) из scripts/og/og.html в headless Chrome. Запуск: node scripts/og/render-og.mjs
// Нужны Chrome (путь в CHROME_PATH, по умолчанию стандартный путь Windows) и интернет для шрифтов Google.
// sharp ставится вместе с Next, отдельной зависимости нет.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const html = fileURLToPath(new URL("./og.html", import.meta.url));
const out = fileURLToPath(new URL("../../public/og.jpg", import.meta.url));
const dir = mkdtempSync(join(tmpdir(), "kvarta-og-"));
const raw = join(dir, "og.png");

try {
  execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    "--window-size=1200,630", "--virtual-time-budget=10000", `--screenshot=${raw}`, `file:///${html.replaceAll("\\", "/")}`,
  ], { stdio: "ignore" });
  const info = await sharp(raw).jpeg({ quality: 86, progressive: true, mozjpeg: true }).toFile(out);
  console.log(`public/og.jpg: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} КБ`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
