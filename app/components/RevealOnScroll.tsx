"use client";

import { useEffect } from "react";

// Плавное появление блоков с атрибутом data-reveal. Срабатывает за треть экрана ДО входа блока в экран,
// чтобы при быстрой прокрутке секции не были пустыми. Прячем только то, что ещё ниже экрана,
// поэтому вспышки нет, а без JS всё остаётся видимым. Отключается при prefers-reduced-motion.
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 30% 0px", threshold: 0 },
    );

    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.dataset.reveal = "shown";
        continue;
      }
      el.dataset.reveal = "hidden";
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
