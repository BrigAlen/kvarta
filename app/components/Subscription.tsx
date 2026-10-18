import { nb } from "../lib/typography";
import { ButtonLink } from "./ButtonLink";
import { Price } from "./Price";
import { Section } from "./Section";
import styles from "./Subscription.module.css";

export function Subscription() {
  return (
    <Section id="subscription" title={nb("Чтобы кофе был всегда")}>
      <p>
        {nb(
          "Удобно, если вы пьёте кофе каждый день: не нужно следить, когда закончится пачка. Раз в месяц мы привозим две пачки по 250 г. Сорта выбираете вы, и в следующем месяце можно взять другие. Доставка бесплатная.",
        )}
      </p>
      <p className={styles.price}>
        <Price amount="54" per="в месяц" />
      </p>
      <p>{nb("Хотите попробовать? Оставьте заявку, мы позвоним и всё оформим.")}</p>
      <div className={styles.cta}>
        <ButtonLink href="#lead">Оставить заявку</ButtonLink>
      </div>
    </Section>
  );
}
