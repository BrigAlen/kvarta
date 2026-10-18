import styles from "./ButtonLink.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
};

export function ButtonLink({ href, children }: Props) {
  return (
    <a className={styles.button} href={href}>
      <span>{children}</span>
      <svg className={styles.arrow} width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
        <path d="M0 7h20M14 1l6 6-6 6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </a>
  );
}
