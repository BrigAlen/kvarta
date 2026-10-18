import styles from "./ButtonLink.module.css";

function Arrow() {
  return (
    <svg className={styles.arrow} width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <path d="M0 7h20M14 1l6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

export function ButtonLink({ href, children }: LinkProps) {
  return (
    <a className={styles.button} href={href}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button className={styles.button} type="submit">
      <span>{children}</span>
      <Arrow />
    </button>
  );
}
