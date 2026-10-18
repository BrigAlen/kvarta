import { nb } from "../lib/typography";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>{nb("Кварта · Минск · с 2019 года")}</p>
        <p className={styles.credit}>{nb("Фото: Unsplash — Ichsan Chairul, Mon Jester, Thom Holmes")}</p>
      </div>
    </footer>
  );
}
