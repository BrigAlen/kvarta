import type { ValidLead } from "./lead";
import { formatPhoneIfValid } from "./phone";
import { buildTelegramMessage } from "./telegram-message";

// Дублирование заявки в Telegram. Вызывается ПОСЛЕ сохранения в базу и после ответа посетителю
// (route.ts оборачивает вызов в after()), поэтому ни медленный, ни упавший Telegram не мешает заявке.
// Функция сама не бросает ошибок: любая неудача только пишется в лог (без токена и без данных заявки).

const TIMEOUT_MS = 5_000;

export async function notifyTelegram(lead: ValidLead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // не настроен: молча пропускаем

  // TELEGRAM_API_URL нужен только для проверок (подмена адреса на локальный «зависший» сервер).
  const base = process.env.TELEGRAM_API_URL ?? "https://api.telegram.org";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${base}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage({
          name: lead.name,
          phoneDisplay: formatPhoneIfValid(lead.phone),
          interest: lead.interest,
          comment: lead.comment,
          attribution: lead.attribution,
        }),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    if (response.ok) console.log("telegram: уведомление отправлено");
    else console.error(`telegram: ответ ${response.status}, уведомление не доставлено`);
  } catch (error) {
    const reason = error instanceof Error && error.name === "AbortError" ? `таймаут ${TIMEOUT_MS / 1000} с` : "сетевая ошибка";
    console.error(`telegram: ${reason}, уведомление не доставлено`);
  } finally {
    clearTimeout(timer);
  }
}
