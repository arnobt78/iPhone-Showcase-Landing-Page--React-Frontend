import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Keep content visible by default and animate only when motion is supported. */
export function usePageMotion(): React.RefObject<HTMLElement> {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = gsap.utils.toArray<HTMLElement>("[data-motion]", root.current);
      const cleanup: Array<() => void> = [];
      elements.forEach((element) => {
        const kind = element.dataset.motion;
        const children = element.querySelectorAll<HTMLElement>(":scope > [data-motion-item]");
        const targets = children.length ? Array.from(children) : [element];
        const from = kind === "scale"
          ? { opacity: 0, scale: 0.96 }
          : { opacity: 0, y: kind === "down" ? -14 : 22, x: kind === "left" ? -18 : kind === "right" ? 18 : 0 };
        const tween = gsap.from(targets, {
          ...from,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "bottom 5%",
            toggleActions: "play reverse play reverse",
          },
        });
        // Focusable controls must never remain visually hidden during keyboard navigation.
        const revealFocused = (): void => { tween.progress(1).pause(); };
        element.addEventListener("focusin", revealFocused);
        cleanup.push(() => element.removeEventListener("focusin", revealFocused));
      });
      return () => cleanup.forEach((remove) => remove());
    });
    return () => motion.revert();
  }, { scope: root });

  return root;
}
