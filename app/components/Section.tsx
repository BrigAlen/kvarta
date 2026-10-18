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
  children: React.ReactNode;
};

// Телефон: заголовок над содержимым. Широкий экран: заголовок и aside слева, содержимое справа.
export function Section({ id, title, tone = "light", aside, banner, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${styles.band} ${tone === "dark" ? styles.dark : ""}`}
    >
      {banner && <div className={styles.banner}>{banner}</div>}
      <div className={`container ${styles.section}`}>
        <div className={styles.head}>
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
