# Current state

## Footer motion fix

- User approved a scoped fix under REQ-0014 and REQ-0017. The footer rows now share a staggered entrance observed at viewport entry, avoiding stale scroll thresholds when content changes the page height. Reduced-motion and unsupported-observer users retain visible content.
- Node 26.13.1 lint, three existing tests, production build, npm audit and `git diff --check` passed. Independent local Chromium checks verified footer entrance and re-entry at 320, 390 and 1440 px widths, reduced motion and the missing-IntersectionObserver fallback. A separate local check also covered a 2000 px viewport. Safari/iOS, physical devices, production and Sentry ingestion remain unverified.
- User requested push, PR and squash merge after verification. Next: publish the verified footer changes through the existing `preview-branch` PR workflow, retain the branch and inspect deployment status.

## C3 verification and publication

- User requested verification, security review, and publication of Node 26, motion, Highlights anchor and Vercel metadata changes. Active requirements: REQ-0016 through REQ-0019. Scoped local evaluation ER-C3-20261119-LOCAL passed; Gate 2 approved for the requested PR workflow.
- Node 26.13.1 lint, three tunnel tests, production build and npm audit passed. Independent Chromium desktop/mobile and reduced-motion checks covered anchors, history restoration, motion, carousel, hero and 3D controls. Independent security review found no confirmed critical/high issue in scope.
- Live Vercel, actual deployed runtime patch, Safari/iOS, physical devices, WAF settings and Sentry ingestion remain unverified. A command-line request received a Vercel challenge.
- PR #5 was squash-merged into main as 2b0423d; Vercel reports a successful deployment status for that commit. Retain preview-branch. Next exact task: verify the public site in a normal browser, including metadata, navigation, motion and the deployed Node runtime; automated access received a firewall challenge.

## C2 motion history (superseded)

- Stage: local implementation and independent verification complete; Gate 1 and Gate 2 approved; scoped evaluation ER-C2-20261119-LOCAL passed. Active requirements: REQ-0012 through REQ-0015.
- Completed: responsive hero loops only while visible; reduced motion and autoplay failure use a poster. The active 3D view rotates slowly, pauses during interaction and keeps its camera angles across size changes. GSAP section and text reveals replay on re-entry, with content visible by default and reduced-motion support. Carousel and lower-section videos pause offscreen; reduced-motion users can explicitly play the carousel.
- Validation: Node 24 lint, three existing tunnel tests, production build and `git diff --check` passed. Independent headless Chromium desktop/mobile emulation verified hero looping and fallback, media visibility and reduced motion, carousel manual pause/replay, 3D rotation and angle preservation, section re-entry, and 320/390/1440 px overflow. A local 11-second hero loop produced one video request. No page or console errors were observed in the checked scenarios.
- Limits: physical devices, Safari/iOS, real background suspension, live Netlify behavior and production transfer impact remain unverified; the reported Netlify URL returned HTTP 404 during verification. C2 was merged; production behavior for C3 remains unverified.
- Branch: `preview-branch`. Preserve the user's pre-existing README live-URL edit. C2 was committed as 970d383, pushed, and squash-merged via PR #4 to main as a550dc7. The pre-existing README live-URL edit remains unstaged.
- Historical handoff: Netlify access was suspended; the user moved the project to Vercel.

## C1 history

- Cycle C1 scoped local verification passed and Gate 2 was approved for its PR workflow.
- Requirements: REQ-0001 through REQ-0011; independent local evaluation: `.agile-v/EVAL_RESULTS.md` (ER-C1-20261119-LOCAL). External traffic, live Netlify/Sentry, Safari/iOS, physical devices and assistive technology remain unverified.
- Workflow: PR #1 was squash-merged to `preview-branch`, PR #2 to `main` as `4b8e2af`, and documentation PR #3 to `main` as `3c489dc`. The completed feature branch was removed; `main` and `preview-branch` were retained.
- Completed: deferred media, keyboard control improvements, chip overflow fix, optional shared Sentry tunnel and Netlify adapter, security headers, Node 24, compatible dependency updates, conditional source maps, README and private security reporting. The user later reported deploying `https://iphone-marketing.vercel.app/`; live deployment behavior has not been independently verified for C2.
- Node 24.22.3 validation: `npm ci`, `npm run lint`, `npm test` (3 passed), Netlify offline build and function bundling, `npm audit` and `npm audit --omit=dev` passed; both audits reported zero advisories. No source maps were emitted without the Sentry token. Netlify Dev returned 200 for the page and SPA fallback, 405 for monitoring GET and 204 for disabled monitoring POST. Lint also passed after Netlify Dev generated local files.
- Independent Chromium desktop and mobile emulation covered the hero link, carousel progression/replay and keyboard controls, 3D controls, lower-page video playback, and 320/390/1440 px overflow. No same-origin HTTP failures or console errors were observed in final reloads. The security review found no confirmed critical/high issue in local scope, with warnings for optional Sentry privacy, unbounded request volume and unverified deployment.
- Risks: Netlify Free usage limits are shared across the chosen existing team. `SENTRY_AUTH_TOKEN` builds may publish source maps, and enabled Sentry Replay does not mask text or media. The 5 MiB tunnel cap does not limit request volume; Netlify may impose a lower payload ceiling. Confirm the actual production URL and provider behavior after the user deploys.
- Follow-up verification: Node 24.22.3 lint, three tunnel tests, production build and npm audit passed. Independent Chromium desktop/mobile checks covered the existing interactions and 320/390/1440 px layout. The Sentry environment example was corrected to distinguish Vite process environment values from `.env` values.
- C1 publication is complete; retain `preview-branch` for the next approved publication workflow.

C1 EvalGate: status=PASS | eval_run_id=ER-C1-20261119-LOCAL | policy_version_ref=N/A | eval_results_path=.agile-v/EVAL_RESULTS.md

## Reusable deployment guide history (superseded)

- Updated the three previously untracked Vercel guides for stack-specific deployment, security, media and migration decisions; committed locally on `preview-branch` as `e4c900b`.
- Independent documentation/security review found no blocking issues. Node 24 isolated copy-script success and missing-source checks passed; Markdown fences, local links, official reference URLs and staged diff were checked. The Next.js image example was reviewed statically, not run in a Next.js harness; live deployment and firewall behavior were not tested.
- Existing README and prior state changes remain unstaged. No push, PR, merge or hosting changes were performed for the guide update.
- The user subsequently requested publication with C3.

## Node 26 and motion implementation history (superseded)

- User approved the Node 26 and scroll-flash plan. On `preview-branch`, the Node engine, lockfile root, `.nvmrc` and affected README guidance target 26.x; existing Vercel URL edits remain preserved. Section and carousel entrances prepare offscreen content while keeping initially visible content available.
- Node 26.13.1: `npm ci`, lint, three existing tests, production build and npm audit passed. Independent Chromium desktop/mobile emulation covered initial display, repeat and rapid scroll, carousel slide changes, focus and reduced motion. No live Vercel deployment was tested. The client-rendered SPA does not render its page without JavaScript; no-JS support would require a separate architectural change.
- npm reported deprecated `three-mesh-bvh` and ESLint packages and install-script notices; no dependency upgrade was included in the approved scope. The Node 26 install and regenerated `node_modules`/`dist` remain local.
- At that checkpoint no commit or publication had been performed.
- Independent verifier also confirmed hero playback/loop, offscreen pause, 3D size and color selection after the entrance settled, and no console errors in the tested desktop/mobile Chromium scenarios. A direct `/#highlights` navigation remained at the top in one test; its cause and pre-existing status were not established. Physical Safari/iOS and production remain unverified.

## Highlights direct-link implementation history (superseded)

- User approved fixing the direct `/#highlights` load. React now scrolls to Highlights after initial rendering for fresh visits and reloads, while allowing browser restoration on back/forward navigation. Existing Buy link and other local changes are preserved.
- Node 26.13.1 lint, three existing tests and production build passed; lint and build were rerun after the history adjustment. Independent Chromium checks at desktop and mobile sizes, including reduced motion, passed direct load, refresh, Buy, back/forward and cross-document scroll restoration. Safari/iOS, physical devices and live Vercel remain untested.
- At that checkpoint no commit or publication had been performed.
