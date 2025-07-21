// src/App.jsx
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import InteractiveBackground from "./components/InteractiveBackground";

import About from "./pages/About";
import Works from "./pages/Works";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

const App = () => {
  const lenisRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContentTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

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
      clearTimeout(loadContentTimer);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="lenis lenis-smooth" style={{ position: 'relative', zIndex: 1 }}>
      <Loader isLoading={isLoading} />
      <InteractiveBackground scrollProgress={scrollProgress} />

      {!isLoading && (
        <>
          <NavBar />
          
          {/* Main content sections with proper IDs for navigation */}
          <main>
            <section id="home">
              <Hero />
            </section>
            
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
          </main>
          
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;