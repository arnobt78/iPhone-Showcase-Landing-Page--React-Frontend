import { rightImg, watchImg } from "../utils";
import VideoCarousel from "./VideoCarousel";

/** Section "Get the highlights": heading + two link lines + VideoCarousel. stagger animates links one after the other. */
function Highlights(): React.ReactElement {
  return (
    <section
      id="highlights"
      className="w-screen overflow-hidden h-full common-padding bg-zinc"
    >
      <div className="screen-max-width">
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1 id="title" className="section-heading" data-motion="up">
            Get the highlights.
          </h1>

          <div className="flex flex-wrap items-end gap-5" data-motion="up">
            <p className="link" data-motion-item>
              Watch the film
              <img src={watchImg} alt="watch" className="ml-2" />
            </p>
            <p className="link" data-motion-item>
              Watch the event
              <img src={rightImg} alt="right" className="ml-2" />
            </p>
          </div>
        </div>

        <VideoCarousel />
      </div>
    </section>
  );
}

export default Highlights;
