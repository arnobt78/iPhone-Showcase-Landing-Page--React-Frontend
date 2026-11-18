import { useEffect, useRef, useState } from "react";

/** Load below-the-fold video shortly before it reaches the viewport. */
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

  return [videoRef, nearby];
}
