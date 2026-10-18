import { nb } from "../lib/typography";
import { Figure } from "./Figure";
import { Section } from "./Section";
import styles from "./Delivery.module.css";

export function Delivery() {
  return (
    <Section
      id="delivery"
      title={nb("Привезём или заберёте сами")}
      aside={<Figure value="1–3" caption="день после обжарки: зерно у вас" />}
    >
      <div className={styles.cols}>
        <div>
          <h3 className={styles.sub}>Доставка</h3>
          <p>{nb("В пятницу мы развозим кофе по Минску. Если заказ от 50 BYN, доставка бесплатная.")}</p>
        </div>
        <div>
          <h3 className={styles.sub}>Самовывоз</h3>
          <p>{nb("Забрать можно самим: Минск, ул. Короля, 9.")}</p>
          <p className={styles.hours}>{nb("В будни с 8:00 до 20:00")}</p>
          <p>{nb("В субботу и воскресенье с 10:00 до 18:00")}</p>
        </div>
      </div>
    </Section>
  );
}
