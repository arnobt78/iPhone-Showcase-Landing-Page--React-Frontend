import { heroImg, heroVideo, smallHeroVideo } from "../utils";
import { useEffect, useRef, useState } from "react";

/** Responsive hero video loops only while visible and motion is allowed. */
function Hero(): React.ReactElement {
  // Pick video by viewport: smallHero for narrow (e.g. mobile), hero for desktop
  const [videoSrc, setVideoSrc] = useState<string>(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(false);

  const handleVideoSrcSet = (): void => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcSet);
    return () => {
      window.removeEventListener("resize", handleVideoSrcSet);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    const update = (): void => {
      if (visible && !document.hidden && !preference.matches) {
        void video.play().catch((error: unknown) => {
          if (!disposed && visible && !document.hidden && !preference.matches &&
              !(error instanceof DOMException && error.name === "AbortError")) setShowPoster(true);
        });
      } else {
        video.pause();
        if (preference.matches) setShowPoster(true);
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
    };
  }, [videoSrc]);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title" data-motion="down">
          iPhone 15 Pro
        </p>
        <div className="md:w-10/12 w-9/12">
          <video
            className="pointer-events-none"
            ref={videoRef}
            muted
            playsInline
            loop
            poster={showPoster ? heroImg : undefined}
            onError={() => setShowPoster(true)}
            style={{ width: "100%", aspectRatio: videoSrc === smallHeroVideo ? "752 / 920" : "10 / 3" }}
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div
        id="cta"
        className="flex flex-col items-center"
        data-motion="up"
      >
        <a href="#highlights" className="btn" data-motion-item>
          Buy
        </a>
        <p className="font-normal text-xl" data-motion-item>From $199/month or $999</p>
      </div>
    </section>
  );
}

export default Hero;
