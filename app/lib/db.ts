import { Client } from "pg";

// Одно соединение на запрос: подключились, сделали своё, закрыли.
// Пула нет намеренно: Neon усыпляет базу после простоя, и пул держал бы мёртвые соединения.
// Заявок мало, лишнее подключение дёшево. Таймаут 10 секунд с запасом на пробуждение базы.
export async function withClient<T>(work: (client: Client) => Promise<T>): Promise<T> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL не задан");

  const client = new Client({ connectionString, connectionTimeoutMillis: 10_000 });
  client.on("error", () => {
    // Ошибка соединения без активного запроса: не роняем процесс, следующий запрос откроет новое.
  });

  await client.connect();
  try {
    return await work(client);
  } finally {
    await client.end().catch(() => {});
  }
}
