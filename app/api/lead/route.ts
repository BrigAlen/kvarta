import { after } from "next/server";
import { validateLead } from "../../lib/lead";
import { saveLead } from "../../lib/lead-store";
import { notifyTelegram } from "../../lib/telegram";

// POST /api/lead — приём заявки. Ответы:
//   201 {ok:true}                  заявка сохранена
//   200 {ok:true, duplicate:true}  такой номер уже оставлял заявку недавно (не ошибка)
//   400 {ok:false, error|errors}   невалидный JSON или поля
//   413 / 415                      слишком большое тело / не JSON
//   500 {ok:false, error:"server"} сбой на нашей стороне, без подробностей наружу

const MAX_BODY_BYTES = 10_000;

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return reply(415, { ok: false, error: "content_type" });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return reply(413, { ok: false, error: "too_large" });

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return reply(400, { ok: false, error: "invalid_body" });
  }
  if (raw.length > MAX_BODY_BYTES) return reply(413, { ok: false, error: "too_large" });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, error: "invalid_json" });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return reply(400, { ok: false, error: "invalid_json" });
  }
  const fields = body as Record<string, unknown>;

  // Ловушка для ботов: поле «website» человеку не видно. Если оно заполнено, делаем вид, что всё хорошо,
  // и ничего не сохраняем.
  if (typeof fields.website === "string" && fields.website.trim() !== "") {
    return reply(201, { ok: true });
  }

  const result = validateLead(fields);
  if (!result.ok) return reply(400, { ok: false, errors: result.errors });

  try {
    const saved = await saveLead(result.lead);
    if (saved.status === "duplicate") return reply(200, { ok: true, duplicate: true });
    // Уведомление в Telegram уходит после ответа посетителю и не влияет на заявку (таймаут 5 с, ошибки только в лог).
    after(() => notifyTelegram(result.lead));
    return reply(201, { ok: true });
  } catch (error) {
    // Код ошибки Postgres (например 42703 — нет колонки) безопасен: это не текст ошибки и не данные заявки.
    // Он нужен, чтобы быстро понять причину сбоя на проде по ответу или по логу.
    const code = typeof (error as { code?: unknown } | null)?.code === "string" ? (error as { code: string }).code : undefined;
    // В лог — только текст ошибки и код: без номера и без тела заявки.
    console.error("lead: не удалось сохранить заявку:", error instanceof Error ? error.message : "неизвестная ошибка", code ?? "");
    return reply(500, { ok: false, error: "server", ...(code ? { code } : {}) });
  }
}
