import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Кварта — обжарка кофе в Минске",
  description: "Свежеобжаренный кофе: зерно приходит к вам на 1–3 день после обжарки.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
