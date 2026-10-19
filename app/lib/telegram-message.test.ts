import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTelegramMessage, describeSource } from "./telegram-message.ts";

const base = {
  name: "Аня",
  phoneDisplay: "+375 (29) 123-45-67",
  interest: "subscription",
  comment: "Два сорта, пожалуйста",
  attribution: {},
};

test("в сообщении есть имя, телефон, интерес, комментарий и источник", () => {
  const text = buildTelegramMessage({ ...base, attribution: { utm_source: "instagram", utm_medium: "cpc", utm_campaign: "autumn", fbclid: "test123" } });
  assert.match(text, /Имя: Аня/);
  assert.match(text, /Телефон: \+375 \(29\) 123-45-67/);
  assert.match(text, /Интересует: Подписка/);
  assert.match(text, /Комментарий: Два сорта, пожалуйста/);
  assert.match(text, /Источник: instagram \/ cpc \/ autumn \/ fbclid=test123/);
});

test("без комментария стоит тире", () => {
  assert.match(buildTelegramMessage({ ...base, comment: null }), /Комментарий: —/);
});

test("источник: Яндекс с yclid, реферер без меток, прямой заход", () => {
  assert.equal(describeSource({ utm_source: "yandex", yclid: "ya777" }), "yandex / yclid=ya777");
  assert.equal(describeSource({ referrer: "https://l.instagram.com/" }), "переход с l.instagram.com");
  assert.equal(describeSource({}), "прямой заход, меток нет");
});

test("интересы подписаны по-русски", () => {
  assert.match(buildTelegramMessage({ ...base, interest: "order" }), /Разовый заказ/);
  assert.match(buildTelegramMessage({ ...base, interest: "question" }), /Вопрос/);
});

test("длинное сообщение обрезается, не превышая лимит Telegram", () => {
  const text = buildTelegramMessage({ ...base, comment: "я".repeat(9000) });
  assert.ok(text.length <= 3500);
  assert.ok(text.endsWith("…"));
});
