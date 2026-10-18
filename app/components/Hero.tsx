import { ButtonLink } from "./ButtonLink";
import { Week } from "./Week";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={`container ${styles.hero}`}>
      <p className={styles.eyebrow}>Минск · обжарка с 2019 года</p>
      <h1 className={styles.title}>
        Обжарили в <span className={styles.mark}>четверг</span> — в{" "}
        <span className={styles.mark}>пятницу</span> у вас
      </h1>
      <p className={styles.lead}>
        Развозим по Минску по пятницам. Зерно у вас на 1–3 день после обжарки.
      </p>
      <div className={styles.week}>
        <Week />
      </div>
      <ButtonLink href="#lead">Оставить заявку</ButtonLink>
    </section>
  );
}
