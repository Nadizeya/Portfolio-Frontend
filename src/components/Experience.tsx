import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiService } from "../services/apiService";
import { Experience as ExperienceType } from "../types";

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await apiService.getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-emerald-500 text-xl">Loading experience...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            Work <span className="text-emerald-500">Experience</span>
          </h2>
        </motion.div>

        <div className="space-y-32">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-4 gap-12"
            >
              <div className="md:col-span-1">
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 pt-3">
                  {exp.period}
                </div>
              </div>
              <div className="md:col-span-3 border-l border-slate-900 pl-10 md:pl-16">
                <h4 className="text-3xl font-black text-white mb-2">
                  {exp.role}
                </h4>
                <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-8">
                  {exp.company}, {exp.location}
                </div>
                <ul className="space-y-6">
                  {exp.description.map((item, i) => (
                    <li
                      key={i}
                      className="text-slate-400 font-light text-lg leading-relaxed flex items-start gap-5"
                    >
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 shrink-0 shadow-lg shadow-emerald-500/50"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
