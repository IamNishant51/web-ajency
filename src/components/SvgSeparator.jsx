"use client"; 

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 

gsap.registerPlugin(ScrollTrigger); 

const SvgSeparator = ({ idPrefix, animationDelay = 0.5, className = "" }) => {
  const containerRef = useRef(null); 
  const dPathRef = useRef(null);     
  const xLeg1aRef = useRef(null);   
  const xLeg1bRef = useRef(null);
  const xLeg2aRef = useRef(null);
  const xLeg2bRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const allPaths = [
      dPathRef.current,
      xLeg1aRef.current,
      xLeg1bRef.current,
      xLeg2aRef.current,
      xLeg2bRef.current
    ].filter(Boolean); 

    allPaths.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    const tl = gsap.timeline({
      paused: true, 
      defaults: { ease: "power2.out", duration: 1.5 }
    });

    if (dPathRef.current) {
      tl.to(dPathRef.current, { strokeDashoffset: 0, duration: 1.8, delay: animationDelay });
    }

    
    if (xLeg1aRef.current && xLeg1bRef.current && xLeg2aRef.current && xLeg2bRef.current) {
      tl.to(xLeg1aRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0")
        .to(xLeg2aRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0")
        .to(xLeg1bRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0")
        .to(xLeg2bRef.current, { strokeDashoffset: 0, duration: 1.2 }, ">-1.0");
    }

    tl.to(allPaths, {
        opacity: 0.7, 
        yoyo: true,    
        repeat: -1,   
        duration: 8,   
        ease: "sine.inOut",
        stagger: 0.3, 
    }, "+=0.5"); 

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%", 
      onEnter: () => tl.play(),
      
      once: true,
      id: `svg-separator-${idPrefix}`
    });

    return () => {
      tl.kill(); 
      
      ScrollTrigger.getById(`svg-separator-${idPrefix}`)?.kill();
    };
  }, [animationDelay, idPrefix]); 

  return (
    <div ref={containerRef} className={`w-full flex justify-center py-10 ${className}`}> 
      <svg
        className="w-28 h-28 md:w-36 md:h-36" 
        viewBox="0 0 100 100" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        
        <path
          ref={dPathRef}
          stroke="#4A4A4A" 
          strokeWidth="7" 
          d="M25 15 L25 85 C25 85 75 80 75 50 C75 20 25 15 25 15 Z"
        />

        <path ref={xLeg1aRef} stroke="#A0A0A0" strokeWidth="8" strokeOpacity="0.7" d="M10 10 L50 50" />
        <path ref={xLeg1bRef} stroke="#B0B0B0" strokeWidth="8" strokeOpacity="0.7" d="M50 50 L90 90" />
        <path ref={xLeg2aRef} stroke="#A0A0A0" strokeWidth="8" strokeOpacity="0.7" d="M90 10 L50 50" />
        <path ref={xLeg2bRef} stroke="#B0B0B0" strokeWidth="8" strokeOpacity="0.7" d="M50 50 L10 90" />
      </svg>
    </div>
  );
};

export default SvgSeparator;