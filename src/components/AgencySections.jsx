"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// Backend API base URL (adjust if needed)
const API_BASE = "https://nishantxd-backend.onrender.com";

const AgencyCard = ({
  children,
  delay = 0,
  className = "",
  highlight = false,
  ...restProps
}) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMousePosition({ x, y });

    const centerX = width / 2;
    const centerY = height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (x - centerX) / -25;

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.03,
      ease: "power1.out",
      duration: 0.3,
      transformPerspective: 1000,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: "elastic.out(1, 0.5)",
      duration: 0.7,
    });
  }, []);

  const spotlightStyle = {
    background: isHovered
      ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent 70%)`
      : "transparent",
  };

  const fullCardClassName = `
    relative rounded-xl overflow-hidden p-6 sm:p-7 md:p-8 text-center h-full flex flex-col justify-between items-center group
    bg-white/[0.1] backdrop-blur-md border border-gray-200/[0.2] shadow-lg
    cursor-pointer transition-shadow duration-300
    perspective-1000
    text-black
    ${highlight ? "border-2 border-blue-600" : ""}
    ${className}
  `;

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
      className={fullCardClassName}
      style={{ transformStyle: "preserve-3d" }}
      {...restProps}
    >
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={spotlightStyle}
      ></div>
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/[0.25] via-purple-500/[0.25] to-blue-500/[0.25] blur-sm"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

const AgencySections = () => {
  // State for projects and blog posts
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    // Fetch projects
    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoadingProjects(false);
      })
      .catch(() => setLoadingProjects(false));

    // Fetch blog posts
    fetch(`${API_BASE}/api/blog-posts`)
      .then((res) => res.json())
      .then((data) => {
        setBlogPosts(Array.isArray(data) ? data : []);
        setLoadingBlogs(false);
      })
      .catch(() => setLoadingBlogs(false));
  }, []);

  return (
    <>
      {/* Services Section */}
      <section className="w-full py-16 px-4 sm:py-20 sm:px-6 md:px-8 bg-transparent" id="services">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-gray-900">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Web Design",
                desc: "Modern, responsive, and user-focused website design for all industries.",
              },
              {
                title: "Web Development",
                desc: "Custom web apps, e-commerce, and CMS solutions using the latest tech.",
              },
              {
                title: "Branding & Strategy",
                desc: "Brand identity, digital strategy, and creative consulting for growth.",
              },
            ].map((service, idx) => (
              <AgencyCard key={service.title} delay={idx * 0.1} className="min-h-[220px] sm:min-h-[240px] md:min-h-[260px] flex justify-between items-center">
                <div className="flex flex-col items-center text-center">
                  <h3
                    className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-black"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-black text-xs sm:text-sm md:text-base mb-4 flex-grow line-clamp-2"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {service.desc}
                  </p>
                </div>
              </AgencyCard>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section (Dynamic)
      <section className="w-full py-16 px-4 sm:py-20 sm:px-6 md:px-8 bg-transparent" id="projects">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-gray-900">
            Our Projects
          </h2>
          {loadingProjects ? (
            <div>Loading projects...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.length === 0 ? (
                <div className="col-span-full text-gray-500">No projects found.</div>
              ) : (
                projects.map((project, idx) => (
                  <AgencyCard key={project._id || idx} delay={idx * 0.1} className="min-h-[220px] flex flex-col justify-between items-center">
                    <div className="flex flex-col items-center text-center">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-black" style={{ transform: "translateZ(20px)" }}>
                        {project.title}
                      </h3>
                      <p className="text-black text-xs sm:text-sm md:text-base mb-2" style={{ transform: "translateZ(10px)" }}>
                        {project.description}
                      </p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-xs sm:text-sm"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  </AgencyCard>
                ))
              )}
            </div>
          )}
        </div>
      </section> */}

      {/* Pricing Section */}
      <section className="w-full py-16 px-4 sm:py-20 sm:px-6 md:px-8 bg-transparent" id="pricing">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-gray-900">
            Pricing Packages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Starter",
                desc: "Perfect for small businesses",
                price: "$499",
                features: ["1-3 Pages", "Basic SEO", "Contact Form"],
                highlight: false,
                btn: "Choose",
              },
              {
                title: "Professional",
                desc: "Best for growing brands",
                price: "$1299",
                features: ["Up to 10 Pages", "Advanced SEO", "Blog & Integrations"],
                highlight: true,
                btn: "Choose",
              },
              {
                title: "Enterprise",
                desc: "For large projects",
                price: "Custom",
                features: ["Unlimited Pages", "Custom Integrations", "Priority Support"],
                highlight: false,
                btn: "Contact Us",
              },
            ].map((pkg, idx) => (
              <AgencyCard key={pkg.title} delay={idx * 0.1} highlight={pkg.highlight} className="min-h-[260px] sm:min-h-[280px] md:min-h-[300px] flex flex-col justify-between items-center">
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-black"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {pkg.title}
                </h3>
                <p
                  className="mb-2 text-black text-xs sm:text-sm md:text-base"
                  style={{ transform: "translateZ(15px)" }}
                >
                  {pkg.desc}
                </p>
                <div
                  className="text-xl sm:text-2xl font-bold mb-2 text-black"
                  style={{ transform: "translateZ(25px)" }}
                >
                  {pkg.price}
                </div>
                <ul className="text-black text-xs sm:text-sm mb-4 space-y-1" style={{ transform: "translateZ(10px)" }}>
                  {pkg.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <button
                  className="mt-auto w-full py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-xs sm:text-sm md:text-base"
                  style={{ transform: "translateZ(5px)" }}
                >
                  {pkg.btn}
                </button>
              </AgencyCard>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      {/* <section className="w-full py-16 px-4 sm:py-20 sm:px-6 md:px-8 bg-transparent" id="clients">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-gray-900">
            Our Clients
          </h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 items-center">
            {[1, 2, 3, 4].map((brand, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="w-24 h-10 sm:w-28 sm:h-12 bg-gray-200/80 rounded flex items-center justify-center font-bold text-gray-500 text-xs sm:text-base shadow-md"
              >
                Brand {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="w-full py-16 px-4 sm:py-20 sm:px-6 md:px-8 bg-transparent" id="testimonials">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-gray-900">
            Testimonials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                quote:
                  "The team delivered our project on time and exceeded expectations. Highly recommended!",
                author: "— Client A, CEO",
              },
              {
                quote: "Amazing design and great communication throughout. Will work again!",
                author: "— Client B, Founder",
              },
            ].map((t, idx) => (
              <AgencyCard key={idx} delay={idx * 0.1} className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px] flex justify-between items-center">
                <div className="flex flex-col items-center text-center">
                  <p
                    className="italic mb-4 text-black text-xs sm:text-sm md:text-base"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    “{t.quote}”
                  </p>
                  <div
                    className="font-semibold text-black text-xs sm:text-sm md:text-base"
                    style={{ transform: "translateZ(5px)" }}
                  >
                    {t.author}
                  </div>
                </div>
              </AgencyCard>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Insights Section (Dynamic)
      <section className="w-full py-16 px-4 sm:py-20 sm:px-6 md:px-8 bg-transparent" id="blog">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-gray-900">
            Insights & Blog
          </h2>
          {loadingBlogs ? (
            <div>Loading blog posts...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {blogPosts.length === 0 ? (
                <div className="col-span-full text-gray-500">No blog posts found.</div>
              ) : (
                blogPosts.map((blog, idx) => (
                  <AgencyCard key={blog._id || idx} delay={idx * 0.1} className="min-h-[180px] flex flex-col justify-between items-center">
                    <div className="flex flex-col items-center text-center">
                      <h3
                        className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-black"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        {blog.title}
                      </h3>
                      <p
                        className="text-black text-xs sm:text-sm md:text-base mb-4 flex-grow line-clamp-2"
                        style={{ transform: "translateZ(10px)" }}
                      >
                        {blog.content?.slice(0, 120) || ""}
                        {blog.content && blog.content.length > 120 ? "..." : ""}
                      </p>
                    </div>
                  </AgencyCard>
                ))
              )}
            </div>
          )}
        </div>
      </section> */}
    </>
  );
};

export default AgencySections;