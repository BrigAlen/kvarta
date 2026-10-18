import { nb } from "../lib/typography";
import styles from "./Figure.module.css";

type Props = {
  /** Крупная цифра из брифа, дословно. */
  value: string;
  caption: string;
};

export function Figure({ value, caption }: Props) {
  return (
    <p className={styles.figure}>
      <span className={styles.value}>{nb(value)}</span>
      <span className={styles.caption}>{nb(caption)}</span>
    </p>
  );
}

// Несколько цифр подряд: на телефоне в строку, на широком экране столбиком.
export function Figures({ children }: { children: React.ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}
