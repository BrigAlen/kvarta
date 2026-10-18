import { nb } from "../lib/typography";
import styles from "./PackIllustration.module.css";

type Props = { className?: string };

// Плоская пачка с этикеткой. Текст этикетки целиком из брифа (docs/design.md, раздел 7).
export function PackIllustration({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="30 30 180 250"
      role="img"
      aria-label="Пачка кофе с этикеткой «обжарено: чт»"
    >
      {/* корпус */}
      <rect x="30" y="30" width="180" height="250" rx="6" className={styles.body} />
      {/* верхний шов */}
      <path d="M44 42h152M44 52h152" className={styles.crimp} />
      {/* боковые складки */}
      <path d="M52 64v216M188 64v216" className={styles.fold} />
      {/* этикетка */}
      <rect x="62" y="96" width="116" height="150" className={styles.label} />
      <text x="120" y="132" textAnchor="middle" className={styles.brand}>
        Кварта
      </text>
      <text x="120" y="158" textAnchor="middle" className={styles.sort}>
        Бразилия
      </text>
      <text x="120" y="176" textAnchor="middle" className={styles.sort}>
        Серрадо
      </text>
      <text x="120" y="198" textAnchor="middle" className={styles.weight}>
        {nb("250 г")}
      </text>
      {/* штамп */}
      <g transform="rotate(-5 120 222)">
        <rect x="68" y="210" width="104" height="24" className={styles.stamp} />
        <text x="120" y="226" textAnchor="middle" className={styles.stampText}>
          обжарено: чт
        </text>
      </g>
    </svg>
  );
}
