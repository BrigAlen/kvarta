import { DEDUP_MINUTES } from "./dedup";
import { withClient } from "./db";
import type { ValidLead } from "./lead";
import { RETENTION_MONTHS } from "./policy";

// Окно дедупликации (DEDUP_MINUTES) вынесено в dedup.ts: оно нужно и форме.

export type SaveResult = { status: "created" } | { status: "duplicate" };

async function purgeExpiredLeads(client: { query: (sql: string, params: unknown[]) => Promise<{ rowCount: number | null }> }) {
  try {
    const result = await client.query("DELETE FROM leads WHERE created_at < now() - $1 * interval '1 month'", [RETENTION_MONTHS]);
    if (result.rowCount) console.log(`leads: удалено заявок старше ${RETENTION_MONTHS} месяцев: ${result.rowCount}`);
  } catch (error) {
    console.error("leads: не удалось удалить старые заявки:", error instanceof Error ? error.message : "неизвестная ошибка");
  }
}

/**
 * Сохраняет заявку. Дедупликация целиком в базе, а не в коде приложения:
 * в транзакции берём замок на номер (pg_advisory_xact_lock), смотрим, нет ли свежей записи,
 * и только потом вставляем. Два одновременных запроса с одним номером встают в очередь на замке:
 * второй после снятия замка видит запись первого и получает «дубль».
 * Замок действует до конца транзакции, поэтому работает и через пулированную строку Neon.
 */
export async function saveLead(lead: ValidLead): Promise<SaveResult> {
  return withClient(async (client) => {
    // Срок хранения из политики: при каждой новой заявке удаляем старше RETENTION_MONTHS.
    // Отдельным запросом ДО транзакции и под своим try: сбой удаления не должен ломать сохранение и ответ.
    await purgeExpiredLeads(client);

    await client.query("BEGIN");
    try {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [lead.phone]);

      const recent = await client.query(
        "SELECT 1 FROM leads WHERE phone = $1 AND created_at > now() - $2 * interval '1 minute' LIMIT 1",
        [lead.phone, DEDUP_MINUTES],
      );
      if (recent.rowCount) {
        await client.query("COMMIT");
        return { status: "duplicate" } as const;
      }

      const a = lead.attribution;
      await client.query(
        `INSERT INTO leads
           (name, phone, interest, comment,
            utm_source, utm_medium, utm_campaign, utm_term, utm_content,
            gclid, fbclid, yclid, referrer, landing_url, submit_url,
            consent_at, consent_policy_version)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, now(), $16)`,
        [
          lead.name, lead.phone, lead.interest, lead.comment,
          a.utm_source, a.utm_medium, a.utm_campaign, a.utm_term, a.utm_content,
          a.gclid, a.fbclid, a.yclid, a.referrer, a.landing_url, a.submit_url,
          lead.consentPolicyVersion,
        ],
      );
      await client.query("COMMIT");
      return { status: "created" } as const;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    }
  });
}
