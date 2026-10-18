import styles from "./Section.module.css";

type Props = {
  id: string;
  title: React.ReactNode;
  /** Светлая секция по умолчанию; тёмная подменяет переменные цвета (см. Section.module.css). */
  tone?: "light" | "dark";
  /** Левая колонка под заголовком: крупные цифры или фото. На телефоне стоит под заголовком. */
  aside?: React.ReactNode;
  /** Полоса на всю ширину над содержимым (фото). */
  banner?: React.ReactNode;
  /** Плавный переход от светлой секции сверху / к светлой секции снизу (градиент как переход, не как фон). */
  fadeTop?: boolean;
  fadeBottom?: boolean;
  children: React.ReactNode;
};

// Телефон: заголовок над содержимым. Широкий экран: заголовок и aside слева, содержимое справа.
export function Section({ id, title, tone = "light", aside, banner, fadeTop, fadeBottom, children }: Props) {
  const classes = [
    styles.band,
    tone === "dark" ? styles.dark : "",
    fadeTop ? styles.fadeTop : "",
    fadeBottom ? styles.fadeBottom : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={classes}>
      {banner && <div className={styles.banner}>{banner}</div>}
      <div className={`container ${styles.section}`}>
        <div className={styles.head} data-reveal="">
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
