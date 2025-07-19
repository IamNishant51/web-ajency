// src/components/ProfileHeroCard.jsx
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Instagram } from 'lucide-react';

// Import your profile image and logo
const profileImageSrc = '/nishant.png';
const logoImageSrc = '/logo.png';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const ProfileHeroCard = () => {
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const rotateZ = useSpring(useMotionValue(0), {
    damping: 20,
    stiffness: 80,
    mass: 1.5,
  });
  const scale = useSpring(1, springValues);

  function handleMouseMove(e) {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    const newRotateX = (offsetY / (rect.height / 2)) * -8;
    const newRotateY = (offsetX / (rect.width / 2)) * 8;
    const newRotateZ = (offsetX / (rect.width / 2)) * 5;

    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
    rotateZ.set(newRotateZ);

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    scale.set(1.03);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    rotateZ.set(0);
    scale.set(1);
    mouseX.set(0);
    mouseY.set(0);
  }

  const initialLoadVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center justify-center
                 w-80 h-[480px] md:w-96 md:h-[520px]
                 bg-white/5 backdrop-blur-2xl border border-white/20 // Adjusted for more transparency
                 cursor-pointer overflow-hidden [perspective:1000px]
                 "
      variants={initialLoadVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        rotateZ,
        scale,
        // Increased shadow on hover to make it pop more when transparent
        boxShadow: scale.get() > 1 ? "0px 25px 60px rgba(0, 0, 0, 0.4)" : "0px 10px 30px rgba(0, 0, 0, 0.2)",
        transition: 'box-shadow 0.3s ease-out'
      }}
    >
      {/* Subtle radial gradient for depth and light reflection (like glass) */}
      <div className="absolute inset-0 z-0 opacity-20"
           style={{
             background: 'radial-gradient(circle at top left, rgba(255,255,255,0.3) 0%, transparent 50%)'
           }}
      ></div>

      {/* Logo in background */}
      <img
        src={logoImageSrc}
        alt="Nishant's Logo Background"
        className="absolute inset-0 w-full h-full object-contain p-12 opacity-3 pointer-events-none z-0" // Reduced opacity further
      />

      {/* Profile Image */}
      <motion.div
        className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden z-10 mb-6 border-4 border-white/40 shadow-xl" // Border more transparent, shadow stronger
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <img
          src={profileImageSrc}
          alt="Nishant - The Web Architect"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* User Info */}
      <div className="text-center z-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Nishant
        </h2>
        <p className="text-lg md:text-xl text-sky-600 font-semibold mb-4">
          The Web Architect
        </p>

        {/* Instagram Handle & Link */}
        <div className="flex items-center justify-center gap-2 mb-6 text-gray-700">
          <Instagram size={20} />
          <a
            href="https://www.instagram.com/_nishant_o19?igsh=MWFnaXQ3aGYwdGlyNg=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
          >
            _nishant_o19
          </a>
        </div>

        {/* Tagline / Status */}
        <p className="text-md md:text-lg text-gray-600 font-light max-w-[280px] leading-relaxed mx-auto">
          Crafting smooth, modern, and smart digital experiences.
        </p>
      </div>

      {/* Mobile Warning */}
      <div className="absolute top-4 text-center text-xs text-gray-500 block sm:hidden px-4">
        Tilt effect best viewed on desktop.
      </div>
    </motion.div>
  );
};

export default ProfileHeroCard;