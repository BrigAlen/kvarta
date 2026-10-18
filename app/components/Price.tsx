import { nb } from "../lib/typography";
import styles from "./Price.module.css";

type Props = {
  amount: string;
  per?: string;
};

// Цена одним шрифтом. «в месяц» мельче и приглушённее, на одной линии с суммой.
// Размер задаёт родитель через переменную --price-size.
export function Price({ amount, per }: Props) {
  return (
    <span className={styles.price}>
      <span className={styles.sum}>{nb(`${amount} BYN`)}</span>
      {per && <span className={styles.per}>{nb(per)}</span>}
    </span>
  );
}
