"use client";

import { useEffect } from "react";

// Шапка темнеет вместе с тёмными секциями: пока под ней тёмная секция или подвал, ставим ей data-tone="dark".
// Следим за узкой полосой экрана сразу под шапкой.
export function HeaderTone() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;
    const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-tone="dark"]'));
    if (dark.length === 0) return;

    let observer: IntersectionObserver | null = null;
    const under = new Set<Element>();

    const start = () => {
      observer?.disconnect();
      under.clear();
      // Линия наблюдения: середина шапки. Нижний отступ срезает весь экран ниже неё.
      const line = Math.round(header.getBoundingClientRect().height / 2);
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) under.add(entry.target);
            else under.delete(entry.target);
          }
          header.dataset.tone = under.size > 0 ? "dark" : "light";
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`, threshold: 0 },
      );
      for (const section of dark) observer.observe(section);
    };

    start();
    window.addEventListener("resize", start);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", start);
    };
  }, []);

  return null;
}
