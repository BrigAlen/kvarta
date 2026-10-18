import { nb } from "../lib/typography";
import { Figure, Figures } from "./Figure";
import { Section } from "./Section";
import styles from "./About.module.css";

export function About() {
  return (
    <Section
      id="about"
      title={nb("Мы — Аня и Дмитрий")}
      aside={
        <Figures>
          <Figure value="с 2019" caption="года обжариваем" />
          <Figure value="5 кг" caption="в одной партии" />
        </Figures>
      }
    >
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
    </Section>
  );
}
