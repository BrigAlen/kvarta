import { nb } from "../lib/typography";
import { ButtonLink } from "./ButtonLink";
import { Figure } from "./Figure";
import { Photo } from "./Photo";
import { Price } from "./Price";
import { Section } from "./Section";
import styles from "./Subscription.module.css";

export function Subscription() {
  return (
    <Section
      id="subscription"
      eyebrow="Раз в месяц"
      tone="dark"
      fadeTop
      fadeBottom
      title={nb("Чтобы кофе был всегда")}
      aside={<Figure value={"2 × 250 г"} caption="раз в месяц" />}
      banner={
        <Photo
          className={styles.banner}
          name="roaster-tray"
          widths={[800, 1600]}
          width={1600}
          height={1066}
          sizes="100vw"
          alt="Свежеобжаренные зёрна на охлаждающем лотке ростера"
        />
      }
    >
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
        <ButtonLink href="#lead" variant="secondary">Оставить заявку</ButtonLink>
      </div>
    </Section>
  );
}
