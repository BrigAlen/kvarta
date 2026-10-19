import type { Metadata } from "next";
import { Bitter, PT_Mono } from "next/font/google";
import { AttributionCapture } from "./components/AttributionCapture";
import { RevealOnScroll } from "./components/RevealOnScroll";
import "./globals.css";

// Bitter — вариативный, весь диапазон веса; PT Mono — только данные (дни, цены, штамп).
const bitter = Bitter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-bitter",
  display: "swap",
});

const ptMono = PT_Mono({
  subsets: ["cyrillic", "latin"],
  weight: "400",
  variable: "--font-pt-mono",
  display: "swap",
});

// Адрес сайта нужен для абсолютных ссылок в превью (og:image должен быть абсолютным). Можно переопределить через SITE_URL.
const SITE_URL = process.env.SITE_URL ?? "https://kvarta.onrender.com";

const TITLE = "Кварта — обжарка кофе в Минске";
const DESCRIPTION = "Обжарили в четверг — в пятницу у вас. Свежеобжаренный кофе: зерно приходит на 1–3 день после обжарки.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Превью ссылки в Telegram, мессенджерах и соцсетях: картинка 1200x630 (public/og.jpg, генератор scripts/og).
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Кварта",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Кварта: обжарили в четверг — в пятницу у вас" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${bitter.variable} ${ptMono.variable}`}>
      <body>
        {children}
        <AttributionCapture />
        <RevealOnScroll />
      </body>
    </html>
  );
}
