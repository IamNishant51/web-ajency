// src/components/NavBar.jsx
"use client";

import React, { Children, cloneElement, useEffect, useState, useMemo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { FaHome, FaUserTie, FaLaptopCode, FaTools, FaEnvelope } from 'react-icons/fa';


// Mobile Dock Item Component
function MobileDockItem({ children, onClick, label, className = "" }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`relative flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm 
                  border border-gray-200/20 shadow-lg transition-all duration-150 
                  active:scale-95 active:bg-white/20 ${className}`}
      style={{
        width: '44px',
        height: '44px',
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <div className="flex items-center justify-center text-gray-300 text-lg">
        {children}
      </div>
    </motion.button>
  );
}

// Desktop Dock Components
function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

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
                  bg-white/10 backdrop-blur-sm transition-all duration-100 ease-out 
                  hover:bg-white/20 ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={label}
    >
      {Children.map(children, (child) =>
        cloneElement(child, { isHovered })
      )}
    </motion.div>
  );
}

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
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md 
                      border border-gray-200/30 bg-gray-800/80 px-2 py-0.5 text-xs text-white
                      backdrop-blur-sm shadow-lg`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-center text-gray-300 ${className}`}>
      {children}
    </div>
  );
}

// Navigation functions (using window.scrollTo for direct control)
const navigateToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // For smooth scrolling using the browser's native scroll-behavior (if not using Lenis's scrollTo)
    element.scrollIntoView({ behavior: "smooth" });
    // If you prefer to use Lenis's scrollTo, you would need to pass the lenis instance down from App.jsx
    // e.g., lenis.scrollTo(element, { offset: -yourHeaderHeight });
  }
};

// Main NavBar Component
const NavBar = ({
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 65,
  distance = 150,
  panelHeight = 70,
  baseItemSize = 48,
}) => {
  const mouseX = useMotionValue(Infinity);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is Tailwind's 'md' breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const items = [
    {
      icon: <FaHome className="text-xl" />,
      label: "Hero",
      onClick: () => navigateToSection('hero'),
    },
    {
      icon: <FaUserTie className="text-xl" />,
      label: "About",
      onClick: () => navigateToSection('about'),
    },
    {
      icon: <FaLaptopCode className="text-xl" />,
      label: "Projects",
      onClick: () => navigateToSection('works'),
    },
    {
      icon: <FaTools className="text-xl" />,
      label: "Skills",
      onClick: () => navigateToSection('skills'),
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      label: "Contact",
      onClick: () => navigateToSection('contact'),
    },
  ];

  // Mobile Navigation - Full Dock (visible on screens < 768px)
  if (isMobile) {
    return (
      // Added z-[999] for high z-index
      // pointer-events-none on the wrapper to allow clicks *through* the empty space of the dock
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[999] px-4 w-full max-w-sm pointer-events-none">
        {/* pointer-events-auto on the inner div to make the buttons clickable */}
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-gray-200/20 
                        rounded-2xl px-3 py-3 shadow-xl gap-2 overflow-x-auto scrollbar-hide pointer-events-auto">
          {items.map((item, index) => (
            <MobileDockItem
              key={index}
              onClick={item.onClick}
              label={item.label}
              className="flex-shrink-0"
            >
              {item.icon}
            </MobileDockItem>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Navigation - Original Dock with Magnification (visible on screens >= 768px)
  return (
    // Added z-[999] for high z-index
    // pointer-events-none on the wrapper
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl p-2
                  bg-white/10 backdrop-blur-xl shadow-lg z-[999] overflow-hidden border border-gray-200/20 pointer-events-none"
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
      {/* pointer-events-auto on the inner div */}
      <div className="flex items-end gap-4 pointer-events-auto">
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
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </div>
    </div>
  );
};

export default NavBar;