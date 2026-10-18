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

export const metadata: Metadata = {
  title: "Кварта — обжарка кофе в Минске",
  description: "Свежеобжаренный кофе: зерно приходит к вам на 1–3 день после обжарки.",
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
