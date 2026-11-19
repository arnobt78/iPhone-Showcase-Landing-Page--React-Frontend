import { useNearbyVideo } from "../hooks/useNearbyVideo";
import { explore1Img, explore2Img, exploreVideo } from "../utils";

/** Product story with viewport-loaded video and scroll-triggered content. */
function Features(): React.ReactElement {
  const [videoRef, nearby] = useNearbyVideo();

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading" data-motion="up">
            Explore the full story.
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-24" data-motion="left">
            <h2 className="text-5xl lg:text-7xl font-semibold" data-motion-item>iPhone.</h2>
            <h2 className="text-5xl lg:text-7xl font-semibold" data-motion-item>
              Forged in titanium.
            </h2>
          </div>

          <div className="flex-center flex-col sm:px-10">
            <div className="relative h-[50vh] w-full flex items-center" data-motion="scale">
              <video
                playsInline
                id="exploreVideo"
                className="w-full h-full object-cover object-center"
                preload="metadata"
                muted
                ref={videoRef}
                src={nearby ? exploreVideo : undefined}
              >
              </video>
            </div>

            <div className="flex flex-col w-full relative">
              <div className="feature-video-container">
                <div className="overflow-hidden flex-1 h-[50vh]" data-motion="left">
                  <img
                    src={explore1Img}
                    alt="titanium"
                    className="feature-video"
                  />
                </div>
                <div className="overflow-hidden flex-1 h-[50vh]" data-motion="right">
                  <img
                    src={explore2Img}
                    alt="titanium 2"
                    className="feature-video"
                  />
                </div>
              </div>

              <div className="feature-text-container">
                <div className="flex-1 flex-center" data-motion="up">
                  <p className="feature-text">
                    iPhone 15 Pro is{" "}
                    <span className="text-white">
                      the first iPhone to feature an aerospace-grade titanium
                      design
                    </span>
                    , using the same alloy that spacecrafts use for missions to
                    Mars.
                  </p>
                </div>

                <div className="flex-1 flex-center" data-motion="up">
                  <p className="feature-text">
                    Titanium has one of the best strength-to-weight ratios of any
                    metal, making these our{" "}
                    <span className="text-white">
                      lightest Pro models ever.
                    </span>{" "}
                    You&apos;ll notice the difference the moment you pick one up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
