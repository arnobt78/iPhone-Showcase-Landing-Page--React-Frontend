# Deploy Plain HTML, CSS and JavaScript on Vercel

Use this guide for a site that really is plain static HTML/CSS/JS. For Vite, Next.js, APIs or Python, start with [the production guardrails](./VERCEL_PRODUCTION_GUARDRAILS.md) and the framework's own configuration. Inspect the existing project first; preserve its files, paths, scripts, and package manager.

## 1. Choose the simplest build

A static site **does not require a build command or `dist/`** merely to deploy on Vercel. In project settings choose **Other**, leave the build command blank when no build is needed, and select the directory containing the deployable `index.html` if the default is not correct. For a monorepo, set the root directory to the correct project. Verify the settings shown by the current dashboard. [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build)

If the project already builds, use its existing output and scripts. If a copy step is genuinely needed, customize the following example for the exact files and directories in the site. The example copies from `site/` into `dist/`; it is not intended to copy a repository root containing secrets, configuration or development files.

```js
// scripts/copy-static.mjs
import { cp, mkdir, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../site/", import.meta.url));
const output = fileURLToPath(new URL("../dist/", import.meta.url));
if (!(await stat(source)).isDirectory()) throw new Error("Static source is not a directory");
await rm(output, { recursive: true, force: true }); // Deletes existing dist; generated output only.
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
```

`.mjs` is an ES module regardless of the package's `type` setting. Use this script only when `site/` is the intended public source and `dist/` is disposable generated output; review contents before running it. If using npm, a project may add `"build": "node scripts/copy-static.mjs"` and configure output as `dist`. Ignore generated `dist/` in Git where appropriate. Avoid adding a duplicate `vercel-build` unless the project requires it.

## 2. Preserve routes and assets

- A multi-page website should continue to serve its real HTML files and correct 404s. Do not add a catch-all rewrite simply because the project is static.
- For a genuine client-routed SPA, configure and test a fallback appropriate to its routing and platform. Confirm direct links and refresh, and ensure API routes and missing assets are not unintentionally rewritten to HTML. [Vercel rewrites](https://vercel.com/docs/routing/rewrites)
- Check asset paths against the actual published directory: `/assets/x.png` and `/public/assets/x.png` are different URLs. Test CSS, scripts, fonts, images, video, favicon, and subdirectory links through a local HTTP server and Preview.
- Add caching only after inspecting URL versioning and response headers. Never apply long-lived immutable caching to a mutable filename.

## 3. Verify and migrate

1. Inventory the repository, target account, project settings and custom domains. Do not assume that a separate account is allowed for a particular use: check the provider's current terms when relevant.
2. Run the project's existing checks and build only if present. Inspect the actual output for missing files and accidentally included secrets. A static site may not use npm or Node at all.
3. Deploy to a Preview when authorized. Test pages, deep links, refresh, expected 404s, asset responses, browser console, accessibility and mobile layout. Verify metadata and indexing requirements.
4. Compare expected and actual headers and behavior; test firewall settings against legitimate users and automation before enabling them broadly. Follow the production guide for metrics, monitoring and incident response.
5. Verify domain ownership, DNS and HTTPS before switching a custom domain, and keep a rollback plan. Do not delete the original project or change production without authorization.
