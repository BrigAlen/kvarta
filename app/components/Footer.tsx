import { nb } from "../lib/typography";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <p>{nb("Кварта · Минск · с 2019 года")}</p>
    </footer>
  );
}
