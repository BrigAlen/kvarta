import { nb } from "../lib/typography";
import { SubmitButton } from "./ButtonLink";
import { Photo } from "./Photo";
import { Section } from "./Section";
import styles from "./LeadForm.module.css";

const interests = [
  { value: "subscription", label: "Подписка" },
  { value: "order", label: "Разовый заказ" },
  { value: "question", label: "Вопрос" },
];

// Пока только разметка и стили. Отправка, валидация, согласие и ответы сервера — шаг 5.
export function LeadForm() {
  return (
    <Section
      id="lead"
      tone="dark"
      fadeTop
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
      <form className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="lead-name">Имя</label>
          <input id="lead-name" name="name" type="text" autoComplete="name" />
        </div>
        <div className={styles.field}>
          <label htmlFor="lead-phone">Телефон</label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+375 29 123-45-67"
          />
        </div>
        <fieldset className={styles.interest}>
          <legend>{nb("Что вас интересует")}</legend>
          {interests.map((i) => (
            <label key={i.value} className={styles.option}>
              <input type="radio" name="interest" value={i.value} />
              <span>{nb(i.label)}</span>
            </label>
          ))}
        </fieldset>
        <div className={styles.field}>
          <label htmlFor="lead-comment">Комментарий</label>
          <textarea id="lead-comment" name="comment" rows={4} />
        </div>
        <SubmitButton>Оставить заявку</SubmitButton>
      </form>
    </Section>
  );
}
