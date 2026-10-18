import { nb } from "../lib/typography";
import { PackIllustration } from "./PackIllustration";
import { Section } from "./Section";
import styles from "./About.module.css";

export function About() {
  return (
    <Section id="about" title={nb("Мы — Аня и Дмитрий")}>
      <div className={styles.text}>
        <p>
          {nb("Раньше мы работали бариста. С 2019 года обжариваем кофе сами, в Минске, партиями по 5 кг.")}
        </p>
        <p>
          {nb(
            "Обжариваем по четвергам, а в пятницу развозим, поэтому зерно доезжает до вас на 1–3 день после обжарки. Нам важно одно: чтобы вы открыли пачку, пока кофе ещё свежий. Нам кажется, разница чувствуется с первой чашки.",
          )}
        </p>
      </div>
      <PackIllustration className={styles.pack} />
    </Section>
  );
}
