import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Runs a GSAP tween when target enters view (start: top 85%). Use for section headings, text, images. */
export function animateWithGsap(
  target: string | object,
  animationProps: gsap.TweenVars,
  scrollProps?: ScrollTrigger.Vars
): void {
  gsap.to(target as gsap.TweenTarget, {
    ...animationProps,
    scrollTrigger: {
      trigger: target as gsap.DOMTarget,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
}

/** Move both size views together without changing their camera orientation. */
export function animateWithGsapTimeline(
  timeline: gsap.core.Timeline,
  firstTarget: string,
  secondTarget: string,
  animationProps: gsap.TweenVars
): void {
  timeline.to([firstTarget, secondTarget], {
    ...animationProps,
    ease: "power2.inOut",
  });
}
