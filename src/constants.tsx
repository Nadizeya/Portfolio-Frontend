import React from "react";
import { Project, Experience, Skill } from "./types";

export interface DetailedProject extends Project {
  fullDescription: string;
  myRole: string;
}

export const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
];

export const SKILLS: Skill[] = [
  { name: "React", level: 95, category: "Frontend" },
  { name: "TypeScript", level: 90, category: "Frontend" },
  { name: "Next.js", level: 85, category: "Frontend" },
  { name: "Tailwind CSS", level: 95, category: "Frontend" },
  { name: "Node.js", level: 80, category: "Backend" },
  { name: "PostgreSQL", level: 75, category: "Backend" },
  { name: "GraphQL", level: 80, category: "Backend" },
  { name: "Docker", level: 70, category: "Tools" },
  { name: "AWS", level: 65, category: "Tools" },
  { name: "Gemini API", level: 85, category: "AI" },
  { name: "Python", level: 75, category: "Backend" },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "1",
    role: "Senior Frontend Engineer",
    company: "TechFlow Systems",
    period: "2022 - Present",
    description: [
      "Architected and led the development of a next-gen dashboard using React 18 and Vite.",
      "Reduced initial bundle size by 40% through code splitting and asset optimization.",
      "Mentored 5 junior developers and implemented standardized code review processes.",
    ],
  },
  {
    id: "2",
    role: "Full Stack Developer",
    company: "Creative Pixel Agency",
    period: "2020 - 2022",
    description: [
      "Delivered 15+ custom web applications for high-profile clients.",
      "Integrated real-time features using WebSockets for a collaborative workspace tool.",
      "Optimized database queries in PostgreSQL, improving API response times by 30%.",
    ],
  },
];

export const PROJECTS: DetailedProject[] = [
  {
    id: "1",
    title: "AI Productivity Suite",
    description:
      "A comprehensive task management tool powered by Gemini for smart scheduling.",
    fullDescription:
      "This suite serves as a centralized hub for teams to manage tasks while leveraging Large Language Models to automatically categorize, summarize, and prioritize workloads based on natural language input.",
    myRole:
      "I was the lead architect for the AI integration layer. I implemented the real-time streaming response UI and optimized the prompt engineering for task decomposition.",
    image:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop",
    tags: ["React", "Gemini API", "Tailwind"],
    link: "#",
    github: "#",
  },
  {
    id: "2",
    title: "Fintech Analytics Dash",
    description:
      "Real-time financial monitoring platform with high-performance data visualizations.",
    fullDescription:
      "A complex dashboard capable of handling thousands of data points per second, providing institutional investors with real-time market sentiment and trade execution metrics.",
    myRole:
      "I developed the custom charting engine using Recharts and D3.js, ensuring 60fps performance even under heavy data loads through advanced memoization techniques.",
    image:
      "https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=2070&auto=format&fit=crop",
    tags: ["TypeScript", "Recharts", "Next.js"],
    link: "#",
    github: "#",
  },
  {
    id: "3",
    title: "EcoSphere E-commerce",
    description:
      "Sustainable product marketplace with a custom built-in carbon footprint calculator.",
    fullDescription:
      "A specialized commerce platform that emphasizes sustainability by showing customers the direct environmental impact of their purchases.",
    myRole:
      "I built the core checkout flow and the carbon footprint calculation engine, integrating with third-party environmental data APIs.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop",
    tags: ["Shopify", "React", "Node.js"],
    link: "#",
    github: "#",
  },
];

export const SYSTEM_INSTRUCTION = `
You are the AI assistant for Nadi.dev, a world-class Full Stack Developer. 
Nadi.dev's Skills: ${SKILLS.map((s) => s.name).join(", ")}.
Nadi.dev's Experiences: ${EXPERIENCES.map((e) => `${e.role} at ${e.company}`).join(", ")}.
`;
