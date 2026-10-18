import { test } from "node:test";
import assert from "node:assert/strict";
import { retryOnce } from "./retry.ts";

test("успех с первого раза: одна попытка", async () => {
  let calls = 0;
  const result = await retryOnce(async () => {
    calls++;
    return "ok";
  }, 1);
  assert.equal(result, "ok");
  assert.equal(calls, 1);
});

test("первая попытка упала, вторая прошла: заявка не теряется", async () => {
  let calls = 0;
  const result = await retryOnce(async () => {
    calls++;
    if (calls === 1) throw new Error("холодный старт");
    return "ok";
  }, 1);
  assert.equal(result, "ok");
  assert.equal(calls, 2);
});

test("обе попытки упали: ошибка второй, повторов больше нет", async () => {
  let calls = 0;
  await assert.rejects(
    retryOnce(async () => {
      calls++;
      throw new Error(`сбой ${calls}`);
    }, 1),
    /сбой 2/,
  );
  assert.equal(calls, 2);
});
