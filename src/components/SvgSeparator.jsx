// src/components/SvgSeparator.jsx
"use client"; // Required for client-side hooks and GSAP

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger

gsap.registerPlugin(ScrollTrigger); // Register the ScrollTrigger plugin

const SvgSeparator = ({ idPrefix, animationDelay = 0.5, className = "" }) => {
  const containerRef = useRef(null); // Ref for the whole SVG container for ScrollTrigger
  const dPathRef = useRef(null);     // Ref for the 'D' path
  const xLeg1aRef = useRef(null);    // Refs for 'X' paths
  const xLeg1bRef = useRef(null);
  const xLeg2aRef = useRef(null);
  const xLeg2bRef = useRef(null);

  useEffect(() => {
    // Ensure the container ref is available for ScrollTrigger
    if (!containerRef.current) return;

    // Collect all animatable paths
    const allPaths = [
      dPathRef.current,
      xLeg1aRef.current,
      xLeg1bRef.current,
      xLeg2aRef.current,
      xLeg2bRef.current
    ].filter(Boolean); // Filter out any null refs

    // Set initial stroke-dasharray and stroke-dashoffset to hide the lines
    allPaths.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    // Create the main animation timeline, initially paused
    const tl = gsap.timeline({
      paused: true, // We'll control playback with ScrollTrigger
      defaults: { ease: "power2.out", duration: 1.5 } // Default animation settings
    });

    // Animate the 'D' path drawing in
    if (dPathRef.current) {
      tl.to(dPathRef.current, { strokeDashoffset: 0, duration: 1.8, delay: animationDelay });
    }

    // Animate the 'X' paths drawing in, slightly after the 'D' starts
    // Use relative positioning for staggered effect: ">-X" means X seconds before previous animation ends
    if (xLeg1aRef.current && xLeg1bRef.current && xLeg2aRef.current && xLeg2bRef.current) {
      tl.to(xLeg1aRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0")
        .to(xLeg2aRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0")
        .to(xLeg1bRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0")
        .to(xLeg2bRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0");
    }

    // Optional: Subtle continuous pulse effect for all paths after they've drawn
    tl.to(allPaths, {
        opacity: 0.7, // Slightly reduce opacity
        yoyo: true,    // Animate back and forth
        repeat: -1,    // Loop indefinitely
        duration: 8,   // Very slow pulse
        ease: "sine.inOut",
        stagger: 0.3,  // Stagger the pulse start for each path
    }, "+=0.5"); // Start this pulse 0.5s after the drawing animation finishes

    // Set up ScrollTrigger to play the timeline when the component enters view
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%", // Animation starts when the top of the separator is 80% down the viewport
      // end: "bottom top", // You can define an end point if you want to control its playback
      onEnter: () => tl.play(), // Play the timeline when entering
      // onLeaveBack: () => tl.reverse(), // Optional: reverse when scrolling back up
      once: true, // Ensures the animation plays only once when triggered
      id: `svg-separator-${idPrefix}` // Unique ID for ScrollTrigger instance (useful for debugging)
    });

    // Cleanup function for ScrollTrigger and GSAP timeline on component unmount
    return () => {
      tl.kill(); // Kill the GSAP timeline
      // Kill the ScrollTrigger instance by its ID to prevent memory leaks
      ScrollTrigger.getById(`svg-separator-${idPrefix}`)?.kill();
    };
  }, [animationDelay, idPrefix]); // Re-run effect if these props change

  return (
    <div ref={containerRef} className={`w-full flex justify-center py-10 ${className}`}> {/* Increased vertical padding */}
      <svg
        className="w-28 h-28 md:w-36 md:h-36" // Adjusted size for the combined D and X
        viewBox="0 0 100 100" // Standard viewBox for square aspect ratio
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/*
          IMPORTANT:
          - Adjust 'stroke' colors and 'strokeWidth' to precisely match your logo.
          - The 'd' attributes define the path. These are example paths.
            You might need an SVG editor (like Figma, Illustrator, Inkscape, or a web tool like svg-path-editor.com)
            to get the exact paths for your stylized 'D' and 'X' if they are complex.
        */}

        {/* 'D' Background Shape (Base Layer) */}
        <path
          ref={dPathRef}
          stroke="#4A4A4A" // Example: Darker gray for the 'D'
          strokeWidth="7"  // Example: Thicker stroke for the 'D'
          // Example 'd' for a stylized 'D'
          d="M25 15 L25 85 C25 85 75 80 75 50 C75 20 25 15 25 15 Z"
        />

        {/* 'X' Shape (Top Layer) - with slightly lower opacity or lighter color */}
        {/* Use the same paths as before for the 'X', adjusting colors/opacity */}
        <path ref={xLeg1aRef} stroke="#A0A0A0" strokeWidth="8" strokeOpacity="0.7" d="M10 10 L50 50" />
        <path ref={xLeg1bRef} stroke="#B0B0B0" strokeWidth="8" strokeOpacity="0.7" d="M50 50 L90 90" />
        <path ref={xLeg2aRef} stroke="#A0A0A0" strokeWidth="8" strokeOpacity="0.7" d="M90 10 L50 50" />
        <path ref={xLeg2bRef} stroke="#B0B0B0" strokeWidth="8" strokeOpacity="0.7" d="M50 50 L10 90" />
      </svg>
    </div>
  );
};

export default SvgSeparator;