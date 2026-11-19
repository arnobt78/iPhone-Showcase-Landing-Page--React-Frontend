import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import ModelView from "./ModelView";
import { yellowImg } from "../utils";
import { models, sizes } from "../constants";
import { animateWithGsapTimeline } from "../utils/animations";
import type { ModelItem } from "../constants";
import type { OrbitControlsRef } from "./ModelView";

/** Default model shown on load (Natural Titanium) */
const defaultModel: ModelItem = {
  id: 1,
  title: "iPhone 15 Pro in Natural Titanium",
  color: ["#8F8A81", "#FFE7B9", "#6F6C64"],
  img: yellowImg,
};

/**
 * 3D section: two ModelViews (view1 = small, view2 = large). Size toggle runs GSAP timeline to slide views; color dots set active model.
 */
function Model(): React.ReactElement {
  const [size, setSize] = useState<"small" | "large">("small");
  const [model, setModel] = useState<ModelItem>(defaultModel);

  const cameraControlSmall = useRef<OrbitControlsRef | null>(null);
  const cameraControlLarge = useRef<OrbitControlsRef | null>(null);
  const modelRegion = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    const region = modelRegion.current;
    if (!region) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let intersecting = false;
    const updatePreference = (): void => setReducedMotion(preference.matches);
    const updateVisibility = (): void => setVisible(intersecting && !document.hidden);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      intersecting = Boolean(entry?.isIntersecting);
      updateVisibility();
    }, { threshold: 0.1 }) : null;
    if (observer) observer.observe(region);
    else { intersecting = true; updateVisibility(); }
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
      clearTimeout(resumeTimer.current);
    };
  }, []);

  const pauseRotation = (): void => {
    clearTimeout(resumeTimer.current);
    setInteracting(true);
  };
  const resumeRotation = (): void => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setInteracting(false), 2000);
  };

  // Keep size transitions independent of the cameras' current orbit angles.
  useEffect(() => {
    if (reducedMotion) {
      gsap.set("#view1, #view2", { xPercent: size === "large" ? -100 : 0 });
      return;
    }
    const timeline = gsap.timeline();
    animateWithGsapTimeline(timeline, "#view1", "#view2", {
      xPercent: size === "large" ? -100 : 0,
      duration: 2,
    });
    return () => { timeline.kill(); };
  }, [size, reducedMotion]);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading" data-motion="up">
          Take a closer look.
        </h1>

        <div className="flex flex-col items-center mt-5">
          <div ref={modelRegion} className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            {/* view1 = small (6.1"); view2 = large (6.7"). Both share same Canvas via View.Port below. */}
            <ModelView
              index={1}
              gsapType="view1"
              controlRef={cameraControlSmall}
              item={model}
              size={size}
              autoRotate={visible && !reducedMotion && !interacting && size === "small"}
              onInteractionStart={pauseRotation}
              onInteractionEnd={resumeRotation}
            />

            <ModelView
              index={2}
              gsapType="view2"
              controlRef={cameraControlLarge}
              item={model}
              size={size}
              autoRotate={visible && !reducedMotion && !interacting && size === "large"}
              onInteractionStart={pauseRotation}
              onInteractionEnd={resumeRotation}
            />

            <Canvas
              className="w-full h-full"
              style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
              }}
              eventSource={document.getElementById("root") ?? undefined}
            >
              <View.Port />
            </Canvas>
          </div>

          <div className="mx-auto w-full" data-motion="up">
            <p className="text-sm font-light text-center mb-5" data-motion-item>{model.title}</p>

            <div className="flex-center" data-motion-item>
              <ul className="color-container">
                {models.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="block w-6 h-6 rounded-full mx-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      style={{ backgroundColor: item.color[0] }}
                      aria-label={item.title}
                      aria-pressed={model.id === item.id}
                      onClick={() => setModel(item)}
                    />
                  </li>
                ))}
              </ul>

              <div className="size-btn-container" role="group" aria-label="iPhone size">
                {sizes.map(({ label, value }) => (
                  <button
                    type="button"
                    key={label}
                    className="size-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-pressed={size === value}
                    style={{
                      backgroundColor:
                        size === value ? "white" : "transparent",
                      color: size === value ? "black" : "white",
                    }}
                    onClick={() => {
                      if (value === size) return;
                      pauseRotation();
                      const current = size === "small" ? cameraControlSmall.current : cameraControlLarge.current;
                      const next = value === "small" ? cameraControlSmall.current : cameraControlLarge.current;
                      if (current && next) {
                        // Copy both camera angles without damping so the new view starts at the same orientation.
                        const damping = next.enableDamping;
                        next.enableDamping = false;
                        next.setAzimuthalAngle(current.getAzimuthalAngle());
                        next.setPolarAngle(current.getPolarAngle());
                        next.enableDamping = damping;
                      }
                      setSize(value);
                      resumeRotation();
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Model;
