import { nb } from "../lib/typography";
import { Price } from "./Price";
import { Section } from "./Section";
import styles from "./Menu.module.css";

// Цвет карточки по вкусу из брифа: Эфиопия (цветочный, бергамот), Колумбия (красное яблоко),
// Бразилия (орех, шоколад) — приглушённый зелёный, чтобы не уходить в коричневую «кофейную» палитру.
const sorts = [
  { name: "Эфиопия Иргачеффе", desc: "цветочный, бергамот, светлая обжарка · 250 г", amount: "32", color: "#d9c453" },
  { name: "Колумбия Уила", desc: "карамель, красное яблоко · 250 г", amount: "29", color: "#b5473e" },
  { name: "Бразилия Серрадо", desc: "орех, шоколад, под эспрессо · 250 г", amount: "26", color: "#46705c" },
];

const rows = [
  { name: "Дрип-пакеты, ассорти", desc: "10 штук", amount: "18" },
  {
    name: "Подписка",
    desc: "два сорта на выбор раз в месяц, доставка бесплатно",
    amount: "54",
    per: "в месяц",
    featured: true,
  },
];

export function Menu() {
  return (
    <Section id="menu" eyebrow="Цены в BYN" title={nb("Что у нас есть")}>
      <ul className={styles.cards}>
        {sorts.map((sort) => (
          <li key={sort.name} className={styles.card} style={{ "--sort": sort.color } as React.CSSProperties}>
            <h3 className={styles.name}>{nb(sort.name)}</h3>
            <p className={styles.desc}>{nb(sort.desc)}</p>
            <div className={styles.cardPrice}>
              <Price amount={sort.amount} />
            </div>
          </li>
        ))}
      </ul>
      <ul className={styles.list}>
        {rows.map((item) => (
          <li key={item.name} className={`${styles.item} ${item.featured ? styles.featured : ""}`}>
            <div className={styles.head}>
              <h3 className={styles.name}>{nb(item.name)}</h3>
              <Price amount={item.amount} per={item.per} />
            </div>
            <p className={styles.desc}>{nb(item.desc)}</p>
            {item.featured && (
              <a className={styles.more} href="#subscription">
                {nb("Как это работает")}
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
