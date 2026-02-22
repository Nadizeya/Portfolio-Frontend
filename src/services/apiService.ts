import { Project, Experience, Skill } from "../types";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const DEV_MODE = false; // Set to false when backend is ready

// Backend response types (snake_case from database)
interface BackendProject {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  my_role?: string;
  image?: string;
  tags?: string[];
  technologies?: string[];
  link?: string;
  github?: string;
  live_url?: string;
  github_url?: string;
  status?: string;
  featured?: boolean;
  is_published?: boolean;
  is_featured?: boolean;
  order_index?: number;
}

interface BackendExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  company_logo?: string;
  location?: string;
  is_published?: boolean;
  order_index?: number;
}

interface BackendSkill {
  id?: string;
  name: string;
  level: number;
  category: "Frontend" | "Backend" | "Tools" | "AI";
  icon?: string;
  is_published?: boolean;
  order_index?: number;
}

// Frontend types (camelCase for React components)
export interface DetailedProject extends Project {
  fullDescription: string;
  myRole: string;
}

export interface PortfolioData {
  skills: Skill[];
  experiences: Experience[];
  projects: DetailedProject[];
}

class ApiService {
  // Mock data storage keys - same as admin panel
  private readonly MOCK_SKILLS_KEY = "mock_skills_data";
  private readonly MOCK_EXPERIENCES_KEY = "mock_experiences_data";
  private readonly MOCK_PROJECTS_KEY = "mock_projects_data";

  private async fetchData<T>(endpoint: string): Promise<T> {
    // Development mode: use localStorage data
    if (DEV_MODE) {
      return this.getMockData<T>(endpoint);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  private getMockData<T>(endpoint: string): T {
    // Get data from localStorage (populated by admin panel)
    if (endpoint.includes("/api/skills")) {
      const skills = localStorage.getItem(this.MOCK_SKILLS_KEY);
      if (skills) {
        return JSON.parse(skills) as T;
      }
    }

    if (endpoint.includes("/api/experiences")) {
      const experiences = localStorage.getItem(this.MOCK_EXPERIENCES_KEY);
      if (experiences) {
        return JSON.parse(experiences) as T;
      }
    }

    if (endpoint.includes("/api/projects")) {
      const projects = localStorage.getItem(this.MOCK_PROJECTS_KEY);
      if (projects) {
        return JSON.parse(projects) as T;
      }
    }

    // Return empty array as fallback
    return [] as T;
  }

  // Fix localhost URLs to use production backend
  private fixImageUrl(url: string | undefined): string | undefined {
    if (!url) return url;

    // Replace localhost URLs with production backend URL
    if (url.includes("localhost:3000") || url.includes("localhost")) {
      return url.replace(
        /http:\/\/localhost:3000|http:\/\/localhost:\d+/,
        API_BASE_URL.replace("/api", ""),
      );
    }

    return url;
  }

  // Convert backend snake_case to frontend camelCase
  private convertProject(backendProject: BackendProject): DetailedProject {
    // Generate a placeholder image based on project category/tags
    const getPlaceholderImage = () => {
      const tags = backendProject.tags || backendProject.technologies || [];
      const tagStr = tags.join(",").toLowerCase();

      // Choose appropriate placeholder based on tech stack
      if (tagStr.includes("ecommerce") || tagStr.includes("shop")) {
        return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop";
      } else if (tagStr.includes("dashboard") || tagStr.includes("admin")) {
        return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop";
      } else if (tagStr.includes("mobile") || tagStr.includes("app")) {
        return "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop";
      } else if (tagStr.includes("ai") || tagStr.includes("ml")) {
        return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop";
      } else if (tagStr.includes("weather") || tagStr.includes("data")) {
        return "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop";
      } else {
        return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop";
      }
    };

    return {
      id: backendProject.id,
      title: backendProject.title,
      description: backendProject.description,
      fullDescription:
        backendProject.full_description ||
        backendProject.description ||
        "A comprehensive project showcasing modern development practices.",
      myRole: backendProject.my_role || "Full Stack Developer",
      image: this.fixImageUrl(backendProject.image) || getPlaceholderImage(),
      tags: backendProject.tags || backendProject.technologies || [],
      link: backendProject.link || backendProject.live_url || "#",
      github: backendProject.github || backendProject.github_url || "#",
    };
  }

  async getSkills(publishedOnly: boolean = true): Promise<Skill[]> {
    const queryParam = publishedOnly ? "?is_published=true" : "";
    const response = await this.fetchData<any>(`/api/skills${queryParam}`);

    // Handle both direct array response and wrapped response
    const backendSkills = Array.isArray(response)
      ? response
      : response.data || response.skills || [];

    if (!Array.isArray(backendSkills)) {
      console.error("Skills response is not an array:", response);
      return [];
    }

    // Filter published if needed and convert to frontend format
    return backendSkills
      .filter((skill: any) => !publishedOnly || skill.is_published !== false)
      .map((skill: any) => ({
        name: skill.name,
        level: skill.level || skill.proficiency || 0,
        category: skill.category,
        icon: skill.icon,
      }));
  }

  async getExperiences(publishedOnly: boolean = true): Promise<Experience[]> {
    const queryParam = publishedOnly ? "?is_published=true" : "";
    const response = await this.fetchData<any>(`/api/experiences${queryParam}`);

    // Handle both direct array response and wrapped response
    const backendExperiences = Array.isArray(response)
      ? response
      : response.data || response.experiences || [];

    if (!Array.isArray(backendExperiences)) {
      console.error("Experiences response is not an array:", response);
      return [];
    }

    // Filter published if needed and convert to frontend format
    return backendExperiences
      .filter((exp: any) => !publishedOnly || exp.is_published !== false)
      .map((exp: any) => {
        // Format period from start_date and end_date
        let period = "";
        if (exp.period) {
          period = exp.period;
        } else if (exp.start_date) {
          const startDate = new Date(exp.start_date);
          const startYear = startDate.getFullYear();
          const endYear = exp.end_date
            ? new Date(exp.end_date).getFullYear()
            : "Present";
          period = `${startYear} - ${endYear}`;
        }

        // Convert description to array if it's a string
        let description = exp.description;
        if (typeof description === "string") {
          description = description
            .split("\n")
            .filter((line: string) => line.trim());
        }
        if (!Array.isArray(description)) {
          description = [description];
        }

        return {
          id: exp.id,
          role: exp.role || exp.position,
          company: exp.company,
          location: exp.location || "",
          period: period,
          description: description,
        };
      });
  }

  async getProjects(publishedOnly: boolean = true): Promise<DetailedProject[]> {
    const queryParam = publishedOnly ? "?is_published=true" : "";
    const response = await this.fetchData<any>(`/api/projects${queryParam}`);

    // Handle both direct array response and wrapped response
    const backendProjects = Array.isArray(response)
      ? response
      : response.data || response.projects || [];

    if (!Array.isArray(backendProjects)) {
      console.error("Projects response is not an array:", response);
      return [];
    }

    // Filter published if needed and convert to frontend format
    return backendProjects
      .filter(
        (project: any) => !publishedOnly || project.is_published !== false,
      )
      .map((project: BackendProject) => this.convertProject(project));
  }

  async getPortfolioData(): Promise<PortfolioData> {
    // Fetch all data in parallel since there's no single endpoint
    const [skills, experiences, projects] = await Promise.all([
      this.getSkills(),
      this.getExperiences(),
      this.getProjects(),
    ]);

    return { skills, experiences, projects };
  }

  async submitContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
