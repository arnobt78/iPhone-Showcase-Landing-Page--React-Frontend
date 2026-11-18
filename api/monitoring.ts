// Vercel Edge: tunnel for Sentry. Set SENTRY_INGEST_URL (e.g. https://xxx.ingest.us.sentry.io/api/yyy/envelope/) to enable.
export const config = { runtime: "edge" };

// Bound memory and upstream traffic even when Content-Length is missing or incorrect.
const MAX_ENVELOPE_BYTES = 5 * 1024 * 1024;

/** Forwards Sentry envelope POST to ingest when SENTRY_INGEST_URL is set; otherwise 204 so the route doesn't error. */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }
  const ingestUrl = process.env.SENTRY_INGEST_URL;
  if (!ingestUrl) {
    return new Response(null, { status: 204 });
  }
  const declaredSize = Number(request.headers.get("content-length"));
  if (declaredSize > MAX_ENVELOPE_BYTES) {
    return new Response(null, { status: 413 });
  }
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_ENVELOPE_BYTES) {
        await reader.cancel();
        return new Response(null, { status: 413 });
      }
      chunks.push(value);
    }
  }
  const sentryUrl = new URL(ingestUrl);
  new URL(request.url).searchParams.forEach((value, key) => {
    sentryUrl.searchParams.append(key, value);
  });
  const contentType = request.headers.get("content-type") ?? "";
  const res = await fetch(sentryUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: new Blob(chunks),
  });
  const responseHeaders = new Headers();
  // Preserve Sentry's backoff instructions so clients do not retry aggressively.
  for (const name of ["retry-after", "x-sentry-rate-limits"]) {
    const value = res.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  return new Response(res.body, { status: res.status, headers: responseHeaders });
}
