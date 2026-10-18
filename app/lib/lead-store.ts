import { withClient } from "./db";
import type { ValidLead } from "./lead";

// Повторная заявка с тем же номером в течение этого времени не создаёт новую запись.
export const DEDUP_MINUTES = 10;

export type SaveResult = { status: "created" } | { status: "duplicate" };

/**
 * Сохраняет заявку. Дедупликация целиком в базе, а не в коде приложения:
 * в транзакции берём замок на номер (pg_advisory_xact_lock), смотрим, нет ли свежей записи,
 * и только потом вставляем. Два одновременных запроса с одним номером встают в очередь на замке:
 * второй после снятия замка видит запись первого и получает «дубль».
 * Замок действует до конца транзакции, поэтому работает и через пулированную строку Neon.
 */
export async function saveLead(lead: ValidLead): Promise<SaveResult> {
  return withClient(async (client) => {
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
            gclid, fbclid, yclid, referrer, landing_url, submit_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          lead.name, lead.phone, lead.interest, lead.comment,
          a.utm_source, a.utm_medium, a.utm_campaign, a.utm_term, a.utm_content,
          a.gclid, a.fbclid, a.yclid, a.referrer, a.landing_url, a.submit_url,
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
