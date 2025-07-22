// src/pages/Skills.jsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Importing icons from react-icons
import { FaReact, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFramer, SiGreensock, SiExpress, SiFirebase, SiMongodb, SiVercel } from 'react-icons/si';
import { FiFigma } from 'react-icons/fi';
import { AiFillCode } from 'react-icons/ai';

// --- Data for your Skills ---
const skillsData = [
  {
    category: "Frontend Development",
    skills: [
      { name: "React", icon: FaReact, level: 90, description: "Crafting dynamic and responsive user interfaces with component-based precision." },
      { name: "Next.js", icon: SiNextdotjs, level: 85, description: "Building performant, SEO-friendly applications with server-side rendering and static generation." },
      { name: "Tailwind CSS", icon: SiTailwindcss, level: 95, description: "Accelerating UI development with a utility-first approach for stunning designs." },
    ]
  },
  {
    category: "Backend & Databases",
    skills: [
      { name: "Node.js", icon: FaNodeJs, level: 80, description: "Developing scalable and efficient server-side applications with JavaScript." },
      { name: "Express.js", icon: SiExpress, level: 78, description: "Building robust and secure RESTful APIs to power dynamic frontends." },
      { name: "Firebase", icon: SiFirebase, level: 88, description: "Leveraging Google's backend-as-a-service for rapid deployment, authentication, and real-time data." },
    ]
  },
  {
    category: "Tools & Workflow",
    skills: [
      { name: "Git", icon: FaGitAlt, level: 85, description: "Mastering version control for seamless collaboration and efficient code management." },
      { name: "Vercel", icon: SiVercel, level: 90, description: "Deploying and hosting web applications with unparalleled ease and speed." },
      { name: "VS Code", icon: AiFillCode, level: 95, description: "My command center for coding, optimized with extensions for peak productivity." },
    ]
  }
];

// --- Spotlight Skill Card Component ---
const SpotlightSkillCard = ({ name, icon: Icon, level, description, delay = 0 }) => {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);
  const iconRef = useRef(null);
  const proficiencyBarRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMousePosition({ x, y });

    // GSAP for 3D tilt effect on card
    const centerX = width / 2;
    const centerY = height / 2;
    const rotateX = (y - centerY) / 20; // Adjust sensitivity
    const rotateY = (x - centerX) / -20; // Adjust sensitivity

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.05,
      ease: "power1.out",
      duration: 0.3,
      transformPerspective: 1000
    });

    // GSAP for icon lift/scale
    gsap.to(iconRef.current, {
      y: -5,
      scale: 1.1,
      ease: "power1.out",
      duration: 0.3
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: "elastic.out(1, 0.5)",
      duration: 0.7
    });

    gsap.to(iconRef.current, {
      y: 0,
      scale: 1,
      ease: "elastic.out(1, 0.5)",
      duration: 0.7
    });
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Animate proficiency bar on scroll into view
    gsap.fromTo(proficiencyBarRef.current,
      { width: 0 },
      {
        width: `${level}%`,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%", // when the top of the card hits 85% of viewport
          toggleActions: "play none none reverse",
          once: true // Only animate once
        }
      }
    );

    // Cleanup GSAP ScrollTrigger instance on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, [level]);

  const spotlightStyle = {
    background: isHovered
      ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent 70%)`
      : 'transparent',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`
        skills-card
        relative rounded-xl overflow-hidden p-6 sm:p-7 md:p-8 text-center h-full flex flex-col justify-between items-center group
        bg-white/[0.1] backdrop-blur-md border border-gray-200/[0.2] shadow-lg
        cursor-pointer transition-shadow duration-300
        perspective-1000
        text-black
      `}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Spotlight Effect */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={spotlightStyle}
      ></div>

      {/* Animated Border Gradient */}
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/[0.25] via-purple-500/[0.25] to-blue-500/[0.25] blur-sm"></div> {/* Slightly more opaque blur */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full w-full">
        <div
          ref={iconRef}
          className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300 mb-4 text-5xl sm:text-6xl flex-shrink-0"
          style={{ transform: 'translateZ(30px)' }}
        >
          {Icon && <Icon />}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-black mb-2"
          style={{ transform: 'translateZ(20px)' }}
        >{name}</h3>
        <p className="text-black text-sm sm:text-base mb-4 flex-grow line-clamp-2"
          style={{ transform: 'translateZ(10px)' }}
        >{description}</p>

        {/* Skill Level Bar */}
        <div className="w-full bg-gray-200/[0.4] rounded-full h-2.5 sm:h-3 overflow-hidden mt-auto" // Slightly more opaque bar track
          style={{ transform: 'translateZ(5px)' }}
        >
          <div
            ref={proficiencyBarRef}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
          ></div>
        </div>
        <p className="text-xs text-black mt-2 font-medium"
          style={{ transform: 'translateZ(5px)' }}
        >{level}% Proficient</p>
      </div>
    </motion.div>
  );
};

// --- Skills Section Component ---
const Skills = () => {
  return (
    <motion.section
      id="skills"
      className="skills-card min-h-screen w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center justify-center text-gray-900 bg-transparent"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1 }}
    >
      {/* Header Section */}
      <div className="max-w-7xl w-full mx-auto text-center pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 lg:pb-16 px-2 sm:px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
            My <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Core Capabilities</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-light leading-relaxed">
            As "The Web Architect," I leverage a powerful blend of modern technologies and tools to
            **craft smooth, modern, and smart digital experiences** from concept to deployment.
          </p>
        </motion.div>
      </div>

      {/* Skills Categories Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 space-y-10 sm:space-y-12 md:space-y-16">
        {skillsData.map((categoryData, catIndex) => (
          <div key={categoryData.category}>
            <motion.h3
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 md:mb-10 text-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.2 + catIndex * 0.1 }}
            >
              <span className="text-blue-700">{categoryData.category}</span>
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10"> {/* Adjusted grid for 3 cards */}
              {categoryData.skills.map((skill, skillIndex) => (
                <SpotlightSkillCard
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  level={skill.level}
                  description={skill.description}
                  delay={(catIndex * 0.1) + (skillIndex * 0.05)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        className="text-center py-12 sm:py-16 md:py-20 px-6 max-w-2xl sm:max-w-4xl lg:max-w-5xl mx-auto"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Ready to Turn Your Vision into Reality?
        </h3>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 leading-relaxed px-2">
          With these skills, I'm prepared to build the next groundbreaking digital experience. Let's make it happen.
        </p>
        <motion.a
          href="#contact"
          className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl 
                      hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 
                      shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-base sm:text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Let's Collaborate
        </motion.a>
      </motion.div>
    </motion.section>
  );
};

export default Skills;