import { test } from "node:test";
import assert from "node:assert/strict";
import { captureAttribution, mergeAttribution } from "./attribution.ts";

const ORIGIN = "https://kvarta.example";
const AD_QUERY = "?utm_source=instagram&utm_medium=cpc&utm_campaign=autumn&utm_content=ad_3&fbclid=test123";

test("метки рекламы, идентификатор клика, реферер и страница входа попадают в источник", () => {
  const a = captureAttribution({
    search: AD_QUERY,
    referrer: "https://l.instagram.com/",
    href: `${ORIGIN}/${AD_QUERY}#menu`,
    origin: ORIGIN,
  });
  assert.equal(a.utm_source, "instagram");
  assert.equal(a.utm_medium, "cpc");
  assert.equal(a.utm_campaign, "autumn");
  assert.equal(a.utm_content, "ad_3");
  assert.equal(a.fbclid, "test123");
  assert.equal(a.referrer, "https://l.instagram.com/");
  assert.equal(a.landing_url, `${ORIGIN}/${AD_QUERY}`); // без якоря
});

test("yclid Яндекса тоже запоминается", () => {
  const a = captureAttribution({ search: "?utm_source=yandex&yclid=ya777", referrer: "", href: `${ORIGIN}/?utm_source=yandex&yclid=ya777`, origin: ORIGIN });
  assert.equal(a.yclid, "ya777");
  assert.equal(a.referrer, undefined);
});

test("чужие параметры игнорируются, длинные значения обрезаются", () => {
  const a = captureAttribution({ search: `?evil=1&utm_term=${"x".repeat(900)}`, referrer: "", href: `${ORIGIN}/`, origin: ORIGIN });
  assert.equal((a as Record<string, string>).evil, undefined);
  assert.equal(a.utm_term?.length, 500);
});

test("переход внутри сайта не считается источником", () => {
  const a = captureAttribution({ search: "", referrer: `${ORIGIN}/privacy`, href: `${ORIGIN}/`, origin: ORIGIN });
  assert.equal(a.referrer, undefined);
});

test("после ходьбы по странице и обновления без параметров источник остаётся прежним", () => {
  const stored = captureAttribution({ search: AD_QUERY, referrer: "https://l.instagram.com/", href: `${ORIGIN}/${AD_QUERY}`, origin: ORIGIN });
  const afterReload = captureAttribution({ search: "", referrer: "", href: `${ORIGIN}/`, origin: ORIGIN });
  const merged = mergeAttribution(stored, afterReload);
  assert.equal(merged.utm_source, "instagram");
  assert.equal(merged.fbclid, "test123");
  assert.equal(merged.landing_url, stored.landing_url);
});

test("новая рекламная ссылка перебивает старую", () => {
  const stored = captureAttribution({ search: AD_QUERY, referrer: "", href: `${ORIGIN}/${AD_QUERY}`, origin: ORIGIN });
  const fresh = captureAttribution({ search: "?utm_source=yandex&yclid=ya1", referrer: "", href: `${ORIGIN}/?utm_source=yandex&yclid=ya1`, origin: ORIGIN });
  const merged = mergeAttribution(stored, fresh);
  assert.equal(merged.utm_source, "yandex");
  assert.equal(merged.fbclid, undefined);
});

test("если ничего не запомнено, берём то, что видим сейчас", () => {
  const fresh = captureAttribution({ search: "", referrer: "https://www.google.com/", href: `${ORIGIN}/`, origin: ORIGIN });
  assert.deepEqual(mergeAttribution(null, fresh), fresh);
});
