import { useNearbyVideo } from "../hooks/useNearbyVideo";
import { chipImg, frameImg, frameVideo } from "../utils";

/** A17 Pro chip section with scroll-triggered content and viewport-loaded video. */
function HowItWorks(): React.ReactElement {
  const [videoRef, nearby] = useNearbyVideo();

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <div className="flex-center w-full my-20 overflow-hidden">
          <img id="chip" src={chipImg} alt="chip" width={180} height={180} data-motion="scale" />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="hiw-title" data-motion="up">
            <span className="block" data-motion-item>A17 Pro chip.</span>{" "}
            <span className="block" data-motion-item>A monster win for gaming.</span>
          </h2>

          <p className="hiw-subtitle" data-motion="up">
            It&apos;s here. The biggest redesign in the history of Apple GPUs.
          </p>
        </div>

        <div className="mt-10 md:mt-20 mb-14" data-motion="scale">
          <div className="relative h-full flex-center">
            <div className="overflow-hidden">
              <img
                src={frameImg}
                alt="frame"
                className="bg-transparent relative z-10"
              />
            </div>
            <div className="hiw-video">
              <video
                className="pointer-events-none"
                playsInline
                preload="metadata"
                muted
                ref={videoRef}
                src={nearby ? frameVideo : undefined}
              >
              </video>
            </div>
          </div>
          <p className="text-gray font-semibold text-center mt-3">
            Honkai: Star Rail
          </p>
        </div>

        <div className="hiw-text-container">
          <div className="flex flex-1 justify-center flex-col" data-motion="left">
            <p className="hiw-text" data-motion-item>
              A17 Pro is an entirely new class of iPhone chip that delivers our{" "}
              <span className="text-white">
                best graphic performance by far
              </span>
              .
            </p>

            <p className="hiw-text" data-motion-item>
              Mobile{" "}
              <span className="text-white">
                games will look and feel so immersive
              </span>
              , with incredibly detailed environments and characters.
            </p>
          </div>

          <div className="flex-1 flex justify-center flex-col" data-motion="right">
            <p className="hiw-text" data-motion-item>New</p>
            <p className="hiw-bigtext" data-motion-item>Pro-class GPU</p>
            <p className="hiw-text" data-motion-item>with 6 cores</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
