# Global Engineering Playbook

Portable engineering standards for **Cursor / Claude Code / Codex** agents.

Drop this file into any project (typically `docs/PROJECT_IDEA.md` or `docs/ENGINEERING_STANDARDS.md`) and tell agents: **follow this playbook**.

**Audience:** React + TypeScript frontends in either mode:

- **Next.js App Router** (SSR/RSC, optional BFF Route Handlers)
- **Vite SPA** (fully client-rendered; frontend and backend deployed separately)

…with FastAPI / Node / Nest / similar backends. Detect the stack from the repo (`next.config.*` vs `vite.config.*`) and apply the matching rules. Soften or skip rules that do not apply.

**Keyword meanings**

| Keyword | Meaning |
|---|---|
| MUST | Non-negotiable. Violations are bugs. |
| SHOULD | Default. Deviate only with a documented reason. |
| SHOULD NOT | Avoid unless there is a clear, local justification. |
| NEVER | Forbidden — including “temporary” shortcuts. |

**Authority order**

1. Project hard constraints (`CLAUDE.md`, `.agile-v/`, security/policy files)
2. This playbook’s **§0 Project Overrides** (if present)
3. This playbook’s global body
4. General best practices / training data

---

## 0. Project Overrides — this repository only

When working in **github-growth-bot**, these override soft global defaults. Full detail: [`CLAUDE.md`](../CLAUDE.md).

1. MUST NEVER add artificial engagement (auto-star / auto-fork / auto-follow / metric inflation).
2. Every backend endpoint except `GET /api/health` MUST require `Authorization: Bearer <API_KEY>`.
3. Endpoint paths MUST NEVER contain `analytics`, `analysis`, `tracking`, `performance`, or `metrics` — use `insights` / `snapshots` / `benchmarks` / `runs`.
4. Browser MUST NEVER hold the backend API key — Next.js Route Handlers proxy server-side.
5. Frontend: SSR prefetch in `page.tsx`; `"use client"` only when required; NEVER `loading.tsx`; shell instant + data-slot skeletons.
6. Independent prefetches MUST use `Promise.all`; critical dehydrated queries MUST be `await`ed (never `void` + `dehydrate`).
7. CRUD MUST invalidate via TanStack Query + SSE (`LiveEventsProvider` / `use-live-events`) so all open tabs update without refresh.
8. Types MUST come from OpenAPI (`frontend/types/`) — never hand-duplicate DTOs.
9. Pipeline `Stage` contract + `db.rollback()` in runner exception paths are load-bearing.
10. LLM calls MUST go through `LLMRouter` (multi-provider fallback). External side effects MUST use draft-and-approve.
11. NEVER deploy without Gate 2 approval (POL-0006). NEVER commit secrets.
12. Build Agent does not self-verify — Red Team / fresh subagent review for non-trivial work.

---

## 1. Purpose — how agents MUST use this document

1. Before creating a component, hook, provider, context, utility, type, constant, service, repository, API route, query, mutation, validation, theme, style, layout, middleware, helper, or config, the agent MUST search the repository for an existing implementation.
2. If one exists, MUST reuse or extend it. Prefer extension over recreation. One architecture per project.
3. MUST NOT duplicate query keys, API clients, UI primitives, validation schemas, or fetch helpers.
4. Apply this playbook whenever the user asks for performance, scalability, clean code, fast UI, or “use project ideas / tricks / standards.”

---

## 2. Agent work protocol (MUST)

When asked to audit, fix, optimize, or implement features:

1. **Deep audit first** — read architecture, existing patterns, shared `lib` / hooks / providers / types / UI, CSS tokens, layout conventions. Ignore missing screenshots if not attached.
2. **Analyze & plan** — match the project’s workflow, folder layout, and style before writing code. Prefer the smallest change that meets the requirement.
3. **Implement** — reuse shared global pieces; keep TypeScript strict; cover realistic success/error/empty/loading cases.
4. **Instant UI consistency** — on any CRUD / mutation, invalidate (or precisely update) every affected cache so the **current page and all related pages/tabs** show fresh data immediately — **no full page refresh and no “navigate away to see it.”**
5. **Performance** — no request waterfalls, no duplicate fetches, no unnecessary client boundaries, no hydration breaks, no complicated logic when a simple pattern already exists.
6. **Do not delete product features** or large unrelated code to “clean up.” Only remove dead/unused code and debug logs in files you touch, when clearly unused.
7. **Comments** — add brief *why* comments for non-obvious implementation choices. Prefer code + comments over unsolicited essays in chat.
8. **NEVER** create unsolicited summary/changelog `.md` files unless the user explicitly asks.
9. **NEVER** leave the app slower, broken, or with hydrate mismatches to “optimize.”
10. **Verify** — lint, types, tests, loading/empty/error states, mobile/desktop as relevant before calling done.

### Token-efficient agent responses (SHOULD)

When the user did not ask for a long explanation:

- No filler intros/outros.
- Prefer surgical diffs / changed regions over dumping entire files.
- Explain why/how only when asked or when a decision is required.
- Prefer bullets over essays.

### Tooling hygiene (SHOULD)

- Shared instructions live in `CLAUDE.md` / this file.
- Personal prefs belong in local-only overrides (e.g. `CLAUDE.local.md`) — do not pollute shared rules.
- Prefer focused rules/commands/agents over one giant vague prompt.
- Use specialized subagents for review/security when the project protocol requires it.

---

## 3. Engineering philosophy

**Junior:** “Does my API work?”
**Senior:** “Will this survive traffic, failure, and scale?”

1. MUST leave the codebase cleaner than you found it.
2. MUST apply YAGNI, DRY, KISS.
3. SHOULD design for failure isolation (timeouts, fallbacks, typed errors, fallback UI).
4. MUST NOT invent infra (Redis, queues, sharding, service discovery) until measured need — unless the project already uses them.

---

## 4. Architecture concepts → practical rules

| Concept | Global rule |
|---|---|
| Caching | Follow §7 cache priority. Invalidate on every mutation. NEVER require full refresh to see updates. |
| Publish–Subscribe | Prefer SSE or WebSocket for live sync across tabs/views when multi-surface freshness matters. |
| API Gateway | Prefer BFF / Route Handlers / API gateway so secrets stay server-side. |
| Circuit breaker / fallback | For flaky third parties (esp. LLMs), MUST use ordered fallback or circuit behavior — no single-vendor hard fail. |
| Rate limiting | SHOULD protect auth, public, and LLM-heavy surfaces. |
| Reverse proxy vs load balancer | Reverse proxy: TLS, routing, security. Load balancer: distribute across instances. Configure the host (Coolify/Nginx/Traefik/Vercel); don’t reinvent in app code. |
| CDN | Static assets via CDN/platform defaults; optimize above-fold images. |
| Message queue | Use when async fan-out / retry isolation is required — not by default for simple CRUD. |
| Sharding / consistent hashing / auto-scaling / service discovery | SHOULD NOT until scale metrics demand it. |
| Load balancing | Keep app instances as stateless as practical; shared truth in DB (+ cache/SSE). |

---

## 5. Shared folder architecture (reuse first)

**Next.js App Router** (adapt names; do not invent parallel trees):

```
app/                 # routes, page.tsx, layouts, Route Handlers
components/          # feature UI + components/ui primitives
hooks/               # React Query hooks + shared utilities
providers/           # QueryClient, theme, live events, auth wrappers
lib/                 # API clients, fetch helpers, utils, query keys
types/               # generated or shared types (prefer OpenAPI)
schemas/ | validators/  # Zod (or equivalent) input validation
styles/ | (CSS tokens)  # consistent design tokens
```

**Vite SPA** (frontend package separate from backend):

```
src/
  app/ or pages/     # router entry, route modules (React Router / TanStack Router)
  components/        # feature UI + ui primitives
  hooks/
  providers/         # QueryClient, theme, auth, live events
  lib/               # api client (base URL), query keys, utils
  types/
  schemas/ | validators/
  styles/
```

Monorepo or sibling folders are fine (`frontend/` + `backend/`). MUST keep API contracts typed (OpenAPI) and MUST NOT duplicate business logic on both sides without a clear boundary.

Optional when complexity grows: `services/`, `repositories/`, `actions/`, `stores/`, `contexts/` — only if the project already uses them or a clear boundary needs them.

**Backend (typical):** routers/controllers → services → repositories/DB models → schemas/DTOs → tests per module.

---

## 6. Frontend modes: Next.js App Router vs Vite SPA

Detect the mode from the repo. Do **not** apply Next-only rules (RSC, `force-dynamic`, `dehydrate`) to a Vite SPA, and do **not** invent a Vite BFF when the project is Next with Route Handlers.

### 6.1 Shell-first UX (BOTH modes)

1. MUST render shell immediately: nav, header, titles, labels, icons, buttons, card frames, tabs.
2. MUST skeleton **only** data regions (lists, tables, charts, stats) with geometry matching final content (no CLS).
3. Keep headings visible; pulse only the data slot.
4. Prefer semantic icons (e.g. `lucide-react`) on titles/actions when the design system uses them.
5. Goal: click → chrome stays; data fills without blanking the layout.

### 6.2 Next.js App Router (SSR / RSC)

1. MUST default to Server Components.
2. MUST put SSR data-fetching / prefetch in `page.tsx` (or colocated Server Components).
3. MUST add `"use client"` only for interaction, browser APIs, animations, forms, drag-and-drop, or client-only state.
4. NEVER add `"use client"` “just in case.”
5. Per-user / session dashboards SHOULD use `force-dynamic` (or equivalent). Perceived speed comes from cache + skeletons + SSE — not fake static HTML.
6. NEVER add route-level `loading.tsx` that replaces the whole page shell on client navigation (unless the project explicitly standardized on it).
7. Keep shared `layout.tsx` mounted across sibling routes.
8. Use Next `<Link>` for prefetchable navigation; NEVER fake nav with `<button>`/`<div>`.
9. Warm React Query via SSR `dehydrate` / `HydrationBoundary` (see §7).
10. Secrets (API keys) MUST stay in Route Handlers / server — browser NEVER holds backend service keys.

### 6.3 Vite SPA + separated backend

Use when `vite.config.*` exists and the UI is a client SPA talking to an API on another origin/port (e.g. Vite `:5173` + FastAPI `:8000`).

1. There is **no** RSC / `page.tsx` SSR / `HydrationBoundary` dehydrate path — skip §7 Next hydrate rules; use §7.2 SPA prefetch instead.
2. MUST treat frontend and backend as separate deployables (separate Docker images / hosts / env files).
3. MUST configure CORS on the backend for the Vite origin(s); frontend MUST use an explicit `VITE_*` (or equivalent) API base URL.
4. Auth for SPAs:
   - Prefer httpOnly secure cookies (same-site or properly configured cross-site) **or** short-lived tokens in memory — NEVER long-lived secrets in `localStorage` without a reviewed threat model.
   - Browser MUST NEVER embed server-only service API keys (e.g. private LLM keys, admin master keys). User session tokens are different from service keys.
5. MUST use a single typed API client in `lib/` (`fetch`/`axios` + OpenAPI types). Pages/hooks MUST NOT scatter raw `fetch(baseUrl + …)` strings.
6. Router: React Router or TanStack Router — keep a persistent layout route so nav/shell does not remount on every child navigation.
7. Use router `<Link>` (or equivalent); NEVER `<button onClick={() => navigate()}>` for normal navigational links.
8. Instant nav: layout stays mounted; React Query cache makes back/forward and revisit feel instant; optimistic mutations + SSE/WS for multi-tab.
9. Dev proxy (SHOULD): Vite `server.proxy` to the backend to avoid CORS pain in local dev; production still uses real API URL + CORS.
10. Code-split route modules (`React.lazy` / router lazy) for large apps; prefetch next route data with TanStack Query when hovering/focusing links if it helps.
11. Env: only `VITE_`-prefixed (or project-standard) public vars in the client bundle; document required vars in `.env.example`.
12. Deploy: static assets to CDN/object storage/Nginx; API separately. SPA fallback MUST route unknown paths to `index.html` for client routing.

```ts
// GOOD — Vite env + shared client
const api = createClient(import.meta.env.VITE_API_URL);
```

```ts
// BAD — hard-coded prod URL + service key in the SPA
fetch("https://api.example.com/admin", {
  headers: { Authorization: "Bearer sk_live_..." },
});
```

### 6.4 Instant navigation / perceived latency (BOTH)

1. Prefer optimistic mutations; roll back on failure.
2. Do not block the entire transition on one slow below-fold query.
3. Parallelize independent fetches with `Promise.all`.
4. Optional View Transitions — polish, not a substitute for correct caching.

---

## 7. Prefetch contracts

### 7.1 Next.js + dehydrate (critical)

When using TanStack Query + `dehydrate` + `HydrationBoundary`:

1. Critical above-fold queries that are dehydrated MUST be `await`ed (usually via `Promise.all`).
2. NEVER `void queryClient.prefetchQuery(...)` for a query included in `dehydrate(...)`. Empty dehydrated cache → client refetch → skeleton flash → broken SSR intent.
3. Below-fold / optional queries MAY use `void prefetch` only when **not** dehydrated; client fetches on mount/visibility.
4. Independent prefetches MUST run in parallel (`Promise.all`). NEVER sequential-await independent work.
5. If B depends on A, await A, then prefetch B.
6. Fix waterfalls and payload size before blaming `force-dynamic`.

```tsx
// GOOD — parallel critical prefetches, then dehydrate
await Promise.all([
  queryClient.prefetchQuery(queryA),
  queryClient.prefetchQuery(queryB),
]);
return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <PageClient />
  </HydrationBoundary>
);
```

```tsx
// BAD — waterfall
await queryClient.prefetchQuery(queryA);
await queryClient.prefetchQuery(queryB);
```

```tsx
// BAD — void + dehydrate
void queryClient.prefetchQuery(queryA);
return <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>;
```

### 7.2 Vite SPA prefetch (no SSR dehydrate)

1. Initial route: fetch in parallel on mount via React Query (`useQueries` / multiple `useQuery` with shared keys) — shell renders first; data slots skeleton.
2. SHOULD prefetch on intent: `queryClient.prefetchQuery` in link `onMouseEnter` / `onFocus` / router loaders (TanStack Router) for likely next screens.
3. Router loaders MUST still not block painting the shell — return cached data if present; otherwise show route shell + skeletons.
4. Independent fetches MUST use `Promise.all` / `useQueries`.
5. There is no `HydrationBoundary` requirement — do not copy-paste Next dehydrate patterns into Vite.

---

## 8. Cache strategy, TanStack Query, and CRUD sync

### 8.1 Cache priority

1. **React Query (or equivalent) memory cache** — primary UX cache (both Next and Vite)
2. **SSR dehydrate / HydrationBoundary** — Next.js first paint with data (skip on Vite SPA)
3. **Redis / server cache** — only when shared across instances or expensive reads justify it
4. **Database** — source of truth

**localStorage / sessionStorage**

- SHOULD for non-sensitive UI prefs (theme, dismissed banners); on Next, use SSR-safe guards.
- NEVER store service API keys or long-lived secrets in localStorage without a reviewed threat model.
- Do not use localStorage as a substitute for React Query server state.

**Redis**

- Introduce when multi-instance, expensive aggregation, or rate-limit/session needs exist.
- MUST invalidate or TTL-expire Redis keys on writes that affect cached reads.

### 8.2 Query rules

1. MUST use a single stable `queryKeys` (or equivalent) module — never ad-hoc string keys in components.
2. SHOULD set `staleTime` / `gcTime` / `retry` / `enabled` deliberately (avoid refetch thrash; avoid lying forever-fresh).
3. SHOULD use `select` / `placeholderData` / `keepPreviousData` (or `placeholderData: keepPreviousData`) to reduce flicker on pagination/filter changes.
4. Prefer one fetch per resource per view — no duplicate hooks fighting each other.

### 8.3 Mutation / CRUD invalidation checklist (MUST)

Every create/update/delete (and any side-effecting action) MUST update UX immediately without full refresh:

1. Optimistic update where it helps UX, with defined rollback
2. Invalidate or precisely patch **all** affected query keys
3. Current page UI
4. Related list / detail / sibling routes that show the same entity
5. Sidebar counts / badges / tabs counts
6. Dashboard cards / charts fed by that data
7. Pagination and search/filter result caches
8. Any Redis (or other) server cache keys for that resource
9. Broadcast via SSE/WebSocket (if the project has realtime) so **other browser tabs** sync
10. NEVER rely on `location.reload()` or “tell the user to refresh” as the primary mechanism
11. NEVER leave infinite skeletons on error — toast + rollback + error/empty UI

### 8.4 Client-side normalization

- Default: keep server entities in React Query keyed by id; compose in selectors.
- Full normalized client DB (e.g. TanStack DB / Relay-style) SHOULD only appear for long sessions with heavily shared, frequently updated entity graphs.
- Benefit: one user update reflects in every post/card referencing that user; smaller memory; integrity.
- Do not add normalization mid-feature without an explicit need.

### 8.5 Client Mutation Cache Gateway (MUST for list CRUD)

Invalidate-only is **not** enough when soft-nav / Back remounts with SSR `initialData` or a thin cache. Every list-shaped mutation domain SHOULD go through one gateway:

1. **Snapshot** related list baselines from `QueryClient` (sibling rows survive races).
2. **`await` invalidate** — mark domains stale; prefer `invalidateQueries` / `refetchType: "active"`. SHOULD NOT blank inactive lists with `removeQueries` unless densify immediately reseeds them.
3. **Densify** — `setQueryData` / `setQueriesData` on list, detail, badge, and related entity keys (active **and** inactive).

Navigation stays instant: densify is in-memory; no login-time fetch-all waterfall; no Redis business-data cache required. Example names in mature repos: `commitMutationCache`, a densify adapter registry per mutation domain. Cross-tab: BroadcastChannel / SSE for invalidation events (no claiming cross-device realtime without WS/SSE infra).

See also: portable RQ deep-dive in [`REACT_QUERY_SETUP_GUIDE.md`](./REACT_QUERY_SETUP_GUIDE.md) §4.6.

### 8.6 Densify failure modes (battle card)

| Symptom | Likely root cause | Fix |
|---|---|---|
| Soft-nav empty list / badge 0 after delete or last-item approve | Densify wrote `[]` or never seeded; remount shows thin cache | Densify related keys after invalidate; upsert into public/detail lists when actor never had the row |
| Empty list then SSR re-fills deleted rows | RQ ignores later `initialData` wrongly **or** unmarked `[]` healed from stale RSC | Mark intentional densify-empty; prefer marked `[]` over stale SSR; heal unmarked poison with non-empty SSR |
| Soft-nav still shows old row after edit | Update densify only mapped mounted keys; admin/queue never mounted | Seed queue from detail/public cache + book/resource meta when list baseline missing |
| Correct data → flash wrong → correct again | Active refetch paints join; then densify stomps with weak actor | Prefer post-invalidate / mutation response fields over session placeholders |
| Approver / “by X” shows emptyLabel forever | Densify wrote UI placeholder (`"an admin"`, `"Unknown"`) into cache | NEVER persist emptyLabels; see §8.7 |
| Prefetch then soft-nav shows pre-write queue | Prefetch `staleTime` 30s treats densified/stale data as fresh | Use `staleTime: 0` on write-hot queues; warm after invalidate |
| Mutation OK but attribution missing until refresh | API returns ids/status only | Return joined actor name/email/avatar on mutation response |
| Debug log empty while bug reproduces | CSP `connect-src 'self'` blocks browser→`127.0.0.1` ingest | Curl ingest or temporary same-origin relay; empty log ≠ no bug |

### 8.7 Attribution / actor densify (MUST)

When UI shows “Approved by / Reviewed by / Decided by”:

1. NEVER write PersonAttribution (or similar) **emptyLabel** strings into TanStack cache.
2. Resolve actor for densify in this order: SSR DB actor (`currentAdmin` / decisionActor) → mutation response join fields → post-invalidate joined row → session name/email/card.
3. Session often lacks avatar/card and can be briefly `null` (incognito / SessionProvider lag) — treat as weak, not authoritative.
4. EmptyLabel remains **display-only** when person is truly null.

### 8.8 Prefetch + soft-nav (SHOULD)

1. Intent-prefetch on hover/focus for list routes (fire-and-forget `prefetchQuery`).
2. Entity title links that densify owns: `prefetch={false}` on Next `<Link>` when RSC prefetch would race stale shells; warm RQ yourself.
3. After write-heavy domains, hot queue prefetches SHOULD use `staleTime: 0`.
4. Soft-nav to a resource detail: warm **detail + related lists** together (e.g. resource + its comments/reviews).
5. Preserve SSR `initialData` / `initialDataUpdatedAt` patterns; densify must not invent empty success data that blinds later SSR.

*Lessons distilled from university-library densify closeout (2026-08); portable to any Next/Vite + TanStack Query app.*

---

## 9. Realtime (SSE / WebSocket)

If the project has live updates:

1. MUST wire a single provider/hook at the app shell so authenticated surfaces subscribe once.
2. MUST map each event type to the correct query invalidations (parity — e.g. “job finished” also refreshes derived lists).
3. SHOULD NOT poll when SSE/WS already covers the event.
4. Next.js: proxies MUST keep secrets server-side and use dynamic/streaming-friendly route config.
5. Vite SPA: connect EventSource/WebSocket to the API origin (or path proxied in dev); MUST send auth the same way as normal API calls (cookies or authorized URL/handshake). CORS and cookie `SameSite` MUST be correct for cross-origin SSE.

If the project has no realtime yet: invalidate on the mutating client is the minimum bar; add SSE when multi-tab / multi-user freshness matters.

---

## 10. React performance

### 10.1 Memoization (React Compiler era)

1. React Compiler SHOULD replace most manual `useMemo` / `useCallback` / `memo`.
2. SHOULD NOT wrap everything “for performance.”
3. MAY memoize when profiling proves identity or expensive work is the bottleneck.
4. NEVER ban memoization as dogma; NEVER require it as boilerplate.

### 10.2 Async concurrency

- Independent → MUST `Promise.all` (or equivalent).
- Dependent → sequential await only for the dependency chain.
- NEVER turn independent work into a waterfall.

### 10.3 NEVER introduce

- Request waterfalls
- Duplicated fetching / duplicated client state mirroring the query cache
- Unnecessary `"use client"` or hydration of huge trees (Next)
- Remounting the whole app shell on every SPA route change (Vite)
- Blocking the whole page on one non-critical slow query
- Layout shift from mismatched skeletons
- Giant client bundles (code-split routes; keep server-only logic on the backend)

### 10.4 Utility hooks catalog (implement once per repo)

Prefer small shared hooks in `hooks/` (~150 lines total), not a new dependency (SSR-safe when on Next):

| Hook | Purpose |
|---|---|
| `useDebounce` | Stop hammering APIs on every keystroke |
| `usePrevious` | Compare prior value without render loops |
| `useLocalStorage` | SSR-safe persisted UI prefs (not secrets) |
| `useMediaQuery` | Responsive behavior beyond CSS alone |
| `useAbortController` | Cancel in-flight requests on unmount; prevent races |

Search before recreating.

---

## 11. Error handling

1. NEVER swallow errors silently.
2. Async boundaries SHOULD surface: typed error → user-visible toast or inline error → optional retry → fallback UI.
3. Use `try` / `catch` / `finally` where cleanup matters (abort, locks, loading flags).
4. MUST clear loading flags in `finally` (or equivalent) — NEVER spin forever.
5. Prefer discriminated union / Result types over thrown `any`.
6. Log enough for ops (without secrets); show humans actionable messages.

---

## 12. TypeScript standards

1. MUST use strict TypeScript.
2. NEVER use `any`. Prefer `unknown` and narrow.
3. SHOULD prefer `satisfies`, `readonly`, and discriminated unions.
4. Greenfield / when practical: SHOULD enable stricter flags such as `exactOptionalPropertyTypes`, `noImplicitOverride`, `noUncheckedIndexedAccess`.
5. Prefer generated API types (OpenAPI) over hand-copied DTOs.
6. SHOULD NOT blanket-disable ESLint/TS rules.
7. Backend frameworks: always declare response schemas so clients stay typed.

---

## 13. UI / UX standards

Aligned with Vercel Web Interface Guidelines (and similar):

1. Stable skeletons matching final layout.
2. Short show-delay (~150–300ms) and minimum visible time for loaders when flicker would occur.
3. Links are links (`<Link>` / `<a>`).
4. Deep-link filters, tabs, pagination, expanded panels when shareability matters (`nuqs` or URL search params).
5. Desktop autofocus for a single primary field; avoid mobile autofocus that opens keyboard and shifts layout.
6. Enter submits when it is the clear primary action.
7. Don’t silently block keystrokes — validate and explain.
8. Preload above-fold images; lazy-load the rest.
9. Accessible names even when labels are visually hidden.
10. Empty / loading / error for every data region.

Skeleton **data** only — NEVER skeleton nav, sidebar, header, breadcrumbs, tabs, primary buttons, page title, or layout shell.

Keep CSS consistent: shared tokens, spacing scale, one component library style — no one-off snowflake layouts for the same pattern.

---

## 14. API and backend standards

1. Auth on protected routes; secrets server-side.
2. Typed request/response DTOs; validate inputs (Zod/Pydantic/etc.).
3. Transactions for multi-row atomic writes.
4. Pagination (cursor when lists grow).
5. Avoid N+1; batch; use indexes and connection pooling.
6. Idempotency for retried mutating endpoints as the product grows.
7. Consistent error shapes.
8. Rate limit / compress / ETag or cache headers where beneficial.
9. OpenAPI (or equivalent) kept in sync with reality.
10. Multi-tenant: scope every query by tenant/user; prefer 404 over existence-leaking 403 when that is the project rule.
11. Separated Vite SPA: MUST set CORS allowlist for frontend origins; SHOULD support credentials correctly if cookie auth; health check unauthenticated only when intentional.

---

## 15. Docker and deployment

1. MUST copy dependency manifests first, install, then copy source (layer cache).
2. MUST use multi-stage builds for production when applicable.
3. SHOULD use slim/alpine bases.
4. CI SHOULD use lockfile-faithful installs (`npm ci`, pinned pip, etc.).
5. Production images SHOULD NOT ship unused build tooling, secrets, or unnecessary source.

```dockerfile
# GOOD
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

```dockerfile
# BAD — any code change busts dependency cache
COPY . .
RUN npm install
```

Never commit secrets. Follow the project’s deploy playbooks and human gates.

---

## 16. Modern stack toolbox (SHOULD try when it fits)

Not mandatory installs — use when the problem matches. Prefer what the repo already chose.

| Tool / pattern | Use when |
|---|---|
| TanStack Query | Server state, cache, mutations (SSR hydrate on Next; client cache on Vite) |
| Zod (or equivalent) | Runtime validation at boundaries |
| OpenAPI → `openapi-typescript` | End-to-end typed clients across separated FE/BE |
| `nuqs` / URL state | Shareable filters/tabs/pagination |
| lucide-react + shadcn/Base UI | Consistent accessible UI primitives |
| SSE or WebSocket | Multi-tab / live invalidation |
| React Compiler | Default memoization without boilerplate |
| Next.js App Router RSC | SSR/server UI; client only when needed |
| Vite + React Router / TanStack Router | SPA with separated backend |
| Vite `server.proxy` | Local dev without CORS friction |
| View Transitions | Optional navigation polish |
| Vitest + Testing Library | Unit/component tests |
| Playwright | E2E critical flows |
| Docker multi-stage + alpine | Fast, small deploys (separate images for SPA static + API) |
| Multi-provider LLM router | Resilience; avoid vendor lock-in |
| MCP + specialized subagents | Agent tooling, review, security |
| Redis | Shared cache / rate limits / sessions at scale |
| Cursor pagination | Large lists |

**Stack loyalty:** stay on the repo’s chosen mode (Next **or** Vite SPA). Do not migrate Next ↔ Vite or to alternate RSC models (e.g. TanStack Start) without an explicit project decision.

---

## 17. Performance and latency budget

1. Optimize **perceived** paint: shell first, data second.
2. Parallelize independent I/O everywhere (server and client).
3. Measure before micro-optimizing (Profiler, Network, Lighthouse, backend query plans).
4. Watch CLS, LCP, INP; stable skeletons; avoid font/layout jumps.
5. Keep client JS lean — push secrets and heavy work to the backend; on Vite, code-split routes.
6. DB: indexes, pooling, no N+1, pagination.
7. Images: correct sizes, modern formats, lazy below fold.
8. Cache with honest TTLs; invalidate on write.
9. Separated FE/BE: measure API latency and payload size — SPA perceived speed is dominated by network + cache discipline.

---

## 18. Agentic AI and LLM product rules

### 18.1 What is agentic

| Not agentic | Agentic |
|---|---|
| Single-shot chatbot Q&A | Plans, uses tools, remembers, adapts |
| Fixed RPA scripts | Feedback loops + human-in-the-loop |
| Simple RAG answers only | Multi-step tool use with escalation |

### 18.2 RAG vs CAG

- **RAG:** retrieve dynamic/changing context per query.
- **CAG:** keep stable policies/docs in cached model/KV context.
- Combined: cache static; retrieve dynamic.
- Do not build vector infra unless a requirement needs it.

### 18.3 Product LLM usage

1. MUST keep providers swappable (router / gateway).
2. MUST NOT hard-wire the product to one vendor’s proprietary API shape without an abstraction.
3. Human gates for irreversible external actions (publish, pay, delete, message).
4. Coding agents: implementer ≠ verifier; use review/security subagents when protocol requires.

---

## 19. Clean code and Definition of Done

### 19.1 Clean code (MUST)

1. Separation of concerns
2. Comment *why*, not *what*
3. DRY
4. KISS
5. TDD where the project standard requires it (esp. backend)
6. YAGNI

### 19.2 Definition of Done

Every non-trivial change MUST verify as applicable:

- Lint + TypeScript
- Tests
- Build (when release-adjacent)
- Next: SSR/hydration correct (no void+dehydrate mistake); Vite: no remounting shell, CORS/env correct
- Accessibility of new interactive UI
- Loading / empty / error states
- Mobile + desktop
- Theme/dark mode not broken
- Security (no secrets, auth, no cross-tenant leaks)
- Mutation invalidation covers current + related views (+ SSE if present)
- No new dead code or debug logs left behind
- Dependencies: no ignored high CVEs at milestone close

---

## 20. Quick reference card

| Topic | Rule |
|---|---|
| Reuse | Search repo before creating anything |
| Stack | Detect Next vs Vite SPA; apply matching rules only |
| Shell UX | Instant shell; skeleton data only; avoid blanking chrome |
| Navigation | Router `<Link>` + layout stay mounted + warm RQ cache |
| Prefetch (Next) | `await Promise.all` + dehydrate; never `void` + dehydrate |
| Prefetch (Vite) | Parallel `useQuery` / intent `prefetchQuery`; no dehydrate copy-paste |
| CRUD | Optimistic + invalidate all related keys + SSE/tabs; no full refresh |
| Gateway densify | Snapshot → await invalidate → setQueryData related keys (active+inactive) |
| Densify-empty | Mark intentional `[]`; do not let stale SSR reseed deletes |
| Actor densify | Never cache UI emptyLabels; prefer SSR/API join over session |
| Prefetch after write | Hot queues `staleTime: 0`; warm detail + related lists |
| Debug ingest | CSP may block browser→localhost; empty log ≠ no bug |
| Cache | RQ → (SSR hydrate if Next) → optional Redis → DB |
| Secrets | Never put service keys in the SPA bundle |
| Types | Strict; no `any`; prefer generated DTOs |
| Errors | Typed + toast + retry + fallback; never hang loading |
| Memo | Compiler first; manual only when profiled |
| Agents | Audit → plan → implement; no unsolicited summary `.md` |
| Deploy | Layer-cached Docker; separate SPA static + API when split; no secrets |

When in doubt: match the nearest existing route module, hook, provider, and UI primitive in the repo — then tighten toward this playbook.
