// src/components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react'; // Import icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/IamNishant51' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/nishant-unavane-008291275/' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/_nishant_o19?igsh=MWFnaXQ3aGYwdGlyNg==' },
  ];

  return (
    <motion.footer
      className="w-full bg-white/[0.05] backdrop-blur-md border-t border-gray-200/[0.1] text-gray-700
                 py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-12 {/* Significantly reduced vertical padding */}
                 flex items-center justify-center {/* Ensures content is centered horizontally */}
                 relative overflow-hidden" // Retain for any background elements
      initial={{ opacity: 0, y: 30 }} // Smaller initial slide-up animation
      whileInView={{ opacity: 1, y: 0 }} // Fades in and slides up when in view
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }} // Smooth and slightly faster transition
    >
      <div className="max-w-7xl w-full mx-auto
                      flex flex-col md:flex-row items-center justify-between /* Desktop: side-by-side, Mobile: stacked */
                      gap-y-3 md:gap-x-8"> {/* Tighter spacing */}

        {/* Brand, Tagline, and Copyright - Highly Compacted */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0">
          <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
            Nishant <span className="text-purple-600">— The Web Architect</span>
          </p>
          <p className="text-xs text-gray-600 mt-1 leading-tight">
            Crafting smooth, modern, and smart digital experiences.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            &copy; {currentYear}. All rights reserved.
          </p>
        </div>

        {/* Social Media Links - Compacted with Animations */}
        <div className="flex space-x-4 flex-shrink-0 mt-3 md:mt-0"> {/* Tighter spacing between icons */}
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              aria-label={link.name}
              whileHover={{ scale: 1.1, y: -2 }} // Subtle lift and slight scale on hover
              whileTap={{ scale: 0.9 }} // Slight squash on tap
            >
              <link.icon size={22} /> {/* Slightly smaller icons */}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;