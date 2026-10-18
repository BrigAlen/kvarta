// Живость сервиса и наличие переменной окружения на момент запроса.
// Значение DATABASE_URL не возвращаем и к базе не подключаемся.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true, databaseUrl: Boolean(process.env.DATABASE_URL) });
}
