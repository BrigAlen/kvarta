// Удаляет заявки старше срока хранения из политики (12 месяцев). Запуск: npm run db:purge (читает .env.local).
// Политика обещает удаление, поэтому для настоящего клиента скрипт нужно запускать по расписанию.
import pg from "pg";

const MONTHS = 12;
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL не задан (ожидается в .env.local)");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10_000 });
await client.connect();
try {
  const result = await client.query("DELETE FROM leads WHERE created_at < now() - $1 * interval '1 month'", [MONTHS]);
  console.log(`Удалено заявок старше ${MONTHS} месяцев: ${result.rowCount}`);
} finally {
  await client.end();
}
