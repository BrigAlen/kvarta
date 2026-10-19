import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatPhoneIfValid,
  formatPhonePartial,
  nextPhoneValue,
  parseBelarusPhone,
  phoneDigitCount,
  phoneDigitLimit,
  phoneErrorMessage,
  PHONE_EXAMPLE,
  sanitizePhoneInput,
} from "./phone.ts";

const E164 = "+375291234567";

test("форматы из verify.md приводятся к одному виду", () => {
  const inputs = [
    "+375 29 123-45-67",
    "+375291234567",
    "375291234567",
    "80291234567",
    "8 029 123 45 67",
    "029 123 45 67", // допущение: ноль без восьмёрки принимаем
    "+375 (29) 123 45 67",
    "  +375.29.123.45.67  ",
    "+375 29 123-45-67",
  ];
  for (const input of inputs) {
    const r = parseBelarusPhone(input);
    assert.ok(r.ok, `должен приниматься: ${JSON.stringify(input)}`);
    assert.equal(r.e164, E164, input);
    assert.equal(r.display, "+375 (29) 123-45-67", input);
  }
});

test("коды 25, 33, 44 в разных форматах", () => {
  for (const code of ["25", "33", "44"]) {
    const forms = [`+375 ${code} 123-45-67`, `+375${code}1234567`, `375${code}1234567`, `80${code}1234567`, `8 0${code} 123 45 67`, `+375 (${code}) 123 45 67`];
    for (const input of forms) {
      const r = parseBelarusPhone(input);
      assert.ok(r.ok, input);
      assert.equal(r.e164, `+375${code}1234567`, input);
    }
  }
});

test("минский городской код 17 принимается", () => {
  const r = parseBelarusPhone("+375 17 123-45-67");
  assert.ok(r.ok);
  assert.equal(r.e164, "+375171234567");
});

test("разные форматы одного номера дают одно и то же нормализованное значение (основа дедупликации)", () => {
  const a = parseBelarusPhone("+375291234567");
  const b = parseBelarusPhone("80291234567");
  assert.ok(a.ok && b.ok);
  assert.equal(a.e164, b.e164);
});

test("отклоняются с понятной причиной", () => {
  const cases: [string, string][] = [
    ["+375 19 123-45-67", "code"], // нет такого кода
    ["+375 15 123-45-67", "code"], // региональный городской, не принимаем
    ["+375 29 123-45-6", "length"], // не хватает цифры
    ["+375 29 123-45-678", "length"], // лишняя цифра
    ["+7 912 345-67-89", "country"], // не Беларусь
    ["79123456789", "country"],
    ["", "empty"],
    ["   ", "empty"],
    ["abc", "format"],
    ["+375 29 12з-45-67", "format"], // буква вместо цифры
    ["+375 29 123-45-67 доб. 5", "format"],
    ["++375291234567", "format"],
    ["375+291234567", "format"],
    ["89123456789", "format"], // российский вид 8 9xx
    ["+", "format"],
  ];
  for (const [input, reason] of cases) {
    const r = parseBelarusPhone(input);
    assert.equal(r.ok, false, `должен отклоняться: ${JSON.stringify(input)}`);
    if (!r.ok) assert.equal(r.reason, reason, input);
  }
});

test("у каждой причины отказа есть подсказка с примером формата", () => {
  for (const reason of ["empty", "format", "length", "country", "code"] as const) {
    assert.ok(phoneErrorMessage(reason).includes(PHONE_EXAMPLE), reason);
  }
});

test("в поле остаются только цифры, плюс, пробелы, скобки и дефис", () => {
  assert.equal(sanitizePhoneInput("abc+375 (29) 12x3-45-67"), "+375 (29) 123-45-67");
  assert.equal(sanitizePhoneInput("тел. 8-029-123.45.67"), " 8-029-1234567");
});

test("поле не принимает больше 25 знаков", () => {
  assert.equal(sanitizePhoneInput("1".repeat(40)).length, 25);
});

test("вставка и выход из поля: верный номер форматируется, неверный остаётся как есть", () => {
  assert.equal(formatPhoneIfValid("8 029 123 45 67"), "+375 (29) 123-45-67");
  assert.equal(formatPhoneIfValid("375291234567"), "+375 (29) 123-45-67");
  assert.equal(formatPhoneIfValid("+375 (44) 123 45 67"), "+375 (44) 123-45-67");
  assert.equal(formatPhoneIfValid("+375 29 12"), "+375 29 12");
  assert.equal(formatPhoneIfValid(""), "");
});

test("мягкая маска: набор в конец форматируется по ходу", () => {
  assert.equal(formatPhonePartial("+375 "), "+375 ");
  assert.equal(formatPhonePartial("+375 2"), "+375 (2");
  assert.equal(formatPhonePartial("+375 (29"), "+375 (29");
  assert.equal(formatPhonePartial("+375 (291"), "+375 (29) 1");
  assert.equal(formatPhonePartial("+375 (29) 1234"), "+375 (29) 123-4");
  assert.equal(formatPhonePartial("+375 (29) 123-456"), "+375 (29) 123-45-6");
  assert.equal(formatPhonePartial("+375291234567"), "+375 (29) 123-45-67");
  assert.equal(formatPhonePartial("375291234567"), "+375 (29) 123-45-67");
});

test("мягкая маска: после полного номера лишние цифры отбрасываются", () => {
  assert.equal(formatPhonePartial("+375 (29) 123-45-678"), "+375 (29) 123-45-67");
  assert.equal(formatPhonePartial("+37529123456799999"), "+375 (29) 123-45-67");
});

test("мягкая маска: не белорусский вид не трогаем, его приведёт проверка при выходе", () => {
  assert.equal(formatPhonePartial("80291234567"), "80291234567");
  assert.equal(formatPhonePartial("8 029 123 45 67"), "8 029 123 45 67");
  assert.equal(formatPhonePartial("029 123 45 67"), "029 123 45 67");
});

test("лимит цифр зависит от вида номера", () => {
  assert.equal(phoneDigitLimit("+375 (29) 123-45-67"), 12);
  assert.equal(phoneDigitLimit("375291234567"), 12);
  assert.equal(phoneDigitLimit("8029"), 11);
  assert.equal(phoneDigitLimit("0291234567"), 10);
  assert.equal(phoneDigitCount("+375 (29) 123-45-67"), 12);
});

test("мягкая маска: набор в конце форматирует на лету", () => {
  let v = "+375 ";
  for (const ch of "291234567") v = nextPhoneValue(v, v + ch, true);
  assert.equal(v, "+375 (29) 123-45-67");
});

test("мягкая маска: лишние цифры после полного номера не вводятся", () => {
  assert.equal(nextPhoneValue("+375 (29) 123-45-67", "+375 (29) 123-45-678", true), "+375 (29) 123-45-67");
  assert.equal(nextPhoneValue("80291234567", "802912345678", true), "80291234567");
});

test("мягкая маска: стирание в конце и стирание префикса", () => {
  assert.equal(nextPhoneValue("+375 (29) 123-45-67", "+375 (29) 123-45-6", true), "+375 (29) 123-45-6");
  assert.equal(nextPhoneValue("+375 (29) 1", "+375 (29) ", true), "+375 (29");
  assert.equal(nextPhoneValue("+375 (2", "+375 (", true), "+375 ");
  assert.equal(nextPhoneValue("+375 ", "+375", true), "");
});

test("мягкая маска: правка в середине не форматирует", () => {
  assert.equal(nextPhoneValue("+375 (29) 123-45-67", "+375 (29) 1923-45-67", false), "+375 (29) 1923-45-67");
});

test("мягкая маска: номер вставили разом поверх «+375 » (автозаполнение, клавиатура)", () => {
  assert.equal(nextPhoneValue("+375 ", "+375 8 029 700-88-02", true), "+375 (29) 700-88-02");
  assert.equal(nextPhoneValue("+375 ", "+375 +375 29 700 88 02", true), "+375 (29) 700-88-02");
  assert.equal(nextPhoneValue("", "8 029 700-88-02", true), "+375 (29) 700-88-02");
});

test("мягкая маска: номер с 8 и 0 набирается как есть", () => {
  assert.equal(nextPhoneValue("8 029", "8 0291", true), "8 0291");
});
