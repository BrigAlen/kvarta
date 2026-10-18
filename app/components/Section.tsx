import styles from "./Section.module.css";

type Props = {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
};

// Телефон: заголовок над содержимым. Широкий экран: заголовок слева, содержимое справа.
export function Section({ id, title, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`container ${styles.section}`}>
      <h2 id={`${id}-title`} className={styles.title}>
        {title}
      </h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
