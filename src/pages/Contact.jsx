"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Linkedin, Github } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://nishantxd-backend.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) { 
        toast.success(result.message || 'Message sent successfully! I\'ll get back to you soon.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setFormData({ name: '', email: '', subject: '', message: '' }); 
      } else {
       
        throw new Error(result.error || 'Failed to send message from server.');
      }

    } catch (error) {
      console.error('FAILED...', error);
      toast.error(error.message || 'Failed to send message. Please try again or reach out directly.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="contact"
      className="min-h-screen w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center justify-center text-gray-900 bg-transparent relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <ToastContainer /> 

      
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/[0.05] rounded-full mix-blend-multiply opacity-50 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/[0.05] rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-[2000ms] pointer-events-none"></div>

    
      <div className="max-w-4xl w-full mx-auto text-center pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 lg:pb-16 px-2 sm:px-4 relative z-10">
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight"
          variants={itemVariants}
        >
          Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Architect</span> Your Vision?
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-light leading-relaxed"
          variants={itemVariants}
          transition={{ delay: 0.2 }}
        >
          As **Nishant, The Web Architect**, I'm eager to discuss your next project. Let's create something smooth, modern, and smart together.
        </motion.p>
      </div>

      
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 relative z-10 p-4 sm:p-6 md:p-8">
        
        <motion.div
          className="p-5 sm:p-6 md:p-8 rounded-2xl
                      bg-white/[0.1] backdrop-blur-lg border border-gray-200/[0.2] shadow-xl
                      flex flex-col items-center"
          variants={itemVariants}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 text-center">Send Me a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300/[0.4] rounded-md bg-white/[0.2] text-gray-900 placeholder-gray-500
                                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300/[0.4] rounded-md bg-white/[0.2] text-gray-900 placeholder-gray-500
                                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300/[0.4] rounded-md bg-white/[0.2] text-gray-900 placeholder-gray-500
                                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-3 py-2 border border-gray-300/[0.4] rounded-md bg-white/[0.2] text-gray-900 placeholder-gray-500
                                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-sm sm:text-base resize-y"
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="w-full inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg
                                hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                                shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>

       
        <motion.div
          className="p-5 sm:p-6 md:p-8 rounded-2xl
                      bg-white/[0.1] backdrop-blur-lg border border-gray-200/[0.2] shadow-xl flex flex-col items-center justify-center"
          variants={itemVariants}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 text-center">Or Connect on Socials</h3>
          <div className="flex flex-col items-start space-y-4 w-full max-w-sm">
          
            <a
              href="mailto:nishantunawne0007@gmail.com"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 group w-full p-2.5 rounded-md hover:bg-white/[0.1]"
            >
              <Mail size={24} className="text-blue-600 group-hover:text-purple-600 transition-colors duration-200 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium truncate">nishantunawne0007@gmail.com</span>
            </a>
            
            <a
              href="https://www.instagram.com/_nishant_o19?igsh=MWFnaXQ3aGYwdGlyNg==" // Your Instagram
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors duration-200 group w-full p-2.5 rounded-md hover:bg-white/[0.1]"
            >
              <Instagram size={24} className="text-blue-600 group-hover:text-purple-600 transition-colors duration-200 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium">_nishant_o19</span>
            </a>
            <a
              href="https://www.linkedin.com/in/nishant-unavane-008291275/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 group w-full p-2.5 rounded-md hover:bg-white/[0.1]"
            >
              <Linkedin size={24} className="text-blue-600 group-hover:text-purple-600 transition-colors duration-200 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium">Nishant Unavane</span>
            </a>
            <a
              href="https://github.com/IamNishant51"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors duration-200 group w-full p-2.5 rounded-md hover:bg-white/[0.1]"
            >
              <Github size={24} className="text-blue-600 group-hover:text-purple-600 transition-colors duration-200 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium">IamNishant51</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;