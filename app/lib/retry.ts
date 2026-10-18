/**
 * Выполняет работу и, если она упала, один раз повторяет после паузы.
 * Для подключения к базе: холодный старт Neon может сорвать первую попытку, и первая заявка
 * после простоя не должна теряться. Повторяем только подключение, не запись: записывать дважды нельзя.
 */
export async function retryOnce<T>(work: () => Promise<T>, delayMs: number): Promise<T> {
  try {
    return await work();
  } catch {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return work();
  }
}
