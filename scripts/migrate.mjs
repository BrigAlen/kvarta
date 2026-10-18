// Применяет db/schema.sql к базе из DATABASE_URL. Запуск: npm run db:migrate (читает .env.local).
// Файл схемы безопасен для повторного запуска.
import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL не задан (ожидается в .env.local)");
  process.exit(1);
}

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10_000 });
await client.connect();
try {
  await client.query(sql);
  const { rows } = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY ordinal_position",
  );
  console.log(`Схема применена. Колонок в leads: ${rows.length}`);
} finally {
  await client.end();
}
