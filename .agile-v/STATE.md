# Current state

## C2 motion update

- Stage: local implementation and independent verification complete; Gate 1 and Gate 2 approved; scoped evaluation ER-C2-20261119-LOCAL passed. Active requirements: REQ-0012 through REQ-0015.
- Completed: responsive hero loops only while visible; reduced motion and autoplay failure use a poster. The active 3D view rotates slowly, pauses during interaction and keeps its camera angles across size changes. GSAP section and text reveals replay on re-entry, with content visible by default and reduced-motion support. Carousel and lower-section videos pause offscreen; reduced-motion users can explicitly play the carousel.
- Validation: Node 24 lint, three existing tunnel tests, production build and `git diff --check` passed. Independent headless Chromium desktop/mobile emulation verified hero looping and fallback, media visibility and reduced motion, carousel manual pause/replay, 3D rotation and angle preservation, section re-entry, and 320/390/1440 px overflow. A local 11-second hero loop produced one video request. No page or console errors were observed in the checked scenarios.
- Limits: physical devices, Safari/iOS, real background suspension, live Netlify behavior and production transfer impact remain unverified; the reported Netlify URL returned HTTP 404 during verification. The user reported the site deployed, but this motion change is local only.
- Branch: `preview-branch`. Preserve the user's pre-existing README live-URL edit. No commit, push or deployment was performed for C2.
- Next exact task: complete the authorized preview-branch PR and squash merge, then investigate the reported Netlify URL returning 404 and verify any resulting deployment.

## C1 history

- Cycle C1 scoped local verification passed and Gate 2 was approved for its PR workflow.
- Requirements: REQ-0001 through REQ-0011; independent local evaluation: `.agile-v/EVAL_RESULTS.md` (ER-C1-20261119-LOCAL). External traffic, live Netlify/Sentry, Safari/iOS, physical devices and assistive technology remain unverified.
- Workflow: PR #1 was squash-merged to `preview-branch`, PR #2 to `main` as `4b8e2af`, and documentation PR #3 to `main` as `3c489dc`. The completed feature branch was removed; `main` and `preview-branch` were retained.
- Completed: deferred media, keyboard control improvements, chip overflow fix, optional shared Sentry tunnel and Netlify adapter, security headers, Node 24, compatible dependency updates, conditional source maps, README and private security reporting. The user later reported deploying `https://iphone15-showcase.netlify.app/`; live deployment behavior has not been independently verified for C2.
- Node 24.22.3 validation: `npm ci`, `npm run lint`, `npm test` (3 passed), Netlify offline build and function bundling, `npm audit` and `npm audit --omit=dev` passed; both audits reported zero advisories. No source maps were emitted without the Sentry token. Netlify Dev returned 200 for the page and SPA fallback, 405 for monitoring GET and 204 for disabled monitoring POST. Lint also passed after Netlify Dev generated local files.
- Independent Chromium desktop and mobile emulation covered the hero link, carousel progression/replay and keyboard controls, 3D controls, lower-page video playback, and 320/390/1440 px overflow. No same-origin HTTP failures or console errors were observed in final reloads. The security review found no confirmed critical/high issue in local scope, with warnings for optional Sentry privacy, unbounded request volume and unverified deployment.
- Risks: Netlify Free usage limits are shared across the chosen existing team. `SENTRY_AUTH_TOKEN` builds may publish source maps, and enabled Sentry Replay does not mask text or media. The 5 MiB tunnel cap does not limit request volume; Netlify may impose a lower payload ceiling. Confirm the actual production URL and provider behavior after the user deploys.
- Follow-up verification: Node 24.22.3 lint, three tunnel tests, production build and npm audit passed. Independent Chromium desktop/mobile checks covered the existing interactions and 320/390/1440 px layout. The Sentry environment example was corrected to distinguish Vite process environment values from `.env` values.
- C1 publication is complete; retain `preview-branch` for the next approved publication workflow.

C1 EvalGate: status=PASS | eval_run_id=ER-C1-20261119-LOCAL | policy_version_ref=N/A | eval_results_path=.agile-v/EVAL_RESULTS.md
