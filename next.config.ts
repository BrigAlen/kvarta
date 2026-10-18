import type { NextConfig } from "next";

// cacheComponents и partialPrefetching, включённые шаблоном create-next-app, выключены:
// лендингу они не нужны, а с cacheComponents GET-обработчики пререндерятся при сборке
// (node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md), и /api/health
// показывал бы состояние переменных на момент сборки, а не на момент запроса.
const nextConfig: NextConfig = {};

export default nextConfig;
