"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { attributionForSubmit } from "../lib/attribution";
import { DEDUP_MINUTES } from "../lib/dedup";
import { validateLead, type LeadErrors, type LeadField } from "../lib/lead";
import {
  formatPhoneIfValid,
  parseBelarusPhone,
  phoneErrorMessage,
  PHONE_EXAMPLE,
  PHONE_FIELD_MAX_LENGTH,
  sanitizePhoneInput,
} from "../lib/phone";
import { nb } from "../lib/typography";
import { SubmitButton } from "./ButtonLink";
import styles from "./LeadForm.module.css";

const interests = [
  { value: "subscription", label: "Подписка" },
  { value: "order", label: "Разовый заказ" },
  { value: "question", label: "Вопрос" },
];

type Status = "idle" | "sending" | "success" | "duplicate" | "error";

// Порядок полей для перехода фокуса к первой ошибке.
const FIELD_ORDER: LeadField[] = ["name", "phone", "interest", "comment", "consent"];
const FIELD_IDS: Record<LeadField, string> = {
  name: "lead-name",
  phone: "lead-phone",
  interest: "lead-interest-subscription",
  comment: "lead-comment",
  consent: "lead-consent",
};

const REQUEST_TIMEOUT_MS = 30_000;

export function LeadFormFields() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // ловушка для ботов: человеку не видна
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentPhone, setSentPhone] = useState("");

  const sendingRef = useRef(false); // защита от двойного нажатия: срабатывает мгновенно, раньше, чем перерисуется кнопка
  const phoneRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Курсор в поле телефона: возвращаем туда, где он был, если мы убрали лишние символы.
  useLayoutEffect(() => {
    if (caretRef.current !== null && phoneRef.current) {
      phoneRef.current.setSelectionRange(caretRef.current, caretRef.current);
      caretRef.current = null;
    }
  }, [phone]);

  // После отправки переводим фокус на ответ: скринридер зачитывает его, а клавиатура не теряет место.
  useEffect(() => {
    if (status === "success" || status === "duplicate") resultRef.current?.focus();
  }, [status]);

  function clearError(field: LeadField) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function onPhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    const caret = event.target.selectionStart ?? raw.length;
    const clean = sanitizePhoneInput(raw);
    if (clean !== raw) {
      // Сколько знаков убрали левее курсора: на столько сдвигаем курсор назад.
      const removedBeforeCaret = caret - sanitizePhoneInput(raw.slice(0, caret)).length;
      caretRef.current = Math.max(0, caret - removedBeforeCaret);
      // Если состояние не изменилось (убрали только что набранную букву), эффект ниже не сработает,
      // а React вернёт значение в поле и увезёт курсор в конец: ставим курсор ещё раз после отрисовки.
      requestAnimationFrame(() => {
        if (caretRef.current !== null && phoneRef.current) {
          phoneRef.current.setSelectionRange(caretRef.current, caretRef.current);
          caretRef.current = null;
        }
      });
    }
    // Обычный ввод без лишних символов отменяет отложенный возврат курсора от предыдущего ввода,
    // иначе при быстром наборе он сработал бы позже и сбил порядок цифр.
    if (clean === raw) caretRef.current = null;
    setPhone(clean);
    clearError("phone");
  }

  // Вставка любого формата (8 029…, 375…, со скобками): верный номер сразу приводим к виду «+375 (29) 123-45-67».
  function onPhonePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    const parsed = parseBelarusPhone(pasted);
    if (!parsed.ok) return; // остальное обработает onChange: лишние символы уберутся
    event.preventDefault();
    caretRef.current = parsed.display.length;
    setPhone(parsed.display);
    clearError("phone");
  }

  // При выходе из поля верный номер форматируем, неверный не трогаем, но подсказываем.
  function onPhoneBlur() {
    if (phone.trim() === "") return;
    const parsed = parseBelarusPhone(phone);
    if (parsed.ok) setPhone(formatPhoneIfValid(phone));
    else setErrors((current) => ({ ...current, phone: phoneErrorMessage(parsed.reason) }));
  }

  function focusFirstError(found: LeadErrors) {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) document.getElementById(FIELD_IDS[first])?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return; // двойное нажатие: второй запрос не уходит

    const checked = validateLead({ name, phone, interest, comment, consent, attribution: {} });
    if (!checked.ok) {
      setErrors(checked.errors);
      setStatus("idle");
      focusFirstError(checked.errors);
      return;
    }

    sendingRef.current = true;
    setErrors({});
    setStatus("sending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, interest, comment, consent: true, website, attribution: attributionForSubmit() }),
        signal: controller.signal,
      });
      if (response.status === 201 || response.status === 200) {
        const data = (await response.json().catch(() => ({}))) as { duplicate?: boolean };
        setSentPhone(formatPhoneIfValid(phone));
        setName("");
        setPhone("");
        setInterest("");
        setComment("");
        setConsent(false);
        setStatus(data.duplicate ? "duplicate" : "success");
      } else if (response.status === 400) {
        const data = (await response.json().catch(() => ({}))) as { errors?: LeadErrors };
        if (data.errors) {
          setErrors(data.errors);
          setStatus("idle");
          focusFirstError(data.errors);
        } else {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    } catch {
      // Нет сети, обрыв или таймаут: данные остаются в форме, человек видит, что делать.
      setStatus("error");
    } finally {
      clearTimeout(timer);
      sendingRef.current = false;
    }
  }

  if (status === "success" || status === "duplicate") {
    return (
      <div ref={resultRef} className={styles.result} tabIndex={-1} role="status">
        <h3 className={styles.resultTitle}>
          {status === "success" ? nb("Спасибо, заявка у нас") : nb("Заявка уже у нас")}
        </h3>
        <p>
          {status === "success"
            ? nb(`Мы перезвоним по номеру ${sentPhone}.`)
            : nb(
                `С номера ${sentPhone} недавно уже приходила заявка, мы перезвоним. Если хотите что-то добавить, оставьте новую заявку через ${DEDUP_MINUTES} минут.`,
              )}
        </p>
        <button className={styles.again} type="button" onClick={() => setStatus("idle")}>
          {nb("Оставить ещё одну заявку")}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="lead-name">Имя</label>
        <input
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearError("name");
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
        />
        {errors.name && (
          <p id="lead-name-error" className={styles.error} role="alert">
            {nb(errors.name)}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="lead-phone">Телефон</label>
        <input
          ref={phoneRef}
          id="lead-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={PHONE_EXAMPLE}
          maxLength={PHONE_FIELD_MAX_LENGTH}
          value={phone}
          onChange={onPhoneChange}
          onPaste={onPhonePaste}
          onBlur={onPhoneBlur}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "lead-phone-error" : undefined}
        />
        {errors.phone && (
          <p id="lead-phone-error" className={styles.error} role="alert">
            {nb(errors.phone)}
          </p>
        )}
      </div>

      <fieldset className={styles.interest} aria-describedby={errors.interest ? "lead-interest-error" : undefined}>
        <legend>{nb("Что вас интересует")}</legend>
        <div className={styles.chips}>
          {interests.map((item) => (
            <label key={item.value} className={styles.chip}>
              <input
                id={`lead-interest-${item.value}`}
                type="radio"
                name="interest"
                value={item.value}
                checked={interest === item.value}
                onChange={() => {
                  setInterest(item.value);
                  clearError("interest");
                }}
              />
              <span>{nb(item.label)}</span>
            </label>
          ))}
        </div>
        {errors.interest && (
          <p id="lead-interest-error" className={styles.error} role="alert">
            {nb(errors.interest)}
          </p>
        )}
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="lead-comment">Комментарий</label>
        <textarea
          id="lead-comment"
          name="comment"
          rows={4}
          maxLength={1000}
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            clearError("comment");
          }}
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? "lead-comment-error" : undefined}
        />
        {errors.comment && (
          <p id="lead-comment-error" className={styles.error} role="alert">
            {nb(errors.comment)}
          </p>
        )}
      </div>

      <div className={styles.hp} aria-hidden="true">
        <label>
          Не заполняйте это поле
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
      </div>

      <div className={styles.consentRow}>
        <label className={styles.consent}>
          <input
            id="lead-consent"
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              clearError("consent");
            }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "lead-consent-error" : undefined}
          />
          <span>
            {nb("Согласен(на) на обработку моих персональных данных на условиях ")}
            <Link href="/privacy" target="_blank" rel="noopener">
              {nb("политики")}
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="lead-consent-error" className={styles.error} role="alert">
            {nb(errors.consent)}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className={styles.failure} role="alert">
          {nb(
            "Не получилось отправить заявку. Ваши данные остались в форме: нажмите кнопку ещё раз. Если не выйдет, приходите к нам: Минск, ул. Короля, 9.",
          )}
        </p>
      )}

      <SubmitButton busy={status === "sending"}>
        {status === "sending" ? nb("Отправляем…") : nb("Оставить заявку")}
      </SubmitButton>
    </form>
  );
}
