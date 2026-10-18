-- Схема базы «Кварта». Безопасна для повторного запуска: второй Run ничего не ломает и не стирает.

CREATE TABLE IF NOT EXISTS leads (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at   timestamptz NOT NULL DEFAULT now(),
  name         text NOT NULL,
  phone        text NOT NULL,        -- нормализованный вид +375XXXXXXXXX
  interest     text NOT NULL CHECK (interest IN ('subscription', 'order', 'question')),
  comment      text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,
  utm_content  text,
  gclid        text,
  fbclid       text,
  yclid        text,
  referrer     text,
  landing_url  text,
  submit_url   text,
  consent_at   timestamptz,          -- время согласия на обработку данных (ставит сервер)
  consent_policy_version text        -- версия политики, на которую согласился человек
);

-- Быстрый поиск свежей заявки с тем же номером (дедупликация).
CREATE INDEX IF NOT EXISTS leads_phone_created_idx ON leads (phone, created_at DESC);
