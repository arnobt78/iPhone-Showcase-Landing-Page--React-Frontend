import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

import { useEffect, useRef, useState } from "react";
import { highlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

/** Tracks which slide is active, play state, and whether we've reached the last video (for replay). */
interface VideoState {
  isEnd: boolean;
  startPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
}

/** Four-slide carousel: each slide has video + text. Refs hold DOM refs per index; GSAP moves #slider and drives progress bars. */
function VideoCarousel(): React.ReactElement {
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);
  const slideTextRef = useRef<(HTMLDivElement | null)[]>([]);

  const [video, setVideo] = useState<VideoState>({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const [furthestSlide, setFurthestSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let intersecting = false;
    const update = (): void => setVisible(intersecting && !document.hidden);
    const updatePreference = (): void => {
      if (preference.matches) setVideo((previous) => ({ ...previous, isPlaying: false }));
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      intersecting = Boolean(entry?.isIntersecting);
      update();
    }, { threshold: 0.1 }) : null;
    if (observer) observer.observe(carousel);
    else { intersecting = true; update(); }
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", updatePreference);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  // Slide position by videoId; when video ends we advance and this re-runs
  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: pre.startPlay ? pre.isPlaying : !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        }));
      },
    });
  }, [isEnd, videoId]);

  // Reveal the active slide's copy as it arrives, and again on viewport re-entry.
  useGSAP(() => {
    const text = slideTextRef.current[videoId];
    if (!startPlay || !text) return;
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const bounds = text.getBoundingClientRect();
      const initiallyVisible = videoId === 0 && bounds.top < window.innerHeight && bounds.bottom > 0;
      const tween = gsap.from(text.querySelectorAll("p"), {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.1,
        delay: videoId === 0 ? 0 : 0.6,
        ease: "power2.out",
        // Prepare incoming slides before they move into view, without hiding initial visible copy.
        immediateRender: !initiallyVisible,
        scrollTrigger: {
          trigger: text,
          start: "top 90%",
          end: "bottom 5%",
          toggleActions: "play reverse play reverse",
        },
      });
      if (initiallyVisible) tween.progress(1);
    });
    return () => motion.revert();
  }, { dependencies: [videoId, startPlay], revertOnUpdate: true });

  // Progress bar: GSAP tween on span; onUpdate syncs width to progress; gsap.ticker drives progress from video currentTime
  useEffect(() => {
    const span = videoSpanRef.current;
    const div = videoDivRef.current;
    const vRef = videoRef.current;

    if (!span[videoId] || !div[videoId]) return;

    let currentProgress = 0;
    const anim = gsap.to(span[videoId], {
      onUpdate: () => {
        const progress = Math.ceil(anim.progress() * 100);
        if (progress !== currentProgress) {
          currentProgress = progress;
          const targetDiv = div[videoId];
          if (targetDiv) {
            gsap.to(targetDiv, {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                    ? "10vw"
                    : "4vw",
            });
          }
          const spanEl = span[videoId];
          if (spanEl) {
            gsap.to(spanEl, {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        }
      },
      onComplete: () => {
        if (isPlaying && div[videoId]) {
          gsap.to(div[videoId], { width: "12px" });
        }
        const spanElComplete = span[videoId];
        if (spanElComplete) {
          gsap.to(spanElComplete, { backgroundColor: "#afafaf" });
        }
      },
    });

    if (videoId === 0) {
      anim.restart();
    }

    const animUpdate = (): void => {
      const vid = vRef[videoId];
      const slide = highlightsSlides[videoId];
      if (vid && slide)
        anim.progress(vid.currentTime / slide.videoDuration);
    };

    if (isPlaying && visible) {
      gsap.ticker.add(animUpdate);
    } else {
      gsap.ticker.remove(animUpdate);
    }

    return () => {
      gsap.ticker.remove(animUpdate);
    };
  }, [videoId, startPlay, isPlaying, visible]);

  // Only the active slide needs to load before playback can start.
  useEffect(() => {
    const vRef = videoRef.current;
    const current = vRef[videoId];
    if (!current) return;
    let cancelled = false;
    if (!isPlaying || !visible) {
      current.pause();
    } else if (startPlay) {
      void current.play().catch((error: unknown) => {
        if (!cancelled && !(error instanceof DOMException && error.name === "AbortError")) {
          setVideo((previous) => ({ ...previous, isPlaying: false }));
        }
      });
    }
    return () => { cancelled = true; };
  }, [startPlay, videoId, isPlaying, visible]);

  type ProcessType =
    | "video-end"
    | "video-last"
    | "video-reset"
    | "pause"
    | "play";

  /** Advance to next slide, go to last state, reset to first, or toggle play/pause. */
  const handleProcess = (type: ProcessType, i?: number): void => {
    switch (type) {
      case "video-end":
        setFurthestSlide((previous) => Math.max(previous, (i ?? 0) + 1));
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: (i ?? 0) + 1 }));
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true, isPlaying: false }));
        break;
      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false, isPlaying: true }));
        break;
      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
      default:
        break;
    }
  };

  return (
    <div ref={carouselRef}>
      <div className="flex items-center">
        {highlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  className={`${
                    list.id === 2 ? "translate-x-44" : ""
                  } pointer-events-none`}
                  preload="none"
                  src={startPlay && i <= furthestSlide ? list.video : undefined}
                  muted
                  ref={(el) => {
                    videoRef.current[i] = el;
                  }}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                />
              </div>

              <div className="absolute top-12 left-[5%] z-10" ref={(el) => { slideTextRef.current[i] = el; }}>
                {list.textLists.map((text, j) => (
                  <p key={j} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {highlightsSlides.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => {
                videoDivRef.current[i] = el;
              }}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => {
                  videoSpanRef.current[i] = el;
                }}
              />
            </span>
          ))}
        </div>

        <button
          type="button"
          className="control-btn"
          aria-label={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
          onClick={() =>
            isLastVideo
              ? handleProcess("video-reset")
              : !isPlaying
                ? handleProcess("play")
                : handleProcess("pause")
          }
        >
          <img
            src={
              isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg
            }
            alt=""
          />
        </button>
      </div>
    </div>
  );
}

export default VideoCarousel;
