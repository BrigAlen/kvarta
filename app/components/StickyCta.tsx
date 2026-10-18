"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import styles from "./StickyCta.module.css";

// Плашка «Оставить заявку» внизу экрана на телефоне. Появляется, когда кнопка первого экрана уже
// ушла вверх, и прячется, когда на экране форма или подвал: поверх формы её быть не должно.
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroButton = document.getElementById("hero-cta");
    const form = document.getElementById("lead");
    const footer = document.querySelector("footer");
    if (!heroButton || !form) return;

    let heroGone = false;
    const blockers = new Set<Element>(); // форма и подвал, которые сейчас на экране
    const update = () => setVisible(heroGone && blockers.size === 0);

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroGone = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const blockObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) blockers.add(entry.target);
        else blockers.delete(entry.target);
      }
      update();
    });

    heroObserver.observe(heroButton);
    blockObserver.observe(form);
    if (footer) blockObserver.observe(footer);
    return () => {
      heroObserver.disconnect();
      blockObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.bar} data-visible={visible} inert={!visible}>
      <ButtonLink href="#lead">Оставить заявку</ButtonLink>
    </div>
  );
}
