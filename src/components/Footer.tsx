import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      id="contact-footer"
      className="py-24 bg-transparent border-t border-slate-900 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <h2 className="text-4xl font-black tracking-tighter text-white">
              Nadi<span className="text-emerald-500">.dev</span>
            </h2>
            <p className="text-slate-400 max-w-sm text-lg font-light leading-relaxed">
              Available for world-class freelance architectures and senior
              remote engineering cycles. Let's engineer the impossible.
            </p>
            <div className="flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all text-slate-600 border border-slate-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-slate-700">
              Navigation
            </h4>
            <ul className="space-y-6 text-slate-500 font-medium text-sm">
              <li>
                <a
                  href="#home"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Home Base
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Philosophy
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Tech Stack
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Portfolios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-slate-700">
              Direct Hub
            </h4>
            <ul className="space-y-6 text-slate-500 font-medium text-sm">
              <li className="flex items-center gap-4">
                <span className="text-emerald-500">→</span>
                hello@nadi.dev
              </li>
              <li className="flex items-center gap-4">
                <span className="text-emerald-500">→</span>
                Berlin / Remote
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
          <p>© 2024 Nadi.dev PORTFOLIO ARCHITECTURE.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-emerald-500">
              Privacy Encrypt
            </a>
            <a href="#" className="hover:text-emerald-500">
              Legal Protocol
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
