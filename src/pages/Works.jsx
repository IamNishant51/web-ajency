// src/pages/Works.jsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Power2 } from 'gsap'; // Import Power2 for eases

gsap.registerPlugin(ScrollTrigger);

// --- SpotlightCard Component (Modified for more intense light effect) ---
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(0, 0, 0, 0.25)" }) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(0.8); // Increased opacity on focus for more intensity
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(0.8); // Increased opacity on hover for more intensity
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // Applying About.jsx card styling: light glass effect
            className={`relative rounded-xl shadow-lg bg-white/50 backdrop-blur-xl border border-white/40 overflow-hidden p-6 group ${className}`}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
                style={{
                    opacity,
                    background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
                }}
            />
            {children}
        </div>
    );
};

// --- Your Project Data (UPDATED with local image paths) ---
const projects = [
    {
        id: 1,
        name: "Aesthetic Portfolio V1",
        description: "A sleek, modern portfolio showcasing interactive animations and a clean design, built with a focus on user experience.",
        techStack: ["React", "Tailwind CSS", "Framer Motion", "GSAP"],
        imageUrl: "/image1.png", // Path to your image in the public folder
        liveLink: "https://example.com/project1-demo",
        githubLink: "https://github.com/yourusername/project1-repo",
    },
    {
        id: 2,
        name: "E-commerce Redesign",
        description: "Revamped an online store with improved user experience and performance optimizations for faster load times and better conversions.",
        techStack: ["React", "Express.js", "MongoDB", "Tailwind CSS"],
        imageUrl: "/image2.png", // Path to your image in the public folder
        liveLink: "https://example.com/project2-demo",
        githubLink: "https://github.com/yourusername/project2-repo",
    },
    {
        id: 3,
        name: "Realtime Chat App",
        description: "A real-time messaging application with Firebase authentication, enabling seamless communication between users.",
        techStack: ["React", "Firebase", "Tailwind CSS"],
        imageUrl: "/image3.png", // Path to your image in the public folder
        liveLink: "https://example.com/project3-demo",
        githubLink: "https://github.com/yourusername/project3-repo",
    },
    {
        id: 4,
        name: "Content Management System",
        description: "Developed a custom CMS for easy content updates, featuring a responsive admin dashboard for streamlined management.",
        techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
        imageUrl: "/image4.png", // Path to your image in the public folder
        liveLink: "https://example.com/project4-demo",
        githubLink: "https://github.com/yourusername/project4-repo",
    },
    {
        id: 5,
        name: "Recipe Finder App",
        description: "An interactive application to discover recipes based on available ingredients, with a clean and intuitive interface.",
        techStack: ["React", "API Integration", "CSS Modules"],
        imageUrl: "/image5.png", // Path to your image in the public folder
        liveLink: "https://example.com/project5-demo",
        githubLink: "https://github.com/yourusername/project5-repo",
    },
    {
        id: 6,
        name: "Weather Dashboard",
        description: "A dynamic weather dashboard providing real-time weather updates and forecasts for various locations.",
        techStack: ["Vanilla JS", "OpenWeather API", "HTML", "CSS"],
        imageUrl: "/image6.png", // Path to your image in the public folder
        liveLink: "https://example.com/project6-demo",
        githubLink: "https://github.com/yourusername/project6-repo",
    },
];

const Works = () => {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null); // Ref for the horizontal scroll container
    const triggerRef = useRef(null); // Ref for the ScrollTrigger pin

    useEffect(() => {
        // Animation for the section title and description
        gsap.fromTo(sectionRef.current.children[0],
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: Power2.easeOut,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                }
            }
        );

        // GSAP for Horizontal Scrolling (SMOOTHED)
        const sections = gsap.utils.toArray(".project-card-item");
        // Add will-change for GPU acceleration
        sections.forEach((el) => {
            el.style.willChange = "transform";
        });

        let scrollTween = gsap.to(sections, {
            xPercent: () => -100 * (sections.length - 1),
            ease: "power1.inOut", // Smoother ease
            scrollTrigger: {
                trigger: triggerRef.current,
                pin: true,
                scrub: 0.25, // Lower scrub for more responsive smoothness
                end: () => "+=" + triggerRef.current.offsetWidth,
                anticipatePin: 1,
                // snap: {
                //     snapTo: 1 / (sections.length - 1),
                //     duration: { min: 0.2, max: 0.8 },
                //     delay: 0.1,
                //     ease: "power2.inOut"
                // }
            }
        });

        // Clean up ScrollTriggers on component unmount
        return () => {
            if (scrollTween) {
                scrollTween.scrollTrigger.kill();
            }
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <motion.section
            id="works"
            ref={sectionRef}
            // Transparent background for the section
            className="relative w-full text-gray-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Main Heading and Description */}
            <div className="max-w-6xl w-full mx-auto text-center pt-20 pb-16 px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                    My Creative <span className="text-sky-600">Works</span>
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
                    Explore a selection of projects where design meets functionality, bringing modern digital experiences to life. Scroll horizontally to see more!
                </p>
            </div>

            {/* --- Horizontal Scroll Container --- */}
            <div ref={triggerRef} className="pin-spacer relative h-screen w-full flex items-center overflow-hidden">
                <div ref={scrollContainerRef} className="horizontal-scroll-container flex items-center h-full px-16" style={{ willChange: 'transform' }}>
                    {/* Map through projects to create cards */}
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card-item flex-shrink-0 w-[calc(100vw-8rem)] md:w-[600px] lg:w-[450px] h-[calc(100vh-10rem)]
                                       mx-8 transform transition-transform duration-300"
                        >
                            {/* Using the updated SpotlightCard with light glass styling and increased intensity */}
                            <SpotlightCard className="h-full flex flex-col">
                                <img src={project.imageUrl} alt={project.name} className="w-full h-48 object-cover object-center rounded-lg mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h3>
                                <p className="text-gray-700 text-base mb-4 line-clamp-3 flex-grow">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.techStack.map((tech, idx) => (
                                        <span key={idx} className="bg-sky-50 text-sky-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-start gap-4 mt-auto pt-4 border-t border-gray-100">
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full 
                                                   text-white bg-sky-600 hover:bg-sky-700 transition-colors duration-200 shadow-md
                                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                                    </a>
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-5 py-2 border border-gray-300 text-base font-medium rounded-full 
                                                   text-gray-800 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md
                                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                    >
                                        <Github className="w-4 h-4 mr-2" /> GitHub
                                    </a>
                                </div>
                            </SpotlightCard>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Call to Action Button --- */}
            <div className="text-center py-20 px-6">
                <h3 className="text-4xl font-bold mb-4">Have a project in mind?</h3>
                <p className="text-lg text-gray-600 mb-8">Let’s build something together.</p>
                <a href="#contact" className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-medium hover:bg-indigo-700 transition">
                    Contact Me
                </a>
            </div>
        </motion.section>
    );
};

export default Works;