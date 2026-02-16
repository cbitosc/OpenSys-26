import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView, useReducedMotion } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Events from "./components/Events";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import BeautifulBackground from "./components/Animations/BeautifulBackground";
import WillemLoading from "./components/WillemLoading";


const Gallery = lazy(() => import("./components/Gallery"));

// Main landing page component
const Section = ({ id, className = "", children }) => {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const disableMotion = prefersReducedMotion || isMobile;
  const inView = useInView(sectionRef, { amount: 0.15, once: disableMotion });

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className={`section-wrapper min-h-screen flex items-center justify-center scroll-mt-28 ${className}`}
      initial={disableMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      animate={{
        opacity: inView || disableMotion ? 1 : 0,
        scale: inView || disableMotion ? 1 : 0.98
      }}
      style={{
        pointerEvents: inView || disableMotion ? "auto" : "none",
        visibility: inView || disableMotion ? "visible" : "hidden"
      }}
      transition={{
        duration: disableMotion ? 0 : isMobile ? 0.4 : 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: disableMotion ? 0 : 0.4 }
      }}
    >
      {children}
    </motion.section>
  );
};

const HomePage = () => {
  return (
    <div className="w-full">
      <Hero />
      <Section id="about">
        <About />
      </Section>
      <Section id="events">
        <Events />
      </Section>
      <Section id="gallery">
        <Suspense fallback={null}>
          <Gallery />
        </Suspense>
      </Section>
      <Section id="faq" className="min-h-screen">
        <Faq />
      </Section>
      <Footer />
    </div>
  );
};

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const appContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    // Failsafe: Auto-hide loading screen after 3 seconds
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div
      ref={appContainer}
      className="bg-[#1a0a2e] relative min-h-screen" /* Darker purple background */
    >
      {isLoading && <WillemLoading onComplete={handleLoadingComplete} />}

      {!isLoading && (
        <div className="animate-fade-in"> {/* Wrapper for smooth entry if needed, otherwise just render */}
          <BeautifulBackground />
          <div className="relative z-10">
            <div className="flex items-center justify-center">
              <Navbar />
            </div>

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
