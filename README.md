# iPhone 15 Showcase Landing Page - React, Vite, Typescript, 3D Model, Three.js, GSAP, TailwindCSS Frontend Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.8-646CFF)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38BDF8)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169.0-black)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-26.x-339933)](https://nodejs.org/)

A learning project that recreates an iPhone 15 Pro product showcase with React, 3D graphics, video and scroll animations. It is an independent frontend demo, not an Apple store: it does not sell products or process orders.

- **Live Demo:** [https://iphone-marketing.vercel.app/](https://iphone-marketing.vercel.app/)
- **Security:** private reports → [SECURITY.md](./SECURITY.md) · [contact@arnobmahmud.com](mailto:contact@arnobmahmud.com)

![Image 1](https://github.com/user-attachments/assets/d57a6315-de97-43ff-9ce0-987a3c065e0a)
![Image 2](https://github.com/user-attachments/assets/1e88bb0d-1dc9-4a11-a531-22d14c55315e)
![Image 3](https://github.com/user-attachments/assets/da849ebf-7fde-447e-8f9a-cdebeda6ab48)
![Image 4](https://github.com/user-attachments/assets/215a38c3-5c95-416b-8905-8211e8c4cc05)
![Image 5](https://github.com/user-attachments/assets/ac0ac722-1d39-4f69-be94-e84014c01c0c)

## Contents

- [What the project does](#what-the-project-does)
- [Getting started](#getting-started)
- [Environment and Sentry](#environment-and-sentry)
- [Architecture and routes](#architecture-and-routes)
- [Project structure](#project-structure)
- [Walkthrough and reuse](#walkthrough-and-reuse)
- [Technology and concepts](#technology-and-concepts)
- [Deployment and usage](#deployment-and-usage)
- [Testing and troubleshooting](#testing-and-troubleshooting)
- [Security](#security)
- [Keywords](#keywords)
- [License](#license)

---

## What the project does

- Loops a responsive hero video while it is visible and provides a **Buy** button that scrolls to the highlights section; it does not start a purchase.
- Plays four highlight videos in sequence, with progress, pause, play and replay controls.
- Displays an interactive 3D phone with four color choices and two size views. It rotates slowly while visible; drag to control it.
- Replays section and text entrances on scroll, pauses offscreen video, and respects reduced-motion preferences.
- Uses optional Sentry monitoring for errors, performance and session replay.

The header labels, search and bag icons, film/event text and footer legal labels are visual placeholders, not implemented navigation or shopping features. There are no account, database, checkout, CRUD or multi-page application features. The project is a client-rendered single-page application (SPA), not a Next.js or server-rendered app.

---

## Getting started

Install [Node.js 26](https://nodejs.org/) and npm. `.nvmrc` specifies Node 26 for users of nvm; `package.json` selects `26.x` for compatible deployment platforms. Badges show the versions in the lockfile; consult that file for exact resolved versions.

```bash
git clone https://github.com/arnobt78/iphone.git
cd iphone
nvm use          # if using nvm; install Node 26 first if needed
npm ci
npm run dev
```

Open the local URL printed by Vite. The page works without a `.env` file or Sentry account.

```bash
npm run lint     # ESLint, warnings treated as errors
npm test         # Node's test runner: monitoring tunnel checks
npm run build    # TypeScript check and production build in dist/
npm run preview  # Serve the built static site locally
npm audit        # Check known npm dependency advisories
```

`npm run preview` previews the static build; it does not run Vercel or Netlify functions. Browsers need WebGL to render the 3D model and may apply their own autoplay policies.

---

## Environment and Sentry

All variables are optional. Copy `.env.example` to `.env` only if you want to enable monitoring. Never commit `.env` or put a secret in a `VITE_` variable: Vite exposes those values in the browser bundle.

| Variable                 | Where it is used                       | How to obtain or configure it                                                                                                                                                                                                                                                                    |
| ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_SENTRY_DSN`        | Vite client build                      | Create a Sentry project and copy its DSN from project settings / client keys. A DSN is public configuration, not an authentication token.                                                                                                                                                        |
| `SENTRY_INGEST_URL`      | Server-side Vercel or Netlify function | Use the Sentry envelope endpoint derived from your project's DSN, for example `https://o123.ingest.us.sentry.io/api/456/envelope/`. Configure it in the host's function environment, not the browser.                                                                                            |
| `VITE_SENTRY_INGEST_URL` | Vite development proxy configuration   | Set the same envelope endpoint in the shell before starting Vite. The Vite config reads `process.env` during startup; putting this variable only in `.env` does not configure the proxy. Restart Vite after changing it.                                                                         |
| `SENTRY_AUTH_TOKEN`      | Build environment only                 | Create a Sentry token with the permissions needed for source-map upload and store it as a secret in CI or the hosting build environment. The Vite plugin currently specifies the organization `arnob-mahmud` and project `iphone15-showcase`; change those settings for your own Sentry project. |

For example, with a placeholder ingest endpoint:

```bash
export VITE_SENTRY_INGEST_URL='https://o123.ingest.us.sentry.io/api/456/envelope/'
npm run dev
```

Set `VITE_SENTRY_DSN` in `.env` or the build environment as well. The client sends events to `/api/monitoring`. When the server ingest URL is missing, the function returns `204` without forwarding. The tunnel accepts only POST requests and rejects envelopes larger than 5 MiB; this per-request limit is not a rate limit. When enabled, the current Sentry configuration samples all performance traces, 10% of sessions and all sessions with errors; Replay has text masking and media blocking disabled. Review privacy, consent, retention and Sentry usage before enabling it.

On Netlify, set `SENTRY_INGEST_URL` with Functions runtime scope. Netlify's own buffered request limit can reject a large envelope before it reaches the application's 5 MiB limit. Its static header rules do not apply to function responses.

Production builds generate source maps only when `SENTRY_AUTH_TOKEN` is set for Sentry upload. Such builds may still leave the maps in `dist`, where a host could publish them; verify the uploaded artifacts and hosting configuration before deploying with that token.

---

## Architecture and routes

`index.html` loads `src/main.tsx`, which optionally initializes Sentry and mounts `App`. `App` composes the landing-page sections. React state controls the carousel and 3D selections; GSAP handles animations; React Three Fiber renders the Three.js scene. Static images, videos and the model live in `public/` and are served as files.

There is one frontend page at `/`. The hero link uses `/#highlights`; the host's fallback can return the same SPA shell for other paths, but there are no separate app routes. There is no business API or backend database.

The optional `POST /api/monitoring` endpoint forwards a Sentry envelope to the configured upstream URL. `api/monitoring.ts` is the Vercel Edge handler; `netlify/functions/monitoring.ts` reuses it as a Netlify function through the rewrite in `netlify.toml`. GET returns `405`; an unconfigured POST returns `204`; oversized envelopes return `413`. Upstream status and Sentry retry headers are passed back. The tunnel is public, so host-level traffic controls remain relevant.

---

## Project structure

```text
iphone/
├── index.html                  # HTML entry, metadata and preloads
├── package.json                # npm scripts and direct dependencies
├── package-lock.json           # Exact dependency tree for npm ci
├── .env.example                # Optional, commented environment examples
├── .nvmrc                      # Node major version
├── vite.config.ts              # Vite, dev proxy and optional Sentry build plugin
├── vercel.json                 # Vercel headers and SPA rewrite
├── netlify.toml                # Netlify build, headers and rewrites
├── api/monitoring.ts           # Shared Sentry forwarding handler / Vercel Edge entry
├── netlify/functions/          # Netlify function adapter
├── public/assets/              # Product images, SVG icons and MP4 videos
├── public/models/scene.glb     # 3D phone model
├── src/
│   ├── main.tsx, App.tsx       # Initialization and page composition
│   ├── index.css               # Tailwind directives and shared CSS classes
│   ├── components/             # Page sections, carousel and 3D scene
│   ├── constants/index.ts      # Slide, model, size and display data
│   ├── hooks/                  # Scroll motion and viewport-aware video playback
│   └── utils/                  # Asset paths and GSAP helpers
├── tests/monitoring.test.ts    # Tunnel behavior tests
├── docs/                       # Agile V protocol and engineering playbook
└── SECURITY.md                 # Private vulnerability reporting
```

---

## Walkthrough and reuse

| Files                                              | What happens                                                                                                                             | Reuse considerations                                                                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Navbar`, `Hero`                                   | Displays the header and selects a hero video for the viewport width.                                                                     | Copy the images, videos, CSS utilities and asset paths too. Replace placeholder header items with real links only when destinations exist.             |
| `Highlights`, `VideoCarousel`                      | Reads slide content from `constants`, loads videos as slides are reached, advances on video end and tracks progress using refs and GSAP. | Copy the slide data, media, controls, styles and animation dependencies together. Durations in the slide data control progress animation.              |
| `Model`, `ModelView`, `IPhone`, `Lights`, `Loader` | Creates two 3D views, changes model material/texture, and rotates the selected view.                                                     | The component depends on the specific GLB mesh names, textures, Three.js, Fiber and Drei. A different model needs corresponding mesh/material changes. |
| `Features`, `HowItWorks`, `useNearbyVideo`         | Animates the product sections and attaches their video sources shortly before they enter the viewport.                                   | Include the hook and CSS. Browsers without `IntersectionObserver` use the hook's fallback.                                                             |
| `Footer`                                           | Renders store information, current year and labels.                                                                                      | Replace the sample contact and placeholder labels for your site.                                                                                       |
| `utils/animations.ts`                              | Shares GSAP scroll and timeline helpers.                                                                                                 | Targets must exist in the DOM, and GSAP ScrollTrigger must be registered.                                                                              |

The `usePageMotion` hook uses `data-motion` and `data-motion-item` attributes for replayable section and staggered text entrances. It keeps content visible when reduced motion is requested. To reuse a component in another React app, install its dependencies, copy its imports and supporting CSS/assets, and update paths and content. Review the rights to third-party assets separately before reuse.

---

## Technology and concepts

| Technology                             | What it contributes                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| React and React DOM                    | Components, local state and browser rendering.                                        |
| TypeScript                             | Types for component props and data, checked during the build.                         |
| Vite and its React plugin              | Development server, React refresh and optimized production bundle.                    |
| Tailwind CSS, PostCSS and Autoprefixer | Utility classes, shared styles and CSS processing.                                    |
| Three.js, React Three Fiber and Drei   | WebGL scene, React integration, model loading, controls, camera and lighting helpers. |
| GSAP and `@gsap/react`                 | Timelines, scroll-triggered animations and React integration.                         |
| Sentry React and Vite plugin           | Optional client monitoring and optional source-map upload.                            |
| Lucide React                           | SVG icon components.                                                                  |
| ESLint and typescript-eslint           | Static lint checks for JavaScript and TypeScript.                                     |

A **component** is a reusable UI function; **state** holds changing UI choices; a **ref** points to an element or 3D object without itself triggering a render. A **GLB** is a binary 3D model file. A **tunnel** is a server endpoint that forwards monitoring envelopes. A **SPA fallback** serves the same entry page for paths that do not match static files.

---

## Deployment and usage

For Netlify, the repository specifies build command `npm run build`, publish directory `dist`, a monitoring function rewrite, security headers and a fallback to `index.html`. Select Node 26 for the build and set optional Sentry variables only if needed. Verify the actual function runtime separately: the host may use a different supported version. Preview and test the function and site before assigning a production domain. A local `npm run preview` alone does not verify Netlify functions.

To deploy from a Git connection, commit and push the intended changes first, then select the branch containing them in Netlify. A manual CLI deploy can include the function from the working tree: run `npx netlify-cli login`, then `npx netlify-cli deploy --build` from the project folder for a preview. After checking it, use `npx netlify-cli deploy --prod --build` for production. Choose the intended team when prompted. Uploading only `dist/` does not include the source function.

For Vercel, `vercel.json` configures security headers and the SPA fallback, and the `api/` directory provides the optional Edge handler. Check actual deployment settings and runtime logs when troubleshooting.

Both platforms meter traffic. Large videos can consume substantial bandwidth, and the exact cause of the previous Vercel transfer spike is not established. Inspect requests by path, bytes and source, and monitor usage after deployment. Netlify's Free plan also has a team-wide credit limit; verify current plan terms before putting this demo alongside important projects. A separate team can limit the impact on other sites, subject to the account's plan and rules.

The canonical and social-image URLs in `index.html` use the Vercel address; verify the final deployed domain and metadata after publishing. Static SPA rewrites do not provide a monitoring function unless the host supports the configured adapter.

---

## Testing and troubleshooting

- **Blank 3D scene:** Check WebGL support, browser console and that `/models/scene.glb` and the texture images load. Test on a real device as well as emulation.
- **Videos do not play:** Check network requests, browser autoplay policy and video codec support. Lower-page videos and carousel slides load on demand.
- **Sentry event missing:** Confirm the DSN was present at build time, the correct host function has `SENTRY_INGEST_URL`, and the tunnel response is not `204` because the upstream is unset. Inspect host logs without exposing tokens or event contents. Test with a safe event in your own Sentry project.
- **Build or install fails:** Confirm `node -v` is 26.x, run `npm ci`, then rerun lint, tests and build. Keep `package-lock.json` with the manifest.
- **High transfer:** Inspect host usage and request-level data before assigning a cause. CDN caching can improve latency and origin usage, but data delivered to visitors can still count against bandwidth quotas.

Automated tests currently focus on the tunnel. Browser behavior, third-party services, host configuration and physical-device compatibility require additional verification; a clean audit or build is not proof of complete security or production readiness.

---

## Security

Please report vulnerabilities privately using the instructions in [SECURITY.md](SECURITY.md). Avoid publishing sensitive details or real credentials in issues.

---

## Keywords

React, TypeScript, Vite, SPA, Tailwind CSS, Three.js, React Three Fiber, Drei, WebGL, GLB, GSAP, ScrollTrigger, responsive design, video loading, Sentry, Netlify, Vercel.

---

## Conclusion

This project demonstrates how to combine a React page, 3D model, animation and optional monitoring in a single showcase. Adapt its components, assets and deployment settings to your own requirements and verify them in the environment where they will run.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license. The bundled 3D model has its own attribution and license information in `src/components/IPhone.tsx`; check the rights for all third-party assets separately.

---

## Happy Coding! 🎉

This is an **open-source project** - feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com](https://www.arnobmahmud.com).
