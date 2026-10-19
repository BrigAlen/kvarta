import { nb } from "../lib/typography";
import styles from "./Section.module.css";

type Props = {
  id: string;
  title: React.ReactNode;
  /** Светлая секция по умолчанию; тёмная подменяет переменные цвета (см. Section.module.css). */
  tone?: "light" | "dark";
  /** Левая колонка под заголовком: крупные цифры или фото. На телефоне стоит под заголовком. */
  aside?: React.ReactNode;
  /** Мелкий надзаголовок капсом над заголовком. */
  eyebrow?: string;
  /** Полоса на всю ширину над содержимым (фото). */
  banner?: React.ReactNode;
  /** Плавный переход от светлой секции сверху / к светлой секции снизу (градиент как переход, не как фон). */
  fadeTop?: boolean;
  fadeBottom?: boolean;
  /** Тёмная секция без фото сверху: скруглённый верхний край, заезжает на светлую секцию выше. */
  roundTop?: boolean;
  children: React.ReactNode;
};

// Телефон: заголовок над содержимым. Широкий экран: заголовок и aside слева, содержимое справа.
export function Section({ id, title, tone = "light", eyebrow, aside, banner, fadeTop, fadeBottom, roundTop, children }: Props) {
  const classes = [
    styles.band,
    tone === "dark" ? styles.dark : "",
    fadeTop ? styles.fadeTop : "",
    fadeBottom ? styles.fadeBottom : "",
    roundTop ? styles.roundTop : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={classes} data-tone={tone}>
      {banner && <div className={styles.banner}>{banner}</div>}
      <div className={`container ${styles.section}`}>
        <div className={styles.head} data-reveal="">
          {eyebrow && <p className="eyebrow">{nb(eyebrow)}</p>}
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
        <div className={styles.body} data-reveal="">
          {children}
        </div>
      </div>
    </section>
  );
}
