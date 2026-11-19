# Vercel Production Guardrails — Reusable Playbook

Use this guide as an entry point for assessing an existing project. It supports plain HTML/CSS/JavaScript, React/Vite, Next.js, Node.js APIs, and Python applications. Apply only the guidance relevant to the actual repository, runtime, hosting plan, and product. No playbook can guarantee that an application will never exceed a quota or be misclassified by a security system.

Companion guides: [plain static JavaScript](./VERCEL-PLAIN-JS-DEPLOY.md) and [optional Next.js remote-image fallback](./SAFE_IMAGE_REUSABLE_COMPONENT.md).

## 1. Discover before changing

1. Read project instructions and existing Agile V state where present; reconcile them with the source and preserve unrelated work. Follow the user's approved scope and available workflow, rather than inventing commands or gates.
2. Inspect manifests, lockfiles, build scripts, routes, static assets, platform configuration and deployment settings. Detect the stack from evidence: static files, Vite, Next.js, Node handlers, Python manifests and WSGI/ASGI entrypoints. A repository may contain more than one stack.
3. Inventory domains, environment variable **names**, routing, scheduled work, data stores, integrations, authentication, and external services. Do not print or copy secret values. Frontend-visible variables such as `VITE_*` and `NEXT_PUBLIC_*` are public, not secret storage.
4. Record relevant performance, request and transfer metrics by project, route and asset when available. A spike alone does not establish bots, hotlinking or any other cause. Distinguish measured facts, hypotheses and missing evidence.
5. Prepare a scoped plan. Preserve framework defaults and working behavior; use Preview and a rollback plan before production changes. Follow the repository's approval requirements.

## 2. Choose the matching deployment model

| Project | Build and runtime | Routing and local verification |
| --- | --- | --- |
| Plain static HTML/CSS/JS | Vercel can serve static files without a build. Use a build only when the site needs one. | Preserve real pages and assets; add an SPA fallback only for actual client-side routing. See the companion guide. |
| React/Vite | Use the existing package manager, lockfile, build command and detected output directory, commonly `dist`. Static frontend output does not itself require a server runtime. | Add an SPA fallback only when client-side routes need it. If separate Vercel Functions exist, use the appropriate platform emulator or preview; Vite alone does not serve them. |
| Next.js | Keep the project's supported Next/React/Node versions and hosting mode. Verify whether pages are static, dynamic, revalidated or exported. | Preserve App/Pages Router behavior, framework caching, metadata and deep links; review image optimization only if used. |
| Node.js API or server | Check the framework's supported deployment model, entrypoint, request limits and actual Node version. | Preserve API clients, methods, authorization, webhooks and timeouts. Browser challenges are not suitable as universal API protection. |
| Python API or server | Detect Flask, FastAPI, Django, or another framework; check current Vercel support, runtime version, entrypoint, package manager and native dependencies. | Confirm ASGI/WSGI compatibility, local commands, static assets and preview behavior; do not assume a Node-specific server or configuration. |

References: [Vercel builds](https://vercel.com/docs/builds), [Vite](https://vercel.com/docs/frameworks/frontend/vite), [FastAPI](https://vercel.com/docs/frameworks/backend/fastapi), [Flask](https://vercel.com/docs/frameworks/backend/flask), [Python runtime](https://vercel.com/docs/functions/runtimes/python).

## 3. Static assets, images and transfer

- Measure transferred bytes and requests by path before choosing a fix. A CDN cache hit still delivers bytes to visitors; browser caching may reduce repeat transfers but cannot eliminate first visits or abusive traffic.
- Use long-lived `immutable` caching only for URLs whose contents never change, such as content-hashed bundles. Vite `public` files may be copied unchanged into `/assets/`; therefore **do not apply a blanket immutable rule to `/assets/*`** without verifying every matching URL is versioned. Check actual response headers and framework defaults first. [Cache guidance](https://vercel.com/docs/caching/cache-control-headers)
- Keep HTML and mutable, unversioned assets appropriately revalidatable. Verify changed assets update after deployment, including a repeat browser visit.
- Right-size and compress images and video, preserve dimensions, lazy-load below-the-fold media where appropriate, and avoid unnecessary autoplay or repeated requests. Validate visual quality and accessibility. No such optimization can guarantee protection from repeated downloads.
- For Next.js, assess `next/image` source restrictions, `sizes`, transforms, plan limits and accessibility. Use the companion fallback only when there is a demonstrated need and its security and privacy tradeoffs are acceptable. Other stacks should use their existing image handling.

## 4. Security and abuse controls

- Keep secrets on the server; never expose them through browser bundles, logs, examples or screenshots. Public APIs require their own validation, authorization and abuse controls even if keys are server-side.
- Use platform firewall features when available and appropriate to the plan. Inspect traffic first; test narrowly scoped **Log**, challenge or rate-limit rules on Preview where possible. Monitor false positives and verify browsers, accessibility tools, crawlers, API clients and integrations. JavaScript challenges can block legitimate traffic; Attack Mode is an incident tool, not a universal default. [Vercel WAF](https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules)
- Security headers must match the application: assess `nosniff`, referrer policy, frame protection, CSP and permissions against embeds and integrations; avoid conflicting settings. Add HSTS only after HTTPS and all affected subdomains are ready.
- `robots.txt` is voluntary crawler guidance, not access control. Do not assume a disallow rule prevents abuse. If a page needs `noindex`, ensure crawlers can access the directive; blocking the same URL in robots can prevent them from seeing it.
- For authenticated systems, use established framework/session mechanisms, server-side authorization, CSRF defenses where applicable, secure cookies, and appropriate password hashing. Skip auth features for anonymous sites unless required. Never invent custom cryptography.
- Protect expensive endpoints using appropriate authentication, input and body limits, quotas and rate limiting. Per-process counters are not a reliable global limit in distributed/serverless deployments; use a suitable shared mechanism or platform control when needed. Never implement artificial sleep as protection.
- Review optional monitoring for personal data, session replay masking, source-map publication, retention and public tunnel abuse. A disabled DSN does not prove all deployed integrations are disabled; verify configuration without exposing values.
- Demos imitating real products or brands can be mistaken for official sites. Make their independent educational purpose clear in the visible UI, avoid misleading purchase/login flows, review rights to assets and platform policies, and treat warnings or complaints as incidents for investigation—not proof of a specific cause.

## 5. Runtime and dependency maintenance

- Identify each actual build and server runtime. Consult current platform-supported and upstream-supported releases before choosing versions. Pin a compatible Node major where the project uses Node; choose Python independently where Python is used. A static HTML site may need neither runtime in production.
- Preserve lockfiles and existing package managers. Review applicable advisories, compatibility and migration notes; test targeted upgrades. Use the appropriate audit tool for the stack and report unresolved risks. A clean dependency audit does not certify the runtime or application as secure.
- Keep production logs useful and free of secrets or unnecessary personal data; remove only temporary diagnostics introduced by the task. Do not suppress warnings without understanding them.

## 6. Migration and incident checklist

1. Inventory each project's repository, ownership, domains, provider settings, dependencies, redirects, schedules, variables (names only) and usage. Verify account/plan eligibility with the provider; do not assume separate accounts are permitted for any particular quota arrangement.
2. Build and test a small representative sample locally and on Preview. Check direct and deep links, refresh, assets, browser errors, SEO metadata, integrations, accessibility and realistic mobile/desktop behavior. Preserve existing domain ownership; verify DNS and TLS before changing traffic, and document rollback.
3. Compare request and transfer trends after release using available provider metrics. Keep important projects isolated from experimental deployments where permitted and practical; each provider's quotas and suspension policies differ.
4. On a spike, identify the affected project, paths, response bytes, sources, user agents and cache behavior if available. Avoid claiming a cause from aggregate charts. Use proportionate reversible mitigations, retest legitimate access, and contact the provider when evidence is insufficient.
5. Record what was tested, observed, unavailable and still open. A local build, a clean audit or a preview is not proof of live production behavior. Follow applicable user and repository approval requirements for external changes.

## 7. Reuse with Agile V and custom commands

When these guides are supplied with `/implement-deep`, `/verify-deep`, `/review-security`, `/commit-ready`, or an existing Agile V protocol, follow the actual instructions available in that project and the user's authorized scope. Inspect first, establish requirements and risks, implement only approved changes, independently verify where supported, document evidence and limits, and preserve unrelated work. Do not treat the mere presence of this guide as authorization to change a dashboard, deploy, push, merge, send messages, or alter a production service.
