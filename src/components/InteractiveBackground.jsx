"use client";

import {
  useState,
  useRef,
  Suspense,
  useMemo,
  useEffect,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import { Vector3, AdditiveBlending } from "three"; 

import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { gsap } from "gsap"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Utility function (no change, already efficient)
const lerp = (a, b, t) => a + (b - a) * t;
const vec3Lerp = (vecA, vecB, t, targetVec) => {
  targetVec.x = lerp(vecA.x, vecB.x, t);
  targetVec.y = lerp(vecA.y, vecB.y, t);
  targetVec.z = lerp(vecA.z, vecB.z, t);
  return targetVec;
};

// --- OPTIMIZATION: REDUCE PARTICLE COUNT ---
// This is the most effective change for the 'requestAnimationFrame' violation.
// 10,000 particles is very demanding for per-frame CPU calculations.
// Reducing this significantly will have a major impact on performance.
// Start with 2000-5000 and adjust based on visual quality and performance.
const NUM_PARTICLES = 3000; // Reduced from 10000
const BASE_RADIUS = 1;
const TRANSITION_DURATION = 2000;
const SHAPE_CHANGE_INTERVAL = 4000;

// Particle generation functions (adjusted to new NUM_PARTICLES automatically)
const generateSpherePositions = () =>
  random.inSphere(new Float32Array(NUM_PARTICLES * 3), { radius: BASE_RADIUS });

const generateBoxPositions = () => {
  const positions = new Float32Array(NUM_PARTICLES * 3);
  const size = BASE_RADIUS * 1.8;
  const half = size / 2;
  for (let i = 0; i < NUM_PARTICLES; i++) {
    positions[i * 3] = Math.random() * size - half;
    positions[i * 3 + 1] = Math.random() * size - half;
    positions[i * 3 + 2] = Math.random() * size - half;
  }
  return positions;
};

const generateCylinderPositions = () => {
  const positions = new Float32Array(NUM_PARTICLES * 3);
  const radius = BASE_RADIUS * 0.8;
  const height = BASE_RADIUS * 2.5;
  const halfH = height / 2;
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    positions[i * 3] = r * Math.cos(angle);
    positions[i * 3 + 1] = Math.random() * height - halfH;
    positions[i * 3 + 2] = r * Math.sin(angle);
  }
  return positions;
};

const generateTorusPositions = () => {
  const positions = new Float32Array(NUM_PARTICLES * 3);
  const R = BASE_RADIUS * 1.2;
  const r = BASE_RADIUS * 0.4;
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const y = (R + r * Math.cos(v)) * Math.sin(u);
    const z = r * Math.sin(v);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

const generateHeartPositions = () => {
  const positions = new Float32Array(NUM_PARTICLES * 3);
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const t = Math.random() * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    const z = (Math.random() - 0.5) * BASE_RADIUS * 2;
    positions[i * 3] = (x / 16) * BASE_RADIUS;
    positions[i * 3 + 1] = (y / 13) * BASE_RADIUS;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

const generateSpiralPositions = () => {
  const positions = new Float32Array(NUM_PARTICLES * 3);
  const coils = 10;
  const height = BASE_RADIUS * 3;
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const t = (i / NUM_PARTICLES) * Math.PI * 2 * coils;
    const x = Math.cos(t) * BASE_RADIUS;
    const y = (i / NUM_PARTICLES) * height - height / 2;
    const z = Math.sin(t) * BASE_RADIUS;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

const generateTorusKnotPositions = () => {
  const positions = new Float32Array(NUM_PARTICLES * 3);
  const p = 2, q = 3;
  const R = BASE_RADIUS;
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const t = (i / NUM_PARTICLES) * Math.PI * 2 * 3;
    const x = (R + Math.cos(q * t)) * Math.cos(p * t);
    const y = (R + Math.cos(q * t)) * Math.sin(p * t);
    const z = Math.sin(q * t);
    positions[i * 3] = x * 0.4;
    positions[i * 3 + 1] = y * 0.4;
    positions[i * 3 + 2] = z * 0.4;
  }
  return positions;
};

const InteractiveParticles = ({ scrollProgress, ...props }) => {
  const ref = useRef();

  // Memoize shape generators to ensure they are stable
  const shapeGenerators = useMemo(
    () => [
      generateSpherePositions,
      generateBoxPositions,
      generateCylinderPositions,
      generateTorusPositions,
      generateHeartPositions,
      generateSpiralPositions,
      generateTorusKnotPositions,
    ],
    []
  );

  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use refs for positions that are updated frequently in useFrame
  const currentPositions = useRef(new Float32Array(NUM_PARTICLES * 3));
  const targetPositions = useRef(new Float32Array(NUM_PARTICLES * 3));

  // Initialize particles once
  const initialParticles = useMemo(() => {
    const pos = shapeGenerators[0]();
    currentPositions.current.set(pos);
    return pos;
  }, [shapeGenerators]);

  // Use memoized Vector3 instances to avoid re-creation in the loop
  const tempVec = useMemo(() => new Vector3(), []); 
  const tempVecA = useMemo(() => new Vector3(), []);
  const tempVecB = useMemo(() => new Vector3(), []);

  const particleColor = "#87CEEB"; 

  useEffect(() => {
    const startTransition = () => {
      setIsTransitioning(true);
      let nextShapeIdx;
      do {
        nextShapeIdx = Math.floor(Math.random() * shapeGenerators.length);
      } while (nextShapeIdx === currentShapeIndex);

      // Capture current state of particles for smooth transition
      // Only set from geometry if it exists, otherwise use the last known shape
      if (
        ref.current &&
        ref.current.geometry &&
        ref.current.geometry.attributes.position
      ) {
        currentPositions.current.set(
          ref.current.geometry.attributes.position.array
        );
      } else {
        // Fallback: If ref.current.geometry.attributes.position is not ready,
        // use the last known shape's generated positions.
        currentPositions.current.set(shapeGenerators[currentShapeIndex]());
      }

      targetPositions.current.set(shapeGenerators[nextShapeIdx]());
      setTransitionProgress(0); // Reset progress for new transition
      setCurrentShapeIndex(nextShapeIdx);
    };

    // Set up interval for shape changes
    const intervalId = setInterval(startTransition, SHAPE_CHANGE_INTERVAL);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentShapeIndex, shapeGenerators]); // Dependencies: reruns if shapeGenerators or currentShapeIndex changes

  useFrame((state, delta) => {
    // Rotation based on scroll and time
    ref.current.rotation.x =
      -scrollProgress * Math.PI + state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.y =
      -scrollProgress * Math.PI + state.clock.getElapsedTime() * 0.05;

    // Mouse interaction for rotation
    if (state.mouse.x !== null && state.mouse.y !== null) {
      const { x, y } = state.mouse;
      // Reduce the rotation speed from mouse for less jitter or over-sensitivity
      ref.current.rotation.y += x * delta * 0.1; // Reduced from 0.2
      ref.current.rotation.x += y * delta * 0.1; // Reduced from 0.2
    }

    // Particle transition logic
    if (isTransitioning) {
      const newProgress = Math.min(
        transitionProgress + delta / (TRANSITION_DURATION / 1000),
        1
      );
      setTransitionProgress(newProgress); // Trigger re-render to update state

      const positionsArray = ref.current.geometry.attributes.position.array;
      // --- OPTIMIZATION: Reduce calculations inside the loop if possible ---
      // The core loop is the bottleneck. The `vec3Lerp` already uses
      // memoized Vector3s, which is good. Reducing NUM_PARTICLES is the key here.
      // No further micro-optimizations seem immediately apparent for this loop
      // without changing the core interpolation logic significantly.
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const i3 = i * 3; // Cache multiplied index
        tempVecA.set(
          currentPositions.current[i3],
          currentPositions.current[i3 + 1],
          currentPositions.current[i3 + 2]
        );
        tempVecB.set(
          targetPositions.current[i3],
          targetPositions.current[i3 + 1],
          targetPositions.current[i3 + 2]
        );
        vec3Lerp(tempVecA, tempVecB, newProgress, tempVec);
        positionsArray[i3] = tempVec.x;
        positionsArray[i3 + 1] = tempVec.y;
        positionsArray[i3 + 2] = tempVec.z;
      }

      ref.current.geometry.attributes.position.needsUpdate = true; // Flag for GPU update

      if (newProgress === 1) {
        setIsTransitioning(false); // End transition state
        currentPositions.current.set(targetPositions.current); // Update current position to target for next transition
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={initialParticles}
        stride={3}
        frustumCulled // Allows Three.js to not render particles outside the camera view
        {...props}
      >
        <PointMaterial
          transparent
          color={particleColor} 
          size={0.02}
          sizeAttenuation // Points appear smaller when further away
          depthWrite={false} // Avoid z-fighting issues with transparent points
          blending={AdditiveBlending} // Makes points glow and blend
        />
      </Points>
    </group>
  );
};

const InteractiveBackground = ({ scrollProgress }) => {
  const [backgroundColor, setBackgroundColor] = useState("#F5F5F7");
  const [cameraZ, setCameraZ] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  // Effect to handle dark/light mode background color
  useEffect(() => {
    const updateBg = () => {
      if (document.documentElement.classList.contains('dark')) {
        setBackgroundColor("#111112");
      } else {
        setBackgroundColor("#F5F5F7");
      }
    };
    updateBg(); // Initial check
    // Observe changes to the 'class' attribute on the documentElement (for dark mode toggling)
    const observer = new MutationObserver(updateBg);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect(); // Cleanup observer
  }, []);

  // Effect to handle camera position and mobile state based on window size
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setCameraZ(w < 768 ? 3 : w < 1024 ? 2.5 : 2);
      setIsMobile(w < 768);
    };
    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);

  // Disable scroll-based particle rotation on mobile for performance/UX
  const effectiveScrollProgress = isMobile ? 0 : scrollProgress;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        background: backgroundColor,
        transition: 'background 0.4s', // Smooth background transition
      }}
    >
      <Canvas camera={{ position: [0, 0, cameraZ] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />

        <Suspense fallback={null}>
          {/* Pass effectiveScrollProgress to InteractiveParticles */}
          <InteractiveParticles scrollProgress={effectiveScrollProgress} />
        </Suspense>

        {/* --- OPTIMIZATION: Conditionally render Bloom for performance on mobile --- */}
        {/* Bloom is computationally expensive. Disabling it on smaller screens can boost performance. */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={5.2}
              luminanceThreshold={0.90}
              luminanceSmoothing={0.40}
              kernelSize={5}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default InteractiveBackground;