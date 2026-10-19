import { nb } from "../lib/typography";
import { LeadFormFields } from "./LeadFormFields";
import { Photo } from "./Photo";
import { Section } from "./Section";
import styles from "./LeadForm.module.css";

// Секция с формой: заголовок, фото и текст (сервер), сама форма с логикой (клиент, LeadFormFields).
export function LeadForm() {
  return (
    <Section
      id="lead"
      eyebrow="Заявка"
      tone="dark"
      roundTop
      title={nb("Перезвоним и всё оформим")}
      aside={
        <Photo
          className={styles.photo}
          name="portafilter"
          widths={[480, 800]}
          width={800}
          height={1000}
          sizes="(min-width: 56rem) 22rem, 100vw"
          alt="Руки с холдером эспрессо-машины, в который засыпан молотый кофе"
        />
      }
    >
      <p>{nb("Выберите, что вас интересует, оставьте телефон, и мы перезвоним.")}</p>
      <LeadFormFields />
    </Section>
  );
}
