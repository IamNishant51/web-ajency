"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, Eye } from 'lucide-react';

const SpotlightCard = ({ 
  children, 
  className = "", 
  spotlightColor = "rgba(59, 130, 246, 0.15)",
  gradientColors = ["rgba(59, 130, 246, 0.1)", "rgba(147, 51, 234, 0.1)"]
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  const handleFocus = () => { 
    setIsFocused(true); 
    setOpacity(1); 
  };
  
  const handleBlur = () => { 
    setIsFocused(false); 
    setOpacity(0); 
  };
  
  const handleMouseEnter = () => { 
    setOpacity(0.9); 
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
      className={`
        relative rounded-2xl overflow-hidden group cursor-pointer
        bg-white/80 backdrop-blur-xl border border-white/50
        shadow-lg hover:shadow-2xl
        transition-all duration-500 ease-out
        transform hover:scale-[1.02]
        ${className}
      `}
      style={{
        backgroundImage: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
      }}
    >

      {/* spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out"
        style={{
          opacity,
          background: `radial-gradient(circle 120px at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 blur-sm"></div>
      </div>
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

const projects = [
  {
    id: 1,
    name: "Aesthetic Portfolio V2",
    description: "A modern, interactive portfolio featuring advanced animations, 3D elements, and seamless user experience. Built with cutting-edge web technologies.",
    techStack: ["React", "Three.js", "Tailwind CSS", "Framer Motion", "GSAP"],
    imageUrl: "/image1.png",
    liveLink: "https://demo.example.com/project1",
    githubLink: "https://github.com/nishant-r/aesthetic-portfolio",
    stats: { stars: 247, views: 15600 },
    category: "Frontend",
    featured: true
  },
  {
    id: 2,
    name: "E-commerce Redesign",
    description: "Complete overhaul of an online marketplace with improved UX/UI, performance optimizations, and mobile-first design approach.",
    techStack: ["Next.js", "TypeScript", "Stripe", "Prisma", "TailwindCSS"],
    imageUrl: "/image2.png",
    liveLink: "https://demo.example.com/project2",
    githubLink: "https://github.com/nishant-r/ecommerce-redesign",
    stats: { stars: 189, views: 8900 },
    category: "Full-stack"
  },
  {
    id: 3,
    name: "Real-time Collaboration Hub",
    description: "A comprehensive collaboration platform with live editing, video calls, and project management features for distributed teams.",
    techStack: ["React", "Node.js", "Socket.io", "WebRTC", "MongoDB"],
    imageUrl: "/image3.png",
    liveLink: "https://demo.example.com/project3",
    githubLink: "https://github.com/nishant-r/collaboration-hub",
    stats: { stars: 156, views: 6700 },
    category: "Full-stack"
  },
  {
    id: 4,
    name: "Smart Content CMS",
    description: "AI-powered content management system with automated SEO optimization, content suggestions, and advanced analytics dashboard.",
    techStack: ["Next.js", "OpenAI API", "Prisma", "PostgreSQL", "Vercel"],
    imageUrl: "/image4.png",
    liveLink: "https://demo.example.com/project4",
    githubLink: "https://github.com/nishant-r/smart-cms",
    stats: { stars: 203, views: 12300 },
    category: "Full-stack"
  },
  {
    id: 5,
    name: "Recipe Discovery Engine",
    description: "Intelligent recipe finder using machine learning to suggest meals based on ingredients, dietary preferences, and nutritional goals.",
    techStack: ["React", "Python", "TensorFlow", "FastAPI", "Redis"],
    imageUrl: "/image5.png",
    liveLink: "https://demo.example.com/project5",
    githubLink: "https://github.com/nishant-r/recipe-engine",
    stats: { stars: 124, views: 5400 },
    category: "AI/ML"
  },
  {
    id: 6,
    name: "Weather Analytics Platform",
    description: "Advanced weather visualization platform with predictive analytics, climate data insights, and interactive geographical mapping.",
    techStack: ["Vue.js", "D3.js", "Node.js", "InfluxDB", "Docker"],
    imageUrl: "/image6.png",
    liveLink: "https://demo.example.com/project6",
    githubLink: "https://github.com/nishant-r/weather-analytics",
    stats: { stars: 98, views: 4200 },
    category: "Data Viz"
  },
];

const Works = () => {
  return (
    <motion.section
      id="works"
      
      className="works-cards relative w-full text-gray-900 overflow-hidden flex flex-col justify-start items-center min-h-screen" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl w-full mx-auto text-center pt-20 pb-12 px-4 sm:pt-24">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            Discover a curated collection of projects where innovative design meets cutting-edge technology, 
            creating exceptional digital experiences that push boundaries.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-8"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {['All', 'Frontend', 'Full-stack', 'AI/ML', 'Data Viz'].map((category) => (
            <span 
              key={category}
              className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-sm font-medium text-gray-700 hover:bg-white/80 transition-all duration-200 cursor-pointer"
            >
              {category}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }} 
          >
            <SpotlightCard 
              className="h-full flex flex-col p-0" 
              spotlightColor="rgba(59, 130, 246, 0.12)"
              gradientColors={[
                project.featured ? "rgba(59, 130, 246, 0.08)" : "rgba(148, 163, 184, 0.05)",
                project.featured ? "rgba(147, 51, 234, 0.08)" : "rgba(99, 102, 241, 0.05)"
              ]}
            >
              {/* Project Image with Overlay */}
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img 
                  src={project.imageUrl} 
                  alt={project.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
                />
                {project.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                  {project.category}
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {project.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {project.stats.stars}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {project.stats.views.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200/50 hover:border-blue-300 transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl
                               text-white bg-gradient-to-r from-blue-600 to-purple-600 
                               hover:from-blue-700 hover:to-purple-700 
                               transform hover:scale-105 transition-all duration-200 
                               shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-semibold rounded-xl
                               text-gray-700 bg-white hover:bg-gray-50 
                               transform hover:scale-105 transition-all duration-200 
                               shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="text-center py-20 px-6 max-w-4xl mx-auto"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Ready to Build Something Amazing?
        </h3>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Let's collaborate and bring your vision to life with cutting-edge technology and creative design.
        </p>
        <motion.a 
          href="#contact" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl 
                      hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 
                      shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start a Project
          <ExternalLink className="w-5 h-5 ml-2" />
        </motion.a>
      </motion.div>
    </motion.section>
  );
};

export default Works;