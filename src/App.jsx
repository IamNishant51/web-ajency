// src/App.jsx
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Lenis from "lenis";
import NavBar from "./components/NavBar";
// REMOVED: import InteractiveBackground from "./components/InteractiveBackground"; // Remove this eager import

// Eager load Hero as it contains the LCP element.
// We've already ensured the LCP text within Hero doesn't have animation delays.
import Hero from "./components/Hero";

// Lazy load heavy components and pages
// ADDED: InteractiveBackground is now lazy loaded
const InteractiveBackground = lazy(() => import("./components/InteractiveBackground"));
const About = lazy(() => import("./pages/About"));
const Works = lazy(() => import("./pages/Works"));
const Skills = lazy(() => import("./pages/Skills"));
const Contact = lazy(() => import("./pages/Contact"));
const Footer = lazy(() => import("./components/Footer")); // Lazy load Footer too if it's large
const Loader = lazy(() => import("./components/Loader")); // Lazy load Loader if it's complex/heavy itself

const App = () => {
  const lenisRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Removed the artificial setTimeout delay previously
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ({ progress }) => {
      setScrollProgress(progress);
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return (
    <div className="lenis lenis-smooth" style={{ position: 'relative', zIndex: 1 }}>
      {/* Loader can be a simple, fast CSS-based loader if needed, or lazily loaded if complex */}
      <Suspense fallback={null}>
        <Loader />
      </Suspense>

      {/* LCP FIX: Lazy load InteractiveBackground with a placeholder fallback.
                  This ensures three.js (your biggest block) is not part of the initial load.
                  You might see a brief moment where the background is a solid color before the interactive one loads. */}
      <Suspense fallback={<div className="fixed inset-0 z-0 bg-white"></div>}> {/* Simple solid white background placeholder */}
        <InteractiveBackground scrollProgress={scrollProgress} />
      </Suspense>

      <>
        {/* NavBar remains eagerly loaded for immediate navigation */}
        <NavBar />
        
        <main>
          {/* Hero is loaded eagerly as it contains the LCP element.
              We've already removed animation delays from the LCP text within Hero. */}
          <section id="home">
            <Hero />
          </section>
          
          {/* Lazy load other content sections for performance */}
          <Suspense fallback={<div className="text-center p-8">Loading section...</div>}>
            <section id="about">
              <About />
            </section>
            
            <section id="works">
              <Works />
            </section>
            
            <section id="skills">
              <Skills />
            </section>
            
            <section id="contact">
              <Contact />
            </section>
          </Suspense>
        </main>
        
        {/* Footer is also lazy-loaded */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </>
    </div>
  );
};

export default App;