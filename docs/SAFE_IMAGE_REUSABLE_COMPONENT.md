# Optional Next.js Remote Image Fallback

This guide is for **Next.js projects that actually use `next/image` with approved public remote images**. It does not apply automatically to Vite, plain JavaScript, local static imports or every image in a Next.js application. Prefer the existing image component unless there is a demonstrated need for a browser-direct fallback and the tradeoffs below are acceptable.

If an optimized image request fails, a fallback can attempt to load the original image directly in the browser. It may still fail: the source may be offline, unavailable to the visitor, require authentication, or be blocked by CSP or browser policy. A plan quota or HTTP 402 is only one possible failure; do not assume a cause from `onError` alone. A fallback does not avoid transfer costs or stop repeated requests.

## Security, privacy and performance

- `remotePatterns` limits the Next.js optimizer; it **does not restrict a native `<img>`**. Validate the source against an explicit HTTPS host and path allowlist before rendering either branch. Never pass arbitrary user-controlled URLs directly to the browser fallback.
- A direct request exposes the visitor's IP address to the image host and may send a referrer. Set an appropriate `referrerPolicy`, review privacy requirements and CSP `img-src`, and use only trusted public assets.
- Original files may be much larger than optimized variants. Assess download sizes, latency, third-party availability and bandwidth before adding this pattern. It does not bypass image access restrictions or guarantee offline availability.
- Preserve meaningful alt text and a stable box with width/height or a sized parent. Test the resulting crop and responsive behavior. A native image without `srcSet` can download a larger file than `next/image`.
- Use least-privilege [Next.js `remotePatterns`](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns). Check the project's Next version and existing conventions before copying code. Avoid duplicate components and blanket replacement of all `next/image` usage.

## Reference component

This deliberately small example supports a trusted HTTPS image with numeric width and height. Replace the example host and path with your own approved origin. It remounts the internal loader when `src` changes, so a failed previous image does not permanently disable optimization for the next image. It does not attempt to reproduce the entire `ImageProps` API, `fill`, `srcSet`, blur placeholders, custom loaders, or event callbacks; extend and test those only when the project needs them.

```tsx
"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

interface SafeRemoteImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
}

function isAllowedImage(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "images.example.com" &&
      url.port === "" && url.username === "" && url.password === "" &&
      url.pathname.startsWith("/public/") && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function ImageAttempt(props: SafeRemoteImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- intentional direct fallback
      <img {...props} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
    );
  }
  return <Image {...props} referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}

export function SafeRemoteImage(props: SafeRemoteImageProps) {
  if (!isAllowedImage(props.src)) return null;
  return <ImageAttempt key={props.src} {...props} />;
}
```

Configure a corresponding, equally narrow `images.remotePatterns` in the existing Next configuration. The hostname and path above are illustrative placeholders, not an enabled production origin. For real applications, consider showing a local placeholder and accessible error state if both attempts fail; do not repeatedly retry indefinitely.

## Verification before reuse

1. Test allowed and rejected hosts, protocols, paths and malformed URLs. Verify the actual origin's redirects and path handling; hostname allowlists alone do not prove final content is trustworthy.
2. Test optimized success, optimizer failure followed by native success, failure of both paths, and switching `src` after failure. Confirm no retry loop and the desired placeholder/error treatment.
3. Check `alt`, dimensions, layout shift, crop, responsive sizes, loading behavior, CSP and referrer policy. Verify behavior in the project's supported browser and Next versions.
4. Review public asset size and privacy effects; verify no private credentials or signed URLs leak. Confirm remote optimization and direct fallback requests with browser network tools.

For broader deployment and security decisions, see [Vercel Production Guardrails](./VERCEL_PRODUCTION_GUARDRAILS.md).
