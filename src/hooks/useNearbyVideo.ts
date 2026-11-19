import { useEffect, useRef, useState } from "react";

/** Load below-the-fold video near the viewport and play it only while visible. */
export function useNearbyVideo(): [React.RefObject<HTMLVideoElement>, boolean] {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearby, setNearby] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!("IntersectionObserver" in window)) {
      setNearby(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setNearby(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !nearby) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    let operation = 0;
    const update = (): void => {
      const currentOperation = ++operation;
      if (visible && !document.hidden && !preference.matches) {
        void video.play().catch((error: unknown) => {
          if (!disposed && operation === currentOperation &&
              !(error instanceof DOMException && error.name === "AbortError")) {
            video.pause();
          }
        });
      } else {
        video.pause();
      }
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      update();
    }, { threshold: 0.1 }) : null;
    if (observer) observer.observe(video);
    else { visible = true; update(); }
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      disposed = true;
      observer?.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [nearby]);

  return [videoRef, nearby];
}
