  import HeroCard from "./HeroCard";
  import { motion } from 'framer-motion';
  import TrueFocus from './TrueFocus'; // Import the TrueFocus component

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
            {/* Replaced h1 with TrueFocus component */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-heading text-5xl md:text-6xl font-bold text-black mb-4 leading-tight"
              // We'll let TrueFocus handle its internal animations and styles
              // The `initial` and `animate` here will apply to the container of TrueFocus
            >
              <TrueFocus
                sentence="Nishant — The Web Architect"
                blurAmount={4} // Adjust blur intensity
                animationDuration={0.4} // How fast the focus box moves/blurs
                pauseBetweenAnimations={0.8} // How long it pauses on each word
                // You can customize colors here for branding
                borderColor="#007bff" // A vibrant blue
                glowColor="rgba(0, 123, 255, 0.6)" // Matching blue glow
                // manualMode={true} // Uncomment to enable hover interaction instead of automatic cycle
              />
            </motion.div>

            <motion.p
              className="font-body text-xl md:text-2xl text-gray-500 mb-6"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ ...textVariants.visible.transition, delay: 0.6 }}
            >
              Crafting smooth, modern, and smart digital experiences.
            </motion.p>
            <motion.p
              className="font-body text-base md:text-lg text-gray-700 max-w-lg mx-auto md:mx-0"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ ...textVariants.visible.transition, delay: 0.1 }}
            >
              A modern web developer passionate about frontend magic and building interactive experiences. Young, growing, and always learning—that's my strength!
            </motion.p>
          </div>
        </div>
      </div>
    );
  };

  export default Hero;