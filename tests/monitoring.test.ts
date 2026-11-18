import assert from "node:assert/strict";
import { after, test } from "node:test";
import handler from "../api/monitoring.ts";
import netlifyHandler from "../netlify/functions/monitoring.ts";

const originalFetch = globalThis.fetch;
const originalUrl = process.env.SENTRY_INGEST_URL;
after(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.SENTRY_INGEST_URL;
  else process.env.SENTRY_INGEST_URL = originalUrl;
});

test("monitoring tunnel enforces methods and handles disabled configuration", async () => {
  delete process.env.SENTRY_INGEST_URL;
  assert.equal((await handler(new Request("https://example.test/api/monitoring"))).status, 405);
  assert.equal((await handler(new Request("https://example.test/api/monitoring", { method: "POST" }))).status, 204);
  assert.equal((await netlifyHandler(new Request("https://example.test/api/monitoring", { method: "POST" }))).status, 204);
});

test("monitoring tunnel forwards envelopes and upstream backoff headers", async () => {
  process.env.SENTRY_INGEST_URL = "https://sentry.test/api/1/envelope/?existing=1";
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "https://sentry.test/api/1/envelope/?existing=1&sentry_key=test");
    assert.equal(await new Response(init?.body).text(), "envelope");
    return new Response(null, { status: 429, headers: { "Retry-After": "30", "X-Sentry-Rate-Limits": "60:error" } });
  };
  for (const tunnel of [handler, netlifyHandler]) {
    const response = await tunnel(new Request("https://example.test/api/monitoring?sentry_key=test", {
      method: "POST", body: "envelope", headers: { "Content-Type": "application/x-sentry-envelope" },
    }));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "30");
    assert.equal(response.headers.get("x-sentry-rate-limits"), "60:error");
  }
});

test("monitoring tunnel rejects oversized bodies without forwarding", async () => {
  process.env.SENTRY_INGEST_URL = "https://sentry.test/api/1/envelope/";
  globalThis.fetch = async () => { throw new Error("oversized envelope was forwarded"); };
  for (const tunnel of [handler, netlifyHandler]) {
    const response = await tunnel(new Request("https://example.test/api/monitoring", {
      method: "POST", body: new Uint8Array(5 * 1024 * 1024 + 1),
    }));
    assert.equal(response.status, 413);
  }
});
