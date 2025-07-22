// src/App.jsx
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Lenis from "lenis";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";

// Lazy load heavy components and pages
const InteractiveBackground = lazy(() => import("./components/InteractiveBackground"));
const About = lazy(() => import("./pages/About"));
const Works = lazy(() => import("./pages/Works"));
const Skills = lazy(() => import("./pages/Skills"));
const Contact = lazy(() => import("./pages/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const Loader = lazy(() => import("./components/Loader")); // Loader is still lazy-loaded

const App = () => {
  const lenisRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  // ADD THIS STATE: This state now explicitly controls the loader's visibility
  const [showAppLoader, setShowAppLoader] = useState(true);

  useEffect(() => {
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

    // This setTimeout now controls when the loader is "done" from App's perspective
    // Adjust the duration (e.g., 3500ms for 2.8s progress + 0.6s exit delay)
    const loaderTimeout = setTimeout(() => {
      setShowAppLoader(false); // Signal the loader to start its exit animation
    }, 3500); // Give enough time for the loader's internal animations

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      clearTimeout(loaderTimeout); // Clean up the timeout
    };
  }, []);

  return (
    <div className="lenis lenis-smooth" style={{ position: 'relative', zIndex: 1 }}>
      {/* Conditionally render Loader based on showAppLoader state */}
      {/* The Loader will now receive a proper boolean prop */}
      {showAppLoader && (
        <Suspense fallback={null}>
          <Loader isLoading={showAppLoader} /> {/* Pass the state as the isLoading prop */}
        </Suspense>
      )}

      {/* Your main content below, it will be visible after the loader unmounts */}
      <Suspense fallback={<div className="fixed inset-0 z-0 bg-white"></div>}>
        <InteractiveBackground scrollProgress={scrollProgress} />
      </Suspense>

      <>
        <NavBar />
        
        <main>
          <section id="home">
            <Hero />
          </section>
          
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
        
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </>
    </div>
  );
};

export default App;