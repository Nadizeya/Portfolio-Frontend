import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import ContactForm from "./components/ContactForm";
import LoadingScreen from "./components/LoadingScreen";
import { apiService } from "./services/apiService";

const Snowfall = () => {
  const [flakes, setFlakes] = useState<
    {
      id: number;
      left: string;
      size: string;
      duration: string;
      delay: string;
    }[]
  >([]);

  useEffect(() => {
    const flakeCount = 50;
    const newFlakes = Array.from({ length: flakeCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 10 + 5}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snow-flake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
    </>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");

    // Preload critical data
    const loadData = async () => {
      try {
        // Load all critical data in parallel
        await Promise.all([
          apiService.getSkills(),
          apiService.getProjects(),
          apiService.getExperiences(),
        ]);

        // Add a minimum display time for better UX
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        console.error("Error loading data:", error);
        // Continue anyway after a delay, components will handle their own loading
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-white selection:bg-emerald-500 selection:text-black transition-colors duration-500">
      <Snowfall />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <ContactForm />
      </main>
    </div>
  );
};

export default App;
