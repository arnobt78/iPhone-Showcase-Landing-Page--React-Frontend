---
eval_run_id: ER-C2-20261119-LOCAL
eval_timestamp: 2026-11-18T18:12:22Z
policy_version_ref: N/A
eval_gate_status: PASS
eval_gate_rationale: "PASS applies to the C2 local checks below; live deployment and physical-device checks remain unverified."
thresholds:
  local_tunnel_tests: "3 of 3 pass"
  local_browser_checks: "All scenarios listed as PASS below succeed without uncaught JavaScript exceptions or same-origin HTTP errors."
  viewport_overflow: "Document width does not exceed viewport width at sampled positions."
---

| Suite | Requirements | Result | Evidence and limits |
| --- | --- | --- | --- |
| Monitoring tunnel | REQ-0003 | PASS | Node 24.22.3 `npm test`: 3 of 3 tests passed for methods, disabled mode, forwarding, upstream backoff headers, and oversized bodies; see `tests/`. No live Sentry traffic was tested. |
| Carousel and controls | REQ-0002, REQ-0008 | PASS | Local Chromium at 1440x900 and 390x844: CTA navigation, Enter/Space pause/resume, four slide transitions by synthetic seeking, and replay succeeded. |
| Model controls and rendering | REQ-0002, REQ-0008 | PASS | Local Chromium desktop and mobile emulation: model rendered; color and size selections updated; keyboard activation and pressed states were verified. |
| Media loading | REQ-0002 | PASS | Local Chromium desktop and mobile emulation: only the appropriate hero video loaded initially; lower-page videos were requested and played after scrolling. |
| Layout and chip animation | REQ-0009 | PASS | Local Chromium at widths 320, 390, and 1440: sampled sections and chip animation did not widen the document. A separate 320px check observed the chip reach opacity 1 and scale 1. |
| Browser diagnostics | REQ-0002, REQ-0008, REQ-0009 | PASS | No uncaught JavaScript exceptions or same-origin HTTP failures during workflows. After the Navbar adjustment, desktop and mobile reloads produced no console errors and retained the three icon preloads. |
| External and device coverage | REQ-0001, REQ-0003, REQ-0007, REQ-0010 | UNVERIFIED | Live Vercel traffic/firewall, deployed Vercel and Netlify routing, real Sentry ingestion and upload, physical devices, Safari/iOS, and assistive technology were not verified by this run. No waiver is claimed. |

The local browser checks used headless Chromium with software WebGL and Vite; they are not a production-readiness or cross-browser guarantee. Independent verification was performed without modifying implementation files.

## C2 motion verification

| Scope | Requirements | Result | Evidence and limits |
| --- | --- | --- | --- |
| Hero, motion and media | REQ-0012, REQ-0014, REQ-0015 | PASS | Independent headless Chromium checked looping, autoplay fallback, viewport pause, reduced motion and section re-entry. |
| 3D phone and carousel | REQ-0013, REQ-0015 | PASS | Independent desktop/mobile emulation checked drag and camera-angle preservation, carousel pause/resume and manual pause persistence. |
| Automation and security | REQ-0012 through REQ-0015 | PASS WITH WARNINGS | Node 24.22.3 lint, three tunnel tests, build and npm audit passed. Independent review found no confirmed critical/high findings; optional Sentry privacy and request-volume limitations remain. |
| Deployment and devices | REQ-0012 through REQ-0015 | UNVERIFIED | Netlify URL returned HTTP 404; Safari/iOS, physical devices and actual background suspension were not tested. |
