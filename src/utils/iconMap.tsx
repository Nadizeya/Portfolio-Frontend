import { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as DiIcons from "react-icons/di";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import * as TbIcons from "react-icons/tb";

// Common tech icons for quick selection
export const COMMON_TECH_ICONS = [
  // Frontend
  { name: "React", icon: "FaReact", category: "Frontend" },
  { name: "Vue", icon: "FaVuejs", category: "Frontend" },
  { name: "Angular", icon: "FaAngular", category: "Frontend" },
  { name: "HTML5", icon: "FaHtml5", category: "Frontend" },
  { name: "CSS3", icon: "FaCss3Alt", category: "Frontend" },
  { name: "JavaScript", icon: "SiJavascript", category: "Frontend" },
  { name: "TypeScript", icon: "SiTypescript", category: "Frontend" },
  { name: "Next.js", icon: "SiNextdotjs", category: "Frontend" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", category: "Frontend" },
  { name: "Sass", icon: "FaSass", category: "Frontend" },
  { name: "Bootstrap", icon: "FaBootstrap", category: "Frontend" },
  { name: "Redux", icon: "SiRedux", category: "Frontend" },
  { name: "Svelte", icon: "SiSvelte", category: "Frontend" },

  // Backend
  { name: "Node.js", icon: "FaNodeJs", category: "Backend" },
  { name: "Python", icon: "FaPython", category: "Backend" },
  { name: "Java", icon: "FaJava", category: "Backend" },
  { name: "PHP", icon: "FaPhp", category: "Backend" },
  { name: "Laravel", icon: "FaLaravel", category: "Backend" },
  { name: "Django", icon: "SiDjango", category: "Backend" },
  { name: "Express", icon: "SiExpress", category: "Backend" },
  { name: "NestJS", icon: "SiNestjs", category: "Backend" },
  { name: "FastAPI", icon: "SiFastapi", category: "Backend" },
  { name: "GraphQL", icon: "SiGraphql", category: "Backend" },
  { name: "PostgreSQL", icon: "SiPostgresql", category: "Backend" },
  { name: "MySQL", icon: "SiMysql", category: "Backend" },
  { name: "MongoDB", icon: "SiMongodb", category: "Backend" },
  { name: "Redis", icon: "SiRedis", category: "Backend" },
  { name: "Supabase", icon: "SiSupabase", category: "Backend" },
  { name: "Firebase", icon: "SiFirebase", category: "Backend" },

  // Tools
  { name: "Git", icon: "FaGitAlt", category: "Tools" },
  { name: "GitHub", icon: "FaGithub", category: "Tools" },
  { name: "Docker", icon: "FaDocker", category: "Tools" },
  { name: "AWS", icon: "FaAws", category: "Tools" },
  { name: "Linux", icon: "FaLinux", category: "Tools" },
  { name: "VS Code", icon: "SiVisualstudiocode", category: "Tools" },
  { name: "Figma", icon: "FaFigma", category: "Tools" },
  { name: "NPM", icon: "FaNpm", category: "Tools" },
  { name: "Webpack", icon: "SiWebpack", category: "Tools" },
  { name: "Vite", icon: "SiVite", category: "Tools" },
  { name: "Jest", icon: "SiJest", category: "Tools" },
  { name: "Vercel", icon: "SiVercel", category: "Tools" },

  // AI
  { name: "OpenAI", icon: "SiOpenai", category: "AI" },
  { name: "TensorFlow", icon: "SiTensorflow", category: "AI" },
  { name: "PyTorch", icon: "SiPytorch", category: "AI" },
];

// Combine all icon libraries
const allIcons: Record<string, IconType> = {
  ...FaIcons,
  ...SiIcons,
  ...DiIcons,
  ...BiIcons,
  ...AiIcons,
  ...TbIcons,
};

/**
 * Get the icon component from react-icons by name
 * @param iconName - Name of the icon (e.g., 'FaReact', 'SiTypescript')
 * @returns Icon component or null if not found
 */
export const getIconByName = (iconName: string): IconType | null => {
  return allIcons[iconName] || null;
};

/**
 * Check if a string is a react-icon name (not a URL)
 * @param iconString - Icon string to check
 * @returns true if it's a react-icon name
 */
export const isReactIcon = (iconString: string): boolean => {
  return !iconString.startsWith("http") && !iconString.startsWith("/");
};

/**
 * Search icons by name
 * @param searchTerm - Search term
 * @returns Array of matching icon names
 */
export const searchIcons = (searchTerm: string): string[] => {
  if (!searchTerm) return [];
  const term = searchTerm.toLowerCase();
  return Object.keys(allIcons)
    .filter((name) => name.toLowerCase().includes(term))
    .slice(0, 50); // Limit results
};
