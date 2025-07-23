"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three'; 

function WireframeModel({ isExiting }) {
  const meshRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .fromTo(meshRef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.8, ease: 'elastic.out(1, 0.5)', delay: 0.3 })
      .fromTo(meshRef.current.rotation, { x: 0, y: 0, z: 0 }, { x: Math.PI * 2, y: Math.PI * 2, duration: 2.5, ease: 'power2.out', delay: 0.3 }, "<");

    gsap.fromTo(camera.position, { z: 6 }, { z: 3.5, duration: 1, ease: 'power2.out' });

  }, [camera]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002; 
      meshRef.current.rotation.y += 0.002;
    }
  });

  
  useEffect(() => {
    if (isExiting) {
      gsap.to(meshRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: 'power2.inOut' });
      gsap.to(meshRef.current.rotation, { x: 0, y: 0, z: 0, duration: 0.5, ease: 'power2.inOut' });
    }
  }, [isExiting]);

  return (
    <mesh ref={meshRef} scale={[0, 0, 0]}> 
      <dodecahedronGeometry args={[1.2, 0]} /> 
      <meshBasicMaterial color="#4A4A4A" wireframe={true} />
    </mesh>
  );
}

const Loader = ({ isLoading }) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const loaderRef = useRef(); 
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    let progressTimeline;

    if (!isLoading) {
      gsap.to('.loader-text-line', { opacity: 0, y: -20, stagger: 0.05, duration: 0.3, ease: 'power1.in' });
      gsap.to('.loading-number', { opacity: 0, y: -20, duration: 0.3, ease: 'power1.in' });

      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.6, 
        delay: 0.5,
        ease: 'power2.in',
        onComplete: () => setShowLoader(false) 
      });
    } else {
      setShowLoader(true);

      gsap.fromTo('.loader-text-line', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 1 });

      const progressObject = { value: 0 }; 
      progressTimeline = gsap.to(progressObject, {
        value: 100,
        duration: 2.2, 
        ease: 'power1.out',
        onUpdate: () => {
          setCurrentProgress(Math.floor(progressObject.value));
        },
        onComplete: () => {
          setCurrentProgress(100);
        }
      });
    }

    return () => {
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
                     bg-white text-gray-900 overflow-hidden" 
          initial={{ opacity: 1 }}
        >
          {/* 3D Model */}
          <div className="w-full h-1/2 flex items-center justify-center pb-4"> 
            <Suspense fallback={null}>
              <Canvas camera={{ position: [0, 0, 3.5], fov: 75 }}> 
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <WireframeModel isExiting={!isLoading} />
              </Canvas>
            </Suspense>
          </div>

          <motion.div
            className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-gray-900 loading-number mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }} 
          >
            {currentProgress}%
          </motion.div>
          <div className="text-center font-bold flex flex-col items-center justify-center w-full px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2 flex flex-wrap justify-center items-center">
              <span className="text-gray-900 loader-text-line">Web-Bridge</span>
              <span className="ml-2 text-blue-400 loader-text-line">— Web-Developer's</span> 
            </h1>
            <p className="text-md sm:text-lg md:text-xl font-light text-gray-900 mt-2 max-w-xl mx-auto loader-text-line">
              Crafting smooth, modern, and smart digital experiences.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;