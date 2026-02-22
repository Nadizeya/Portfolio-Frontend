import React from "react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <section id="about" className="bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-6 mb-16"
        >
          <h2 className="text-5xl md:text-5xl font-black tracking-tighter text-white">
            About <span className="text-emerald-500">Me</span>
          </h2>
          <div className="h-0.5 flex-1 bg-emerald-500/10 rounded-full mt-4">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5 }}
              className="h-full bg-emerald-500/40 rounded-full"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 ">
          {/* Left Side: Photo Container - constrained size as requested */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative flex justify-center lg:justify-start"
          >
            {/* Tilted background card from the screenshot style */}
            <div className="absolute top-4 left-4 w-full h-[500px] max-w-[400px] bg-emerald-500/20 rounded-3xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"></div>

            <div className="relative w-full h-[500px] max-w-[400px] aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-sm">
                <svg
                  className="w-10 h-10 text-white/30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-3">
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Nadi Zeya
              </h3>
              <p className="text-emerald-500 text-xl font-bold tracking-tight">
                Software Engineer
              </p>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span className="text-lg">📍</span>
                <span className="text-[10px] uppercase tracking-[0.3em]">
                  Thailand, Chiang Rai
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed font-light max-w-xl">
              I'm a passionate full-stack developer focused on building modern,
              user-centric web applications. I enjoy solving complex problems
              and continuously learning new technologies. Currently a
              second-year student at Mae Fah Luang University, I have 2+ years
              of hands-on experience, have participated in multiple hackathons,
              and have freelancing experiences.
            </p>

            <ul className="grid grid-cols-1 gap-4">
              {[
                "2+ years of experience in web development",
                "Specialized in React, Node.js, and TypeScript",
                "Strong focus on user experience and performance",
                "Open source contributor and tech enthusiast",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 text-slate-300 font-medium"
                >
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm md:text-base font-light">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                  Email Contact
                </span>
                <a
                  href="mailto:nadizeya@gmail.com"
                  className="block text-emerald-500 font-bold hover:underline transition-all"
                >
                  nadizeya@gmail.com
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                  Current Status
                </span>
                <span className="flex items-center gap-2 text-white font-bold">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Open to opportunities
                </span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-10 py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-500/20"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
