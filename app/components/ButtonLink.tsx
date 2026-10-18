import styles from "./ButtonLink.module.css";

function Arrow() {
  return (
    <svg className={styles.arrow} width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <path d="M0 7h20M14 1l6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

type Variant = "primary" | "secondary";

const variantClass: Record<Variant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
};

type LinkProps = {
  href: string;
  /** primary: залита акцентом (главное действие); secondary: контур. */
  variant?: Variant;
  children: React.ReactNode;
};

export function ButtonLink({ href, variant = "primary", children }: LinkProps) {
  return (
    <a className={`${styles.button} ${variantClass[variant]}`} href={href}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

type SubmitProps = {
  /** Идёт отправка: кнопка недоступна, повторное нажатие ничего не делает. */
  busy?: boolean;
  children: React.ReactNode;
};

export function SubmitButton({ busy = false, children }: SubmitProps) {
  return (
    <button
      className={`${styles.button} ${styles.primary}`}
      type="submit"
      disabled={busy}
      aria-disabled={busy}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  );
}
