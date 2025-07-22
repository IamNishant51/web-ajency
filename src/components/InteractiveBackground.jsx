// src/components/InteractiveBackground.jsx
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
// ThemeContext import is removed
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const lerp = (a, b, t) => a + (b - a) * t;
const vec3Lerp = (vecA, vecB, t, targetVec) => {
  targetVec.x = lerp(vecA.x, vecB.x, t);
  targetVec.y = lerp(vecA.y, vecB.y, t);
  targetVec.z = lerp(vecA.z, vecB.z, t);
  return targetVec;
};

const NUM_PARTICLES = 10000;
const BASE_RADIUS = 1;
const TRANSITION_DURATION = 2000;
const SHAPE_CHANGE_INTERVAL = 4000;

// Shape Generators (These remain unchanged)
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

// --- InteractiveParticles ---
const InteractiveParticles = ({ scrollProgress, ...props }) => {
  const ref = useRef();

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

  const currentPositions = useRef(new Float32Array(NUM_PARTICLES * 3));
  const targetPositions = useRef(new Float32Array(NUM_PARTICLES * 3));

  const initialParticles = useMemo(() => {
    const pos = shapeGenerators[0]();
    currentPositions.current.set(pos);
    return pos;
  }, [shapeGenerators]);

  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempVecA = useMemo(() => new THREE.Vector3(), []);
  const tempVecB = useMemo(() => new THREE.Vector3(), []);

  // Hardcoded particle color for white theme: a subtle light blue
  const particleColor = "#87CEEB"; // Light Sky Blue

  useEffect(() => {
    const startTransition = () => {
      setIsTransitioning(true);
      let nextShapeIdx;
      do {
        nextShapeIdx = Math.floor(Math.random() * shapeGenerators.length);
      } while (nextShapeIdx === currentShapeIndex);

      if (
        ref.current &&
        ref.current.geometry &&
        ref.current.geometry.attributes.position
      ) {
        currentPositions.current.set(
          ref.current.geometry.attributes.position.array
        );
      } else {
        currentPositions.current.set(shapeGenerators[currentShapeIndex]());
      }

      targetPositions.current.set(shapeGenerators[nextShapeIdx]());
      setTransitionProgress(0);
      setCurrentShapeIndex(nextShapeIdx);
    };

    const intervalId = setInterval(startTransition, SHAPE_CHANGE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [currentShapeIndex, shapeGenerators]);

  useFrame((state, delta) => {
    ref.current.rotation.x =
      -scrollProgress * Math.PI + state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.y =
      -scrollProgress * Math.PI + state.clock.getElapsedTime() * 0.05;

    if (state.mouse.x !== null && state.mouse.y !== null) {
      const { x, y } = state.mouse;
      ref.current.rotation.y += x * delta * 0.2;
      ref.current.rotation.x += y * delta * 0.2;
    }

    if (isTransitioning) {
      const newProgress = Math.min(
        transitionProgress + delta / (TRANSITION_DURATION / 1000),
        1
      );
      setTransitionProgress(newProgress);

      const positionsArray = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        tempVecA.set(
          currentPositions.current[i * 3],
          currentPositions.current[i * 3 + 1],
          currentPositions.current[i * 3 + 2]
        );
        tempVecB.set(
          targetPositions.current[i * 3],
          targetPositions.current[i * 3 + 1],
          targetPositions.current[i * 3 + 2]
        );
        vec3Lerp(tempVecA, tempVecB, newProgress, tempVec);
        positionsArray[i * 3] = tempVec.x;
        positionsArray[i * 3 + 1] = tempVec.y;
        positionsArray[i * 3 + 2] = tempVec.z;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;

      if (newProgress === 1) {
        setIsTransitioning(false);
        currentPositions.current.set(targetPositions.current);
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={initialParticles}
        stride={3}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color={particleColor} // Using the new light blue color
          size={0.02}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// --- InteractiveBackground ---
const InteractiveBackground = ({ scrollProgress }) => {
  // Dynamic background color: black in dark mode, white in light mode
  const [backgroundColor, setBackgroundColor] = useState("#F5F5F7");
  const [cameraZ, setCameraZ] = useState(2);

  useEffect(() => {
    const updateBg = () => {
      // Check for Tailwind dark mode class on <html>
      if (document.documentElement.classList.contains('dark')) {
        setBackgroundColor("#111112");
      } else {
        setBackgroundColor("#F5F5F7");
      }
    };
    updateBg();
    // Listen for theme changes (NavBar sets class on <html>)
    const observer = new MutationObserver(updateBg);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setCameraZ(w < 768 ? 3 : w < 1024 ? 2.5 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        transition: 'background 0.4s',
      }}
    >
      <Canvas camera={{ position: [0, 0, cameraZ] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />

        <Suspense fallback={null}>
          <InteractiveParticles scrollProgress={scrollProgress} />
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={2.2}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.35}
            kernelSize={5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default InteractiveBackground;