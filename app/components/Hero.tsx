import { nb } from "../lib/typography";
import { ButtonLink } from "./ButtonLink";
import { Photo } from "./Photo";
import { Week } from "./Week";
import styles from "./Hero.module.css";

const NBSP = " ";

export function Hero() {
  return (
    <section className={`container ${styles.hero}`}>
      <p className="eyebrow">{nb("Минск · с 2019 года")}</p>
      {/* Заголовок собран вручную: внутри него подчёркнутые слова, nb() сквозь теги не работает. */}
      <h1 className={styles.title}>
        {`Обжарили в${NBSP}`}
        <span className={styles.mark}>четверг</span>
        {`${NBSP}— в${NBSP}`}
        <span className={styles.mark}>пятницу</span>
        {`${NBSP}у${NBSP}вас`}
      </h1>
      <p className={styles.lead}>
        {nb("Развозим по Минску по пятницам. Зерно у вас на 1–3 день после обжарки.")}
      </p>
      <div className={styles.week}>
        <Week />
      </div>
      <div className={styles.cta} id="hero-cta">
        <ButtonLink href="#lead">Оставить заявку</ButtonLink>
      </div>
      <div className={styles.visual}>
        <Photo
          className={styles.photo}
          name="hero-roaster"
          widths={[480, 800]}
          width={800}
          height={1000}
          sizes="(min-width: 56rem) 26rem, 100vw"
          alt="Руки с деревянной лопаткой над миской с жареными зёрнами у небольшого ростера"
          priority
        />
        {/* Фирменный штамп: слегка повёрнут и заходит на край фото. Только украшение, текст дублирует заголовок. */}
        <span className={styles.stamp} aria-hidden="true">
          {nb("обжарено: чт")}
        </span>
      </div>
    </section>
  );
}
