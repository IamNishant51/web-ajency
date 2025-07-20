// src/components/ProfileHeroCard.jsx
import React from "react"; // useRef and useState are no longer strictly needed for this version
import { motion } from "framer-motion";
import { Instagram } from 'lucide-react'; // Import the Instagram icon

// Import your profile image and logo
const profileImageSrc = '/nishant.png'; // Path to your profile image in the public folder
const logoImageSrc = '/logo.png'; // Path to your logo in the public folder (for background)

const ProfileHeroCard = () => {
  // Removed useRef, useMotionValue, useSpring, and all handleMouseMove/Leave functions.

  const initialLoadVariants = {
    hidden: { opacity: 0, y: 50 }, // Keep initial slight lift
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="relative rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center
                 w-72 h-[420px] md:w-80 md:h-[450px] // Made smaller
                 bg-white/5 backdrop-blur-xl border border-white/20 // Glassmorphism kept subtle
                 cursor-pointer overflow-hidden
                 "
      variants={initialLoadVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, boxShadow: "0px 18px 45px rgba(0, 0, 0, 0.3)" }} // Subtle scale and shadow on hover
      transition={{ type: "spring", stiffness: 300, damping: 25 }} // Smooth spring transition for hover
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
        className="absolute inset-0 w-full h-full object-contain p-12 opacity-3 pointer-events-none z-0"
      />

      {/* Profile Image */}
      <motion.div
        className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden z-10 mb-5 border-3 border-white/50 shadow-lg" // Profile image slightly smaller, border slightly more opaque
        whileHover={{ scale: 1.05 }} // Independent hover scale for image
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
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"> {/* Smaller text */}
          Nishant
        </h2>
        <p className="text-md md:text-lg text-sky-600 font-semibold mb-3"> {/* Smaller text */}
          The Web Architect
        </p>

        {/* Instagram Handle & Link */}
        <div className="flex items-center justify-center gap-2 mb-5 text-gray-700"> {/* Smaller margin */}
          <Instagram size={18} /> {/* Slightly smaller icon */}
          <a
            href="https://www.instagram.com/_nishant_o19?igsh=MWFnaXQ3aGYwdGlyNg=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium" // Smaller text
          >
            _nishant_o19
          </a>
        </div>

        {/* Tagline / Status */}
        <p className="text-sm md:text-base text-gray-600 font-light max-w-[250px] leading-relaxed mx-auto"> {/* Smaller text and max-width */}
          Crafting smooth, modern, and smart digital experiences.
        </p>
      </div>

      {/* Mobile Warning - can be removed if tilt effect is no longer primary */}
      {/* <div className="absolute top-4 text-center text-xs text-gray-500 block sm:hidden px-4">
        Subtle hover effects.
      </div> */}
    </motion.div>
  );
};

export default ProfileHeroCard;