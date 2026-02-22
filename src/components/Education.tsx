import React from "react";
import { motion } from "framer-motion";

const educationData = [
  {
    id: 1,
    degree: "B.E Software Engineering",
    institution: "Mae Fah Luang University",
    location: "Chiang Rai, Thailand",
    period: "Aug 2024 - Present",
  },
  {
    id: 2,
    degree: "MBBS",
    institution: "University of Medicine (1), Yangon",
    location: "Yangon, Myanmar",
    period: "Dec 2017 - Feb 2021",
  },
];

const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            <span className="text-emerald-500">Education</span>
          </h2>
        </motion.div>

        <div className="space-y-16">
          {educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-4 gap-12"
            >
              <div className="md:col-span-1">
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 pt-3">
                  {edu.period}
                </div>
              </div>
              <div className="md:col-span-3 border-l border-slate-900 pl-10 md:pl-16">
                <h4 className="text-3xl font-black text-white mb-2">
                  {edu.degree}
                </h4>
                <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">
                  {edu.institution}, {edu.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
