import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.bar} data-site-header>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.logo} href="/">
          Кварта
        </Link>
        <Link className={styles.link} href="/#lead">
          Заявка
        </Link>
      </div>
    </header>
  );
}
