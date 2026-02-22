import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiService } from "../services/apiService";
import { Skill } from "../types";
import { getIconByName, isReactIcon } from "../utils/iconMap";

const CATEGORY_ORDER = ["Frontend", "Backend", "Database", "Tools"] as const;

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await apiService.getSkills();
        console.log("Fetched skills:", data);
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    skills.forEach((skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    });
    return groups;
  }, [skills]);

  if (loading) {
    return (
      <section id="skills" className="bg-transparent relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-emerald-500 text-xl">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="bg-transparent relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            My Tech <span className="text-emerald-500">Stacks</span>
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORY_ORDER.map((category, categoryIndex) => {
            const categorySkills = groupedSkills[category] || [];
            if (categorySkills.length === 0) return null;

            // For Backend, split into 2 columns with max 10 per column
            const isBackend = category === "Backend";
            const shouldSplitBackend = isBackend && categorySkills.length > 10;
            const columnClass = shouldSplitBackend ? "md:col-span-2" : "";

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className={`space-y-6 ${columnClass}`}
              >
                {/* Category Title */}
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
                    {category}
                  </h3>
                </div>

                {/* Skills List */}
                <div
                  className={
                    shouldSplitBackend
                      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                      : "space-y-4"
                  }
                >
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: skillIndex * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all duration-300 group cursor-default"
                    >
                      {/* Icon Circle */}
                      <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/50 transition-all duration-300">
                        {skill.icon ? (
                          <>
                            {isReactIcon(skill.icon) ? (
                              // Render React Icon
                              (() => {
                                const IconComponent = getIconByName(skill.icon);
                                return IconComponent ? (
                                  <IconComponent className="w-6 h-6 text-white group-hover:text-emerald-400 transition-colors" />
                                ) : (
                                  <span className="text-sm font-black text-white">
                                    {skill.name.substring(0, 2).toUpperCase()}
                                  </span>
                                );
                              })()
                            ) : (
                              // Render Image URL
                              <img
                                src={skill.icon}
                                alt={skill.name}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  e.currentTarget.style.display = "none";
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    const fallback =
                                      document.createElement("span");
                                    fallback.className =
                                      "text-sm font-black text-white";
                                    fallback.textContent = skill.name
                                      .substring(0, 2)
                                      .toUpperCase();
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            )}
                          </>
                        ) : (
                          <span className="text-sm font-black text-white">
                            {skill.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {/* Skill Name */}
                      <span className="text-base font-medium text-white group-hover:text-emerald-400 transition-colors duration-300">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
