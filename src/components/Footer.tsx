import { Copyright } from "lucide-react";
import { footerLinks } from "../constants";

/** Footer: shop text, divider, copyright (Lucide icon + current year), then footerLinks with separators. */
function Footer(): React.ReactElement {
  return (
    <footer className="py-5 sm:px-10 px-5">
      <div className="screen-max-width">
        <div data-motion="up">
          <p className="font-semibold text-gray text-xs" data-motion-item>
            More ways to shop:{" "}
            <span className="underline text-blue">Find an Apple Store </span>
            or <span className="underline text-blue">other retailer</span> near
            you.
          </p>
          <p className="font-semibold text-gray text-xs" data-motion-item>
            Or call 000800-040-1966
          </p>
        </div>

        <div className="bg-neutral-700 my-5 h-[1px] w-full" />

        <div className="flex md:flex-row flex-col md:items-center justify-between" data-motion="up">
          <p className="font-semibold text-gray text-xs flex items-center gap-1" data-motion-item>
            <Copyright className="w-3.5 h-3.5 shrink-0" aria-hidden />
            {new Date().getFullYear()}. All reserved.
          </p>
          <div className="flex" data-motion-item>
            {footerLinks.map((link, i) => (
              <p key={link} className="font-semibold text-gray text-xs">
                {link}{" "}
                {i !== footerLinks.length - 1 && (
                  <span className="mx-2"> | </span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
