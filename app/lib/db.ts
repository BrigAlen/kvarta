import { Client } from "pg";
import { retryOnce } from "./retry";

const CONNECT_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 1_500;

async function connectOnce(connectionString: string): Promise<Client> {
  const client = new Client({ connectionString, connectionTimeoutMillis: CONNECT_TIMEOUT_MS });
  client.on("error", () => {
    // Ошибка соединения без активного запроса: не роняем процесс, следующий запрос откроет новое.
  });
  try {
    await client.connect();
    return client;
  } catch (error) {
    await client.end().catch(() => {});
    throw error;
  }
}

// Одно соединение на запрос: подключились, сделали своё, закрыли.
// Пула нет намеренно: Neon усыпляет базу после простоя, и пул держал бы мёртвые соединения.
// Подключение пробуем дважды (холодный старт Neon): первая заявка после простоя не должна теряться.
// Повторяем только подключение, но не саму работу: запись дважды недопустима.
export async function withClient<T>(work: (client: Client) => Promise<T>): Promise<T> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL не задан");

  const client = await retryOnce(() => connectOnce(connectionString), RETRY_DELAY_MS);
  try {
    return await work(client);
  } finally {
    await client.end().catch(() => {});
  }
}
