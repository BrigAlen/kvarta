import { nb } from "../lib/typography";
import { Figure, Figures } from "./Figure";
import { Photo } from "./Photo";
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
      <Photo
        className={styles.photo}
        name="roaster-hands"
        widths={[600, 1200]}
        width={1200}
        height={900}
        sizes="(min-width: 56rem) 44rem, 100vw"
        alt="Руки с деревянной лопаткой над миской с жареными зёрнами рядом с небольшим ростером"
      />
    </Section>
  );
}
