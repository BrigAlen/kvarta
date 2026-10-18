import { nb } from "../lib/typography";
import { Section } from "./Section";
import styles from "./Menu.module.css";

const items = [
  { name: "Эфиопия Иргачеффе", desc: "цветочный, бергамот, светлая обжарка · 250 г", price: "32 BYN" },
  { name: "Колумбия Уила", desc: "карамель, красное яблоко · 250 г", price: "29 BYN" },
  { name: "Бразилия Серрадо", desc: "орех, шоколад, под эспрессо · 250 г", price: "26 BYN" },
  { name: "Дрип-пакеты, ассорти", desc: "10 штук", price: "18 BYN" },
  {
    name: "Подписка",
    desc: "два сорта на выбор раз в месяц, доставка бесплатно",
    price: "54 BYN в месяц",
    featured: true,
  },
];

export function Menu() {
  return (
    <Section id="menu" title={nb("Что у нас есть")}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.name} className={`${styles.item} ${item.featured ? styles.featured : ""}`}>
            <div className={styles.head}>
              <h3 className={styles.name}>{nb(item.name)}</h3>
              <span className={styles.price}>{nb(item.price)}</span>
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
