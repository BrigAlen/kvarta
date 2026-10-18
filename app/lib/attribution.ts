// Источник заявки: откуда пришёл человек. Чистые функции без зависимостей (их тестируем отдельно)
// и маленькая обёртка над sessionStorage. Сервер всё равно перепроверяет и обрезает (lead.ts).

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
export type Attribution = Partial<Record<AttributionKey, string>>;

// Метки из адреса страницы: рекламные и идентификаторы кликов (Google, Facebook/Instagram, Яндекс).
const PARAM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "yclid"] as const;

const MAX_LENGTH = 500;

export type CaptureInput = {
  /** location.search, например "?utm_source=instagram" */
  search: string;
  /** document.referrer */
  referrer: string;
  /** location.href */
  href: string;
  /** location.origin: чтобы не считать переходы внутри сайта источником */
  origin: string;
};

function cut(value: string): string {
  return value.trim().slice(0, MAX_LENGTH);
}

function withoutHash(href: string): string {
  const index = href.indexOf("#");
  return index === -1 ? href : href.slice(0, index);
}

/** Что мы видим на этой странице прямо сейчас: метки из адреса, внешний реферер, адрес страницы входа. */
export function captureAttribution({ search, referrer, href, origin }: CaptureInput): Attribution {
  const result: Attribution = {};
  const params = new URLSearchParams(search);
  for (const key of PARAM_KEYS) {
    const value = params.get(key);
    if (value && value.trim() !== "") result[key] = cut(value);
  }
  if (referrer && !referrer.startsWith(origin)) result.referrer = cut(referrer);
  result.landing_url = cut(withoutHash(href));
  return result;
}

function hasCampaignParams(attribution: Attribution): boolean {
  return PARAM_KEYS.some((key) => attribution[key] !== undefined);
}

/**
 * Что запомнить: новая рекламная ссылка (есть метки) перебивает старое; без меток остаётся то, что
 * запомнили при входе. Так источник не теряется, если человек походил по странице и обновил её без параметров.
 */
export function mergeAttribution(stored: Attribution | null, fresh: Attribution): Attribution {
  if (hasCampaignParams(fresh)) return fresh;
  if (stored) return stored;
  return fresh;
}

const STORAGE_KEY = "kvarta:attribution";
let memory: Attribution | null = null; // запасной вариант, если sessionStorage недоступен

export function readStoredAttribution(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    // sessionStorage может быть закрыт (приватный режим, встроенные браузеры): работаем из памяти
  }
  return memory;
}

export function storeAttribution(attribution: Attribution): void {
  memory = attribution;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // см. выше
  }
}

/** Вызывается при заходе на страницу. */
export function rememberAttribution(): void {
  const fresh = captureAttribution({
    search: window.location.search,
    referrer: document.referrer,
    href: window.location.href,
    origin: window.location.origin,
  });
  storeAttribution(mergeAttribution(readStoredAttribution(), fresh));
}

/** Вызывается при отправке заявки: запомненное при входе плюс страница отправки. */
export function attributionForSubmit(): Attribution {
  const stored =
    readStoredAttribution() ??
    captureAttribution({
      search: window.location.search,
      referrer: document.referrer,
      href: window.location.href,
      origin: window.location.origin,
    });
  return { ...stored, submit_url: cut(withoutHash(window.location.href)) };
}
