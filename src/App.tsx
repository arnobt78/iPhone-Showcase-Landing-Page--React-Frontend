import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Model from "./components/Model";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import * as Sentry from "@sentry/react";
import { useLayoutEffect } from "react";
import { usePageMotion } from "./hooks/usePageMotion";

/** Root App: single-page layout. Each child is a full-width section; order = scroll order. */
function AppRoot(): React.ReactElement {
  const root = usePageMotion();

  useLayoutEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    // Restore history positions normally; React creates the anchor too late for fresh loads.
    if (navigation?.type !== "back_forward" && window.location.hash === "#highlights") {
      document.getElementById("highlights")?.scrollIntoView({ behavior: "instant" });
    }
  }, []);
  return (
    <main ref={root} className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}

const App = import.meta.env.VITE_SENTRY_DSN ? Sentry.withProfiler(AppRoot) : AppRoot;
export default App;
