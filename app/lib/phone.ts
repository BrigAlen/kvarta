// Проверка белорусского номера. Один модуль и для сервера, и для формы: без импортов и зависимостей.
// Принимаем мобильные коды 25, 29, 33, 44 и минский 17. Региональные городские коды отклоняем:
// у них разная длина номера. Решения и допущения — docs/design.md, раздел 9, и NOTES.md.

export type PhoneErrorReason = "empty" | "format" | "length" | "country" | "code";

export type PhoneResult =
  | { ok: true; e164: string; display: string }
  | { ok: false; reason: PhoneErrorReason };

export const PHONE_CODES = ["25", "29", "33", "44", "17"];

export const PHONE_EXAMPLE = "+375 (29) 123-45-67";

const ERROR_MESSAGES: Record<PhoneErrorReason, string> = {
  empty: `Укажите телефон. Пример: ${PHONE_EXAMPLE}.`,
  format: `В номере остались лишние символы. Пример: ${PHONE_EXAMPLE}.`,
  length: `Номер похож на неполный или слишком длинный. Пример: ${PHONE_EXAMPLE}.`,
  country: `Нужен белорусский номер, он начинается с +375. Пример: ${PHONE_EXAMPLE}.`,
  code: `Мы принимаем мобильные номера (коды 25, 29, 33, 44) и минские городские (код 17). Пример: ${PHONE_EXAMPLE}.`,
};

export function phoneErrorMessage(reason: PhoneErrorReason): string {
  return ERROR_MESSAGES[reason];
}

// Допустимые символы: цифры, пробелы (в том числе неразрывные), + ( ) - . ; плюс только в начале.
const ALLOWED = /^\+?[0-9\s ().-]*$/;

export function parseBelarusPhone(input: string): PhoneResult {
  const raw = input.trim();
  if (raw === "") return { ok: false, reason: "empty" };
  if (!ALLOWED.test(raw)) return { ok: false, reason: "format" };

  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return { ok: false, reason: "format" };

  let national: string; // код оператора и 7 цифр
  if (hasPlus) {
    if (!digits.startsWith("375")) return { ok: false, reason: "country" };
    national = digits.slice(3);
  } else if (digits.startsWith("375")) {
    national = digits.slice(3);
  } else if (digits.startsWith("80")) {
    national = digits.slice(2);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else if (digits.startsWith("7")) {
    return { ok: false, reason: "country" };
  } else {
    return { ok: false, reason: "format" };
  }

  if (national.length !== 9) return { ok: false, reason: "length" };
  const code = national.slice(0, 2);
  if (!PHONE_CODES.includes(code)) return { ok: false, reason: "code" };

  const rest = national.slice(2);
  return {
    ok: true,
    e164: `+375${national}`,
    display: `+375 (${code}) ${rest.slice(0, 3)}-${rest.slice(3, 5)}-${rest.slice(5)}`,
  };
}

// Что можно вводить в поле: цифры, «+», пробел, скобки и дефис. Остальное (буквы, точки, запятые...) отбрасываем.
const NOT_ALLOWED_IN_FIELD = /[^0-9+ ()-]/g;

export const PHONE_FIELD_MAX_LENGTH = 25;

export function sanitizePhoneInput(value: string): string {
  return value.replace(NOT_ALLOWED_IN_FIELD, "").slice(0, PHONE_FIELD_MAX_LENGTH);
}

// Для вставки и выхода из поля: верный номер приводим к виду «+375 (29) 123-45-67», неверный не трогаем.
export function formatPhoneIfValid(value: string): string {
  const parsed = parseBelarusPhone(value);
  return parsed.ok ? parsed.display : value;
}
