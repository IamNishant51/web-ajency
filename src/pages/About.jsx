"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Code, Database, Feather, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
    { 
        year: "2022", 
        title: "The Seed is Planted", 
        description: "Embarked on my coding journey, diving into the fundamentals of HTML, CSS, and JavaScript. Laid the groundwork for building the web.",
        icon: Star
    },
    { 
        year: "2023", 
        title: "Roots Deepen: Frontend Focus", 
        description: "Dedicated to mastering React.js, exploring component-based architectures, and styling with Tailwind CSS for modern UIs.",
        icon: Code
    },
    { 
        year: "2024", 
        title: "Branching Out: Backend & Databases", 
        description: "Ventured into backend development with Firebase for quick deployments and Express.js + MongoDB for full-stack control.",
        icon: Database
    },
    { 
        year: "2025", 
        title: "Growth & Bloom: Interactive Experiences", 
        description: "Elevating designs with Framer Motion and GSAP for fluid animations. Passionate about crafting smooth, modern, and smart digital experiences.",
        icon: Feather
    },
    { 
        year: "Present", 
        title: "Harvesting & Future Growth", 
        description: "Continuously crafting high-quality projects and exploring new technologies to push creative boundaries.",
        icon: Briefcase
    },
];

const About = () => {
    const timelineRef = useRef(null);

    useEffect(() => {
        const timelineItems = gsap.utils.toArray(".timeline-item");
        const triggers = [];

        timelineItems.forEach((item, index) => {
            const isLeft = index % 2 === 0;
            const card = item.querySelector('.timeline-card');
            const dot = item.querySelector('.timeline-dot');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    end: "bottom 60%",
                    toggleActions: "play none none reverse",
                },
            });

            triggers.push(tl.scrollTrigger);

            tl.fromTo(dot, 
                { scale: 0 }, 
                { scale: 1, duration: 0.3, ease: 'power2.out' }
            );

            tl.fromTo(card,
                { 
                    opacity: 0, 
                    x: isLeft ? -50 : 50, 
                    scale: 0.95 
                },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out",
                }, 
                "-=0.2"
            );
        });

        return () => {
            triggers.forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <motion.section
            id="about"
            className="min-h-screen w-full py-20 px-4 flex flex-col items-center justify-center text-gray-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-4xl w-full mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">My Journey</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    A timeline of how I grew from a curious beginner to a passionate developer.
                </p>
            </div>

            <div ref={timelineRef} className="relative w-full max-w-3xl flex flex-col items-center">
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-300 -translate-x-1/2"></div>

                {timelineEvents.map((event, index) => {
                    const isLeft = index % 2 === 0;
                    const Icon = event.icon;
                    return (
                        <div key={index} className="timeline-item w-full flex justify-center my-4 relative">
                            <div className="timeline-dot absolute left-1/2 top-1 w-6 h-6 bg-white border-2 border-sky-500 rounded-full -translate-x-1/2 z-10 flex items-center justify-center shadow-md">
                                <Icon className="w-3 h-3 text-sky-600" />
                            </div>

                            <div className={`
                                timeline-card w-full md:w-[calc(50%-2rem)] p-6 rounded-xl shadow-lg 
                                ${isLeft ? 'md:mr-auto' : 'md:ml-auto'} 
                                opacity-0 transform 
                                bg-white/50 backdrop-blur-xl border border-white/40 shadow-inner-sm
                                ` 
                            }>
                                <p className="text-sm font-semibold text-sky-700 mb-1">{event.year}</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                <p className="text-gray-700">{event.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
};

export default About;