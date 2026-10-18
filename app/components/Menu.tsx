import { nb } from "../lib/typography";
import { Price } from "./Price";
import { Section } from "./Section";
import styles from "./Menu.module.css";

const items = [
  { name: "Эфиопия Иргачеффе", desc: "цветочный, бергамот, светлая обжарка · 250 г", amount: "32" },
  { name: "Колумбия Уила", desc: "карамель, красное яблоко · 250 г", amount: "29" },
  { name: "Бразилия Серрадо", desc: "орех, шоколад, под эспрессо · 250 г", amount: "26" },
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
      <ul className={styles.list}>
        {items.map((item) => (
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
