// src/App.jsx
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
// Removed motion import because it's now handled within individual page components
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
// Removed SvgSeparator import as it's now imported in page components
import InteractiveBackground from "./components/InteractiveBackground";

// Import the new page components from the 'pages' folder
import About from "./pages/About";
import Works from "./pages/Works";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";

const App = () => {
  const lenisRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);

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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="lenis lenis-smooth" style={{ position: 'relative', zIndex: 1 }}>
      {/* Interactive Background - fixed at zIndex: -1 */}
      <InteractiveBackground scrollProgress={scrollProgress} />

      <NavBar />

      <Hero />

      {/* Render the new page components */}
      <About />
      <Works />
      <Skills />
      <Contact />
    </div>
  );
};

export default App;