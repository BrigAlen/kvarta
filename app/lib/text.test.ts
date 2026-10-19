import { test } from "node:test";
import assert from "node:assert/strict";
import { hasLetter } from "./text.ts";

test("в имени нужна хотя бы одна буква", () => {
  assert.equal(hasLetter("111"), false);
  assert.equal(hasLetter("  - 7 "), false);
  assert.equal(hasLetter("Аня"), true);
  assert.equal(hasLetter("Anna"), true);
  assert.equal(hasLetter("Ёжик 2"), true);
  assert.equal(hasLetter("A1"), true);
});
