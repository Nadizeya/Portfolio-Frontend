import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService, DetailedProject } from "../services/apiService";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<DetailedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] =
    useState<DetailedProject | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="bg-transparent relative py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-emerald-500 text-xl">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="bg-transparent relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-block px-6 py-2 rounded-full bg-slate-900 border border-slate-800 mb-8">
            <span className="text-xs font-bold tracking-wider uppercase text-white">
              SELECTED PROJECTS EXPERIENCE
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            Creations<span className="text-emerald-500">.</span>
          </h2>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              {/* Project Card */}
              <div className="bg-slate-900/40 rounded-3xl overflow-hidden border border-slate-800/50 hover:border-emerald-500/50 transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Tech Tags Overlay */}
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    {(project.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wide rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* View Case Study Link */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-2 text-emerald-500 font-bold text-sm uppercase tracking-wider hover:gap-4 transition-all group/link"
                  >
                    VIEW CASE STUDY
                    <svg
                      className="w-5 h-5 group-hover/link:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              ></motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#020617] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row border border-slate-800 hide-scrollbar"
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-8 right-8 z-20 p-4 bg-slate-900 text-white rounded-full hover:scale-110 transition-transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="w-full md:w-1/2 bg-slate-900">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full md:w-1/2 p-10 md:p-16 space-y-12 text-white">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(selectedProject.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                      {selectedProject.title}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                      Application Overview
                    </h5>
                    <p className="text-slate-400 font-light text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                      {selectedProject.fullDescription}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                      My Contributions
                    </h5>
                    <p className="text-slate-400 font-light leading-relaxed">
                      {selectedProject.myRole}
                    </p>
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-6">
                    <a
                      href={selectedProject.link}
                      className="flex-1 text-center py-5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      Launch Live
                    </a>
                    <a
                      href={selectedProject.github}
                      className="flex-1 text-center py-5 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-colors"
                    >
                      Source Code
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
