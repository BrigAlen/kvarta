import styles from "./Week.module.css";

// Статичная лента без дат. Живая дата ближайшей обжарки — шаг 6 (см. docs/design.md, раздел 4).
const days = [
  { short: "пн", full: "понедельник" },
  { short: "вт", full: "вторник" },
  { short: "ср", full: "среда" },
  { short: "чт", full: "четверг", note: "жарим" },
  { short: "пт", full: "пятница", note: "везём" },
  { short: "сб", full: "суббота" },
  { short: "вс", full: "воскресенье" },
];

export function Week() {
  return (
    <ol className={styles.week}>
      {days.map((day) => (
        <li key={day.short} className={day.note ? styles.hot : styles.day}>
          <span className="sr-only">{day.full}</span>
          <span className={styles.short} aria-hidden="true">
            {day.short}
          </span>
          <span className={styles.note}>{day.note}</span>
        </li>
      ))}
    </ol>
  );
}
