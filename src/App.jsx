import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Lenis from "lenis";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import AgencySections from "./components/AgencySections";

const InteractiveBackground = lazy(() => import("./components/InteractiveBackground"));
const About = lazy(() => import("./pages/About"));
const Works = lazy(() => import("./pages/Works"));
const Skills = lazy(() => import("./pages/Skills"));
const Contact = lazy(() => import("./pages/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const Loader = lazy(() => import("./components/Loader"));

const App = () => {
  const lenisRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
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

    const loaderTimeout = setTimeout(() => {
      setShowAppLoader(false);
    }, 3500);

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      clearTimeout(loaderTimeout);
    };
  }, []);

  return (

    <div className="lenis lenis-smooth overflow-x-hidden" style={{ position: 'relative', zIndex: 1 }}>
      {showAppLoader && (
        <Suspense fallback={null}>
          <Loader isLoading={showAppLoader} />
        </Suspense>
      )}

      <Suspense fallback={<div className="fixed inset-0 z-0 bg-white"></div>}>
        <InteractiveBackground scrollProgress={scrollProgress} />
      </Suspense>

      <>
        <NavBar />

        <main>
          <section id="hero">
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
          </Suspense>
          <AgencySections />
          <section id="contact">
            <Contact />
          </section>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </>
    </div>
  );
};

export default App;

//added one for commet