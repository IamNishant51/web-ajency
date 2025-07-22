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

// Navigation functions
const navigateToSection = (sectionId) => {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const items = [
    {
      icon: <FaHome className="text-xl" />,
      label: "Home",
      onClick: () => navigateToSection('home'),
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

  // Mobile Navigation - Full Dock
  if (isMobile) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-sm">
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-gray-200/20 
                        rounded-2xl px-3 py-3 shadow-xl gap-2 overflow-x-auto scrollbar-hide">
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

  // Desktop Navigation - Original Dock with Magnification
  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl p-2
                  bg-white/10 backdrop-blur-xl shadow-lg z-50 overflow-hidden border border-gray-200/20"
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
          <DockIcon>{item.icon}</DockIcon>
          <DockLabel>{item.label}</DockLabel>
        </DockItem>
      ))}
    </div>
  );
};

export default NavBar;