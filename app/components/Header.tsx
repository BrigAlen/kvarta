import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={`container ${styles.header}`}>
      <Link className={styles.logo} href="/">
        Кварта
      </Link>
      <a className={styles.link} href="#lead">
        Оставить заявку
      </a>
    </header>
  );
}
