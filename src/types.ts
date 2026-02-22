export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  location?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: "Frontend" | "Backend" | "Tools" | "AI";
  icon?: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
}
