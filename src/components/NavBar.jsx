// src/components/NavBar.jsx
"use client"; // Crucial for Framer Motion and client-side interactions

import React, { Children, cloneElement, useEffect, useState, useMemo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { FaHome, FaUserTie, FaLaptopCode, FaTools, FaEnvelope } from 'react-icons/fa';

// Import your logo image
const logoImageSrc = '/logo.png'; // Make sure this path is correct

// --- Internal DockItem Component (with Magnification) ---
function DockItem({
  children,
  className = "",
  onClick,
  mouseX, // Passed from NavBar for magnification
  spring, // Passed from NavBar for magnification
  distance, // Passed from NavBar for magnification
  magnification, // Passed from NavBar for magnification
  baseItemSize, // Base size for the icons
  label,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0); // Still needed for label visibility

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  // This is the core magnification logic for each icon
  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full shadow-md
                  bg-gray-50/50 backdrop-blur-sm transition-all duration-100 ease-out ${className}`} // Muted Background with transparency
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={label}
    >
      {/* Ensure children (icons or images) are cloned and passed isHovered prop */}
      {Children.map(children, (child) =>
        cloneElement(child, { isHovered })
      )}
    </motion.div>
  );
}

// --- Internal DockLabel Component ---
function DockLabel({ children, className = "", ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-black px-2 py-0.5 text-xs text-white`} // Button Black for background, Accent Gray for border
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Internal DockIcon Component ---
function DockIcon({ children, className = "" }) {
  // This component acts as a wrapper for both react-icons and your logo image.
  // The 'text-gray-500' class is applied to the wrapper div, which will
  // affect text/SVG icons but not directly affect a PNG image.
  return (
    <div className={`flex items-center justify-center text-gray-500 ${className}`}> {/* Secondary Text (Gray) */}
      {children}
    </div>
  );
}

// --- NavBar Component (Fixed height, glass background, with magnification) ---
const NavBar = ({
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 65,
  distance = 150,
  panelHeight = 70,
  baseItemSize = 48,
}) => {
  const mouseX = useMotionValue(Infinity);

  const items = [
    // --- Your Logo as the first item ---
    {
      icon: <img src={logoImageSrc} alt="Nishant Logo" className="w-full h-full object-contain p-1" />,
      label: "Brand", // Or "Nishant"
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }), // Clicking logo scrolls to top
    },
    // --- End Logo item ---
    {
      icon: <FaHome className="text-xl" />,
      label: "Home",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      icon: <FaUserTie className="text-xl" />,
      label: "About",
      onClick: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      icon: <FaLaptopCode className="text-xl" />,
      label: "Projects",
      onClick: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      icon: <FaTools className="text-xl" />,
      label: "Skills",
      onClick: () => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      label: "Contact",
      onClick: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl p-2
                  bg-white/10 backdrop-blur-xl shadow-lg z-50 overflow-hidden border border-gray-200"
      style={{ height: panelHeight }}
      onMouseMove={({ pageX }) => {
        mouseX.set(pageX);
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
      role="toolbar"
      aria-label="Application dock"
    >
      {items.map((item, index) => (
        <DockItem
          key={index}
          onClick={item.onClick}
          className={item.className}
          mouseX={mouseX}
          spring={spring}
          distance={distance}
          magnification={magnification}
          baseItemSize={baseItemSize}
          label={item.label}
        >
          {/* Each item's icon (which can now be an <img> or a FaIcon) is wrapped by DockIcon */}
          <DockIcon>{item.icon}</DockIcon>
          <DockLabel>{item.label}</DockLabel>
        </DockItem>
      ))}
    </div>
  );
};

export default NavBar;