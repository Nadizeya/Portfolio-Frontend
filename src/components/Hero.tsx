import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

const words = ["Frontend Specialist.", "Nadi Zeya.", "Full Stack Developer."];

const Hero: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[index];
      if (isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setTypingSpeed(40);
      } else {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, typingSpeed]);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-transparent relative px-6"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-left space-y-6 z-10"
        >
          {/* Availability Banner — above heading */}

          <div className="h-40 md:h-56 flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-black text-white  leading-tight mb-4">
              Hello! I'm <br />
              <span className="text-emerald-500 font-medium block h-16 md:h-20">
                {displayText}
              </span>
            </h1>
            <p className="max-w-md text-slate-400 font-light text-base md:text-lg leading-relaxed">
              Focusing on high-performance technical execution and clean,
              refined aesthetics.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <a
              href="https://drive.google.com/uc?export=download&id=15iRHPR43cdL_SWWrjCejBBggPG-giRmu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black text-[10px] font-black tracking-[0.25em] uppercase rounded-full hover:bg-emerald-400 transition-colors duration-300"
            >
              Get Resume
            </a>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex gap-4 items-center"
          >
            <a
              href="https://www.linkedin.com/in/nadi-zeya/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/nadizeya"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/nadi.zeya"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: Abstract Animation */}
        <div className="hidden lg:flex justify-center items-center h-full relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="relative w-64 h-64 md:w-80 md:h-80"
          >
            {/* Animated Circles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-emerald-500/10 rounded-[40%_60%_70%_30%/40%_40%_60%_60%] shadow-[0_0_80px_rgba(16,185,129,0.05)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-6 border border-emerald-500/5 rounded-[60%_40%_30%_70%/60%_60%_40%_40%]"
            />

            {/* Inner Floating Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-emerald-500/5 p-8 md:p-10 rounded-full backdrop-blur-2xl border border-emerald-500/20"
              >
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-emerald-500/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0.5}
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
