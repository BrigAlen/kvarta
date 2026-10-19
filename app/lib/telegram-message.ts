// Текст уведомления о заявке для Telegram. Чистая функция без зависимостей: тестируется отдельно.
// Обычный текст без разметки (parse_mode не задаём): имя и комментарий приходят от посетителя,
// и экранировать в них нечего.

export type NotifyLead = {
  name: string;
  /** Телефон в читаемом виде, например «+375 (29) 123-45-67» */
  phoneDisplay: string;
  /** subscription | order | question */
  interest: string;
  comment: string | null;
  attribution: Partial<Record<string, string | null>>;
};

const INTEREST_LABELS: Record<string, string> = {
  subscription: "Подписка",
  order: "Разовый заказ",
  question: "Вопрос",
};

const CLICK_IDS = ["gclid", "fbclid", "yclid"] as const;
const MAX_LENGTH = 3500; // лимит Telegram 4096 знаков, оставляем запас

function host(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url.slice(0, 60);
  }
}

/** Источник одной строкой: utm_source / utm_medium / utm_campaign и идентификатор клика; без меток: реферер или «прямой заход». */
export function describeSource(attribution: NotifyLead["attribution"]): string {
  const parts: string[] = [];
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const value = attribution[key];
    if (value) parts.push(value);
  }
  for (const key of CLICK_IDS) {
    if (attribution[key]) parts.push(`${key}=${String(attribution[key]).slice(0, 24)}`);
  }
  if (parts.length > 0) return parts.join(" / ");
  if (attribution.referrer) return `переход с ${host(attribution.referrer)}`;
  return "прямой заход, меток нет";
}

export function buildTelegramMessage(lead: NotifyLead): string {
  const text = [
    "Новая заявка с сайта",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phoneDisplay}`,
    `Интересует: ${INTEREST_LABELS[lead.interest] ?? lead.interest}`,
    `Комментарий: ${lead.comment ?? "—"}`,
    `Источник: ${describeSource(lead.attribution)}`,
  ].join("\n");
  return text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH - 1) + "…" : text;
}
