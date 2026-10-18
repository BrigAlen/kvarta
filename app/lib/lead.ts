import { parseBelarusPhone, phoneErrorMessage } from "./phone";

// Серверная проверка заявки. Клиенту не доверяем ни в чём: типы, длины, допустимые значения.

export const INTERESTS = ["subscription", "order", "question"] as const;
export type Interest = (typeof INTERESTS)[number];

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "yclid",
  "referrer",
  "landing_url",
  "submit_url",
] as const;
export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];

export type ValidLead = {
  name: string;
  phone: string; // нормализованный +375XXXXXXXXX
  interest: Interest;
  comment: string | null;
  attribution: Record<AttributionKey, string | null>;
};

export type LeadField = "name" | "phone" | "interest" | "comment";
export type LeadErrors = Partial<Record<LeadField, string>>;

export type LeadValidation = { ok: true; lead: ValidLead } | { ok: false; errors: LeadErrors };

export const LIMITS = { name: 100, phone: 40, comment: 1000, attribution: 500 };

// Убираем управляющие символы: Postgres не принимает нулевой байт в тексте, а остальное — мусор.
// Перевод строки и табуляцию оставляем (нужны в комментарии).
function clean(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code === 9 || code === 10 || (code >= 32 && code !== 127)) out += ch;
  }
  return out.trim();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateLead(body: Record<string, unknown>): LeadValidation {
  const errors: LeadErrors = {};

  const nameRaw = body.name;
  const name = typeof nameRaw === "string" ? clean(nameRaw) : "";
  if (name === "") errors.name = "Напишите, как к вам обращаться.";
  else if (name.length > LIMITS.name) errors.name = `Имя слишком длинное (не больше ${LIMITS.name} знаков).`;

  let phone = "";
  const phoneRaw = body.phone;
  if (typeof phoneRaw !== "string") {
    errors.phone = phoneErrorMessage("empty");
  } else if (phoneRaw.length > LIMITS.phone) {
    errors.phone = phoneErrorMessage("format");
  } else {
    const parsed = parseBelarusPhone(phoneRaw);
    if (parsed.ok) phone = parsed.e164;
    else errors.phone = phoneErrorMessage(parsed.reason);
  }

  const interest = INTERESTS.find((i) => i === body.interest);
  if (!interest) errors.interest = "Выберите, что вас интересует.";

  let comment: string | null = null;
  if (body.comment !== undefined && body.comment !== null) {
    if (typeof body.comment !== "string") {
      errors.comment = "Комментарий должен быть текстом.";
    } else {
      const text = clean(body.comment);
      if (text.length > LIMITS.comment) errors.comment = `Комментарий слишком длинный (не больше ${LIMITS.comment} знаков).`;
      else comment = text === "" ? null : text;
    }
  }

  if (Object.keys(errors).length > 0 || !interest) return { ok: false, errors };

  // Источник: мусор в метках не должен стоить нам заявки, поэтому лишнее отбрасываем и обрезаем.
  const attribution = Object.fromEntries(ATTRIBUTION_KEYS.map((key) => [key, null])) as ValidLead["attribution"];
  if (isPlainObject(body.attribution)) {
    for (const key of ATTRIBUTION_KEYS) {
      const value = body.attribution[key];
      if (typeof value === "string") {
        const text = clean(value).slice(0, LIMITS.attribution);
        attribution[key] = text === "" ? null : text;
      }
    }
  }

  return { ok: true, lead: { name, phone, interest, comment, attribution } };
}
