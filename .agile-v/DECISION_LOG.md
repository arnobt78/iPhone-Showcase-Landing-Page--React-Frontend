# Decisions

- C1 REQ-0001–0005: Implement the user-approved plan on a dedicated branch. No hosting, firewall, or production changes are approved.
- C1 REQ-0002: Retain already viewed carousel sources during transitions, load new videos on demand, and defer offscreen autoplay until near the viewport.
- C1 REQ-0003: Limit monitoring envelopes to 5 MiB and forward Sentry backoff headers; do not add global challenges or cache mutable media immutably.
- C1 REQ-0004: Update compatible dependency ranges and the Sentry build plugin; defer broad React/Three.js major migrations pending compatibility verification.
- C1 REQ-0006–0008: User requested documentation and approved the Netlify compatibility and keyboard accessibility changes. Preserve Vercel configuration and share its monitoring handler.
- C1 REQ-0009–0010: User approved constraining the chip animation and generating source maps only for builds with the Sentry upload token.
- C1 REQ-0001–0010: User approved the non-www intended Netlify URL, retaining optional Sentry, environment-file protection and a task-branch → preview-branch → main PR workflow. The URL remains unverified until deployment.
