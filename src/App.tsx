import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Model from "./components/Model";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import * as Sentry from "@sentry/react";
import { usePageMotion } from "./hooks/usePageMotion";

/** Root App: single-page layout. Each child is a full-width section; order = scroll order. */
function AppRoot(): React.ReactElement {
  const root = usePageMotion();
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
