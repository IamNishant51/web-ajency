// src/components/ProfileHeroCard.jsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Instagram } from 'lucide-react';
import gsap from 'gsap';

// Import your profile image and logo
const profileImageSrc = '/nishant.png'; // Path to your profile image in the public folder
const logoImageSrc = '/logo.png'; // Path to your logo in the public folder (for background)

const ProfileHeroCard = () => {
  const cardRef = useRef(null);
  const profileImageRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // GSAP for 3D Tilt and Spotlight Interaction - Tuned for smoother animation
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMousePosition({ x, y });

    const centerX = width / 2;
    const centerY = height / 2;
    const rotateX = (y - centerY) / 20; // More subtle tilt sensitivity
    const rotateY = (x - centerX) / -20; // More subtle tilt sensitivity

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02, // Subtle scale on hover
      ease: "power2.out", // Smoother entry ease
      duration: 0.4, // Slightly longer duration for smoothness
      transformPerspective: 1000
    });

    // Profile image reaction - More subtle movement and scale
    gsap.to(profileImageRef.current, {
      x: (x - centerX) / 25, // More subtle image movement horizontally
      y: (y - centerY) / 25, // More subtle image movement vertically
      scale: 1.02, // Less pronounced scale for the image
      ease: "power2.out", // Smoother entry ease
      duration: 0.4
    });

  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1, // Reset scale
      ease: "power2.inOut", // Smoother reset ease, less bouncy
      duration: 0.5 // Faster reset for responsiveness
    });

    gsap.to(profileImageRef.current, {
      x: 0, y: 0, // Reset image position
      scale: 1, // Reset image scale
      ease: "power2.inOut", // Smoother reset ease
      duration: 0.5
    });
  }, []);

  // Spotlight effect style (consistent with Skill Cards)
  const spotlightStyle = {
    background: isHovered
      ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent 70%)`
      : 'transparent',
  };

  const initialLoadVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center
                 w-64 h-[380px] sm:w-72 sm:h-[420px] lg:w-80 lg:h-[450px]
                 bg-white/[0.1] backdrop-blur-md border border-gray-200/[0.2] // Glassmorphism base
                 cursor-pointer overflow-hidden
                 perspective-1000 group // Added 'group' class for hover effects
                 "
      style={{ transformStyle: 'preserve-3d' }}
      variants={initialLoadVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Spotlight Effect */}
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{ ...spotlightStyle, opacity: isHovered ? 1 : 0 }}
      ></div>

      {/* Animated Border Gradient (consistent with Skill Cards) */}
      <div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/[0.2] via-purple-500/[0.2] to-blue-500/[0.2] blur-sm"></div>
      </div>
      
      {/* Background Gradient on Hover (New - consistent with Skill Cards) */}
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 
                      bg-gradient-to-br from-blue-500/[0.05] via-purple-500/[0.05] to-blue-500/[0.05] rounded-3xl"></div>


      {/* Subtle radial gradient for depth and light reflection (like glass) */}
      <div className="absolute inset-0 z-10 opacity-20"
           style={{
             background: 'radial-gradient(circle at top left, rgba(255,255,255,0.3) 0%, transparent 50%)'
           }}
      ></div>

      {/* Logo in background */}
      <img
        src={logoImageSrc}
        alt="Nishant's Logo Background"
        className="absolute inset-0 w-full h-full object-contain p-12 opacity-5 pointer-events-none z-10"
      />

      {/* Profile Image */}
      <motion.div
        ref={profileImageRef}
        className="relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden z-20 mb-5 md:mb-6 border-4 border-white/50 shadow-xl"
        style={{ transform: 'translateZ(40px)' }}
      >
        <img
          src={profileImageSrc}
          alt="Nishant - The Web Architect"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* User Info */}
      <div className="text-center z-20" style={{ transform: 'translateZ(20px)' }}>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2"> 
          Nishant
        </h2>
        <p className="text-md md:text-lg lg:text-xl text-sky-600 font-semibold mb-3 md:mb-4"> 
          The Web Architect
        </p>

        {/* Instagram Handle & Link */}
        <div className="flex items-center justify-center gap-2 mb-5 md:mb-6 text-gray-700"> 
          <Instagram size={20} className="md:size-22 text-blue-600" />
          <a
            href="https://www.instagram.com/_nishant_o19?igsh=MWFnaXQ3aGYwdGlyNg=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base lg:text-lg text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium" 
          >
            _nishant_o19
          </a>
        </div>

        {/* Tagline / Status */}
        <p className="text-sm md:text-base lg:text-lg text-gray-600 font-light max-w-[250px] sm:max-w-[280px] lg:max-w-[350px] leading-relaxed mx-auto"> 
          Crafting smooth, modern, and smart digital experiences.
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileHeroCard;