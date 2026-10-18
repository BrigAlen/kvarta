-- Согласие на обработку персональных данных: время согласия (ставит сервер) и версия политики.
-- Безопасно для повторного запуска. Для production применяется вручную в SQL Editor Neon (ветка production)
-- ДО выкладки кода, который эти колонки использует.

ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_policy_version text;
