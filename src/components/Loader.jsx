// src/components/Loader.jsx
"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three'; // Import THREE for geometries and materials

// --- Wireframe 3D Model Component ---
function WireframeModel({ isExiting }) {
  const meshRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    // Initial animation for the model's appearance
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .fromTo(meshRef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.8, ease: 'elastic.out(1, 0.5)', delay: 0.5 })
      .fromTo(meshRef.current.rotation, { x: 0, y: 0, z: 0 }, { x: Math.PI * 2, y: Math.PI * 2, duration: 2.5, ease: 'power2.out', delay: 0.5 }, "<");

    // Adjust camera for a slightly closer, more imposing view if needed
    gsap.fromTo(camera.position, { z: 6 }, { z: 3.5, duration: 2, ease: 'power2.out' });

  }, [camera]);

  useFrame(() => {
    // Continuous subtle rotation
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002; // Very slow rotation
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Exit animation for the model
  useEffect(() => {
    if (isExiting) {
      gsap.to(meshRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'power2.inOut' });
      gsap.to(meshRef.current.rotation, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'power2.inOut' });
    }
  }, [isExiting]);

  return (
    <mesh ref={meshRef} scale={[0, 0, 0]}> {/* Start scaled to 0 */}
      {/* Using a DodecahedronGeometry for a complex, appealing wireframe shape */}
      <dodecahedronGeometry args={[1.2, 0]} /> {/* Size, and 0 for no detail subdivision */}
      {/* Wireframe material: dark lines on transparent background implicitly */}
      <meshBasicMaterial color="#4A4A4A" wireframe={true} />
    </mesh>
  );
}

// --- Main Loader Component ---
const Loader = ({ isLoading }) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const loaderRef = useRef(); // Ref for the main loader div
  const [currentProgress, setCurrentProgress] = useState(0); // State for loading number

  useEffect(() => {
    let progressTimeline;

    if (!isLoading) {
      // Animate out text and number elements
      gsap.to('.loader-text-line', { opacity: 0, y: -20, stagger: 0.05, duration: 0.5, ease: 'power1.in' });
      gsap.to('.loading-number', { opacity: 0, y: -20, duration: 0.5, ease: 'power1.in' });

      // Animate out the entire loader overlay
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.8, // Duration of the fade out
        delay: 0.6, // Delay after text and 3D model start exiting
        ease: 'power2.in',
        onComplete: () => setShowLoader(false) // Unmount component after animation
      });
    } else {
      setShowLoader(true);

      // Animate in text elements
      gsap.fromTo('.loader-text-line', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out', delay: 1 });

      // Animate the loading number
      const progressObject = { value: 0 }; // Object to animate for progress
      progressTimeline = gsap.to(progressObject, {
        value: 100,
        duration: 2.8, // Match this duration closely to your App.jsx setTimeout
        ease: 'power1.out',
        onUpdate: () => {
          setCurrentProgress(Math.floor(progressObject.value));
        },
        onComplete: () => {
          // Ensure it hits 100% and then animates out
          setCurrentProgress(100);
        }
      });
    }

    return () => {
      // Cleanup GSAP animation on unmount
      if (progressTimeline) {
        progressTimeline.kill();
      }
    };
  }, [isLoading]);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={loaderRef}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center
                     bg-white text-gray-900 overflow-hidden" // White background, dark text
          initial={{ opacity: 1 }} // Only keep the initial state here for Framer Motion
        >
          {/* 3D Model Canvas */}
          <div className="w-full h-1/2 flex items-center justify-center pb-4"> {/* Adjusted height for model */}
            <Suspense fallback={null}>
              <Canvas camera={{ position: [0, 0, 3.5], fov: 75 }}> {/* Adjusted camera pos */}
                {/* Minimal lighting for wireframe */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <WireframeModel isExiting={!isLoading} />
              </Canvas>
            </Suspense>
          </div>

          {/* Loading Number */}
          <motion.div
            className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-gray-900 loading-number mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }} // <-- **FIXED: Changed 'power2.out' to 'easeOut'**
          >
            {currentProgress}%
          </motion.div>

          {/* Text content (Nishant brand) */}
          <div className="text-center font-bold flex flex-col items-center justify-center w-full px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2 flex flex-wrap justify-center items-center">
              <span className="text-gray-900 loader-text-line">Nishant</span>
              <span className="ml-2 text-gray-700 loader-text-line">— The Web Architect</span> {/* Subtler Architect text */}
            </h1>
            <p className="text-md sm:text-lg md:text-xl font-light text-gray-600 mt-2 max-w-xl mx-auto loader-text-line">
              Crafting smooth, modern, and smart digital experiences.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;