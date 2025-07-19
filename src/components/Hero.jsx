
import HeroCard from "./HeroCard";
import { motion } from 'framer-motion';

const Hero = () => {
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center p-8 md:p-16">

      {/* Hero Content - Card and Text */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-around w-full max-w-6xl mx-auto gap-12 md:gap-24">

        {/* Hero Card */}
        <div className="flex-shrink-0">
          <HeroCard />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left max-w-2xl">
          <motion.h1
            // Applied custom font class
            className="font-heading text-5xl md:text-6xl font-bold text-black mb-4 leading-tight"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Nishant — The Web Architect
          </motion.h1>
          <motion.p
            // Applied custom font class
            className="font-body text-xl md:text-2xl text-gray-500 mb-6"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...textVariants.visible.transition, delay: 0.6 }}
          >
            Crafting smooth, modern, and smart digital experiences.
          </motion.p>
          <motion.p
            // Applied custom font class
            className="font-body text-base md:text-lg text-gray-700 max-w-lg mx-auto md:mx-0"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...textVariants.visible.transition, delay: 0.8 }}
          >
            A modern web developer passionate about frontend magic and building interactive experiences. Young, growing, and always learning—that's my strength!
          </motion.p>
          {/* Example button with font */}
          {/*
          <motion.button
            className="mt-8 px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-[#1f1f1f] transition duration-300 font-button"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...textVariants.visible.transition, delay: 1.0 }}
          >
            Explore My Work
          </motion.button>
          */}
        </div>
      </div>
    </div>
  );
};

export default Hero;