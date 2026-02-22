const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const DEV_MODE = false; // Set to false when backend is ready

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Mock data storage keys
  private readonly MOCK_SKILLS_KEY = "mock_skills_data";
  private readonly MOCK_EXPERIENCES_KEY = "mock_experiences_data";
  private readonly MOCK_PROJECTS_KEY = "mock_projects_data";
  private readonly MOCK_CONTACTS_KEY = "mock_contacts_data";

  // Initialize mock data in localStorage if not exists
  private initMockData() {
    if (!localStorage.getItem(this.MOCK_SKILLS_KEY)) {
      const skills = [
        {
          id: "1",
          name: "React",
          category: "Frontend",
          proficiency: 90,
          is_published: true,
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          name: "TypeScript",
          category: "Language",
          proficiency: 85,
          is_published: true,
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: "3",
          name: "Node.js",
          category: "Backend",
          proficiency: 80,
          is_published: true,
          created_at: "2024-01-16T10:00:00Z",
        },
        {
          id: "4",
          name: "Python",
          category: "Language",
          proficiency: 75,
          is_published: false,
          created_at: "2024-01-17T10:00:00Z",
        },
        {
          id: "5",
          name: "PostgreSQL",
          category: "Database",
          proficiency: 70,
          is_published: true,
          created_at: "2024-01-18T10:00:00Z",
        },
      ];
      localStorage.setItem(this.MOCK_SKILLS_KEY, JSON.stringify(skills));
    }

    if (!localStorage.getItem(this.MOCK_EXPERIENCES_KEY)) {
      const experiences = [
        {
          id: "1",
          company: "Tech Innovations Inc",
          position: "Senior Full Stack Developer",
          start_date: "2022-01-15",
          end_date: null,
          description:
            "Leading development of scalable web applications using React, Node.js, and PostgreSQL. Mentoring junior developers and architecting cloud solutions.",
          is_published: true,
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          company: "Digital Solutions Ltd",
          position: "Full Stack Developer",
          start_date: "2020-06-01",
          end_date: "2021-12-31",
          description:
            "Developed and maintained multiple client projects using modern web technologies. Implemented CI/CD pipelines and improved deployment processes.",
          is_published: true,
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: "3",
          company: "StartUp Labs",
          position: "Junior Developer",
          start_date: "2019-03-01",
          end_date: "2020-05-31",
          description:
            "Built responsive web applications and collaborated with design team. Worked with React, Express, and MongoDB stack.",
          is_published: true,
          created_at: "2024-01-15T10:00:00Z",
        },
      ];
      localStorage.setItem(
        this.MOCK_EXPERIENCES_KEY,
        JSON.stringify(experiences),
      );
    }

    if (!localStorage.getItem(this.MOCK_PROJECTS_KEY)) {
      const projects = [
        {
          id: "1",
          title: "E-Commerce Platform",
          description:
            "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
          technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
          live_url: "https://example-ecommerce.com",
          github_url: "https://github.com/username/ecommerce",
          is_published: true,
          is_featured: true,
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          title: "Task Management App",
          description:
            "Real-time collaborative task management application with drag-and-drop interface and team collaboration features.",
          technologies: ["React", "Firebase", "Tailwind CSS", "TypeScript"],
          live_url: "https://taskapp-demo.com",
          github_url: "https://github.com/username/taskapp",
          is_published: true,
          is_featured: true,
          created_at: "2024-01-16T10:00:00Z",
        },
        {
          id: "3",
          title: "Weather Dashboard",
          description:
            "Interactive weather dashboard with forecasts, alerts, and historical data visualization.",
          technologies: ["Vue.js", "Chart.js", "OpenWeather API"],
          live_url: "https://weather-dash.com",
          github_url: null,
          is_published: true,
          is_featured: false,
          created_at: "2024-01-17T10:00:00Z",
        },
        {
          id: "4",
          title: "Portfolio Website",
          description:
            "Personal portfolio website with admin panel, blog, and contact form.",
          technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
          live_url: null,
          github_url: "https://github.com/username/portfolio",
          is_published: false,
          is_featured: false,
          created_at: "2024-01-18T10:00:00Z",
        },
      ];
      localStorage.setItem(this.MOCK_PROJECTS_KEY, JSON.stringify(projects));
    }

    if (!localStorage.getItem(this.MOCK_CONTACTS_KEY)) {
      const contacts = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          message:
            "Hi, I'm interested in collaborating on a project. Would love to discuss further!",
          is_read: false,
          created_at: "2024-02-12T09:30:00Z",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          message:
            "Your portfolio looks great! I have a freelance opportunity that might interest you.",
          is_read: false,
          created_at: "2024-02-11T14:20:00Z",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.j@techcorp.com",
          message:
            "We're looking for a full-stack developer for our team. Are you available for a call?",
          is_read: true,
          created_at: "2024-02-10T11:15:00Z",
        },
        {
          id: "4",
          name: "Sarah Williams",
          email: "sarah.w@startup.io",
          message:
            "Love your work with React! Would you be interested in contributing to our open-source project?",
          is_read: true,
          created_at: "2024-02-09T16:45:00Z",
        },
      ];
      localStorage.setItem(this.MOCK_CONTACTS_KEY, JSON.stringify(contacts));
    }
  }

  private async getMockData<T>(
    endpoint: string,
    method: string,
    body?: any,
  ): Promise<T> {
    // Initialize mock data
    this.initMockData();

    // Log the request for debugging
    console.log("[Mock API]", method, endpoint, body);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Skills endpoints
    if (endpoint.includes("/api/skills")) {
      const skills = JSON.parse(
        localStorage.getItem(this.MOCK_SKILLS_KEY) || "[]",
      );

      if (method === "GET") {
        return skills as T;
      }

      if (method === "POST") {
        const newSkill = {
          ...body,
          id: String(Date.now()),
          is_published: false,
          created_at: new Date().toISOString(),
        };
        skills.push(newSkill);
        localStorage.setItem(this.MOCK_SKILLS_KEY, JSON.stringify(skills));
        console.log("[Mock API] Created skill:", newSkill);
        console.log("[Mock API] Total skills now:", skills.length);
        return newSkill as T;
      }

      if (method === "PUT") {
        const id = endpoint.split("/").pop();
        const index = skills.findIndex((s: any) => s.id === id);
        if (index !== -1) {
          skills[index] = { ...skills[index], ...body };
          localStorage.setItem(this.MOCK_SKILLS_KEY, JSON.stringify(skills));
          return skills[index] as T;
        }
      }

      if (method === "PATCH") {
        const id = endpoint.split("/")[4];
        const index = skills.findIndex((s: any) => s.id === id);
        if (index !== -1) {
          skills[index].is_published = !skills[index].is_published;
          localStorage.setItem(this.MOCK_SKILLS_KEY, JSON.stringify(skills));
          return skills[index] as T;
        }
      }

      if (method === "DELETE") {
        const id = endpoint.split("/").pop();
        const filtered = skills.filter((s: any) => s.id !== id);
        localStorage.setItem(this.MOCK_SKILLS_KEY, JSON.stringify(filtered));
        return { success: true } as T;
      }
    }

    // Experiences endpoints
    if (endpoint.includes("/api/experiences")) {
      const experiences = JSON.parse(
        localStorage.getItem(this.MOCK_EXPERIENCES_KEY) || "[]",
      );

      if (method === "GET") {
        return experiences as T;
      }

      if (method === "POST") {
        const newExp = {
          ...body,
          id: String(Date.now()),
          is_published: false,
          created_at: new Date().toISOString(),
        };
        experiences.push(newExp);
        localStorage.setItem(
          this.MOCK_EXPERIENCES_KEY,
          JSON.stringify(experiences),
        );
        console.log("[Mock API] Created experience:", newExp);
        console.log("[Mock API] Total experiences now:", experiences.length);
        return newExp as T;
      }

      if (method === "PUT") {
        const id = endpoint.split("/").pop();
        const index = experiences.findIndex((e: any) => e.id === id);
        if (index !== -1) {
          experiences[index] = { ...experiences[index], ...body };
          localStorage.setItem(
            this.MOCK_EXPERIENCES_KEY,
            JSON.stringify(experiences),
          );
          return experiences[index] as T;
        }
      }

      if (method === "PATCH") {
        const id = endpoint.split("/")[4];
        const index = experiences.findIndex((e: any) => e.id === id);
        if (index !== -1) {
          experiences[index].is_published = !experiences[index].is_published;
          localStorage.setItem(
            this.MOCK_EXPERIENCES_KEY,
            JSON.stringify(experiences),
          );
          return experiences[index] as T;
        }
      }

      if (method === "DELETE") {
        const id = endpoint.split("/").pop();
        const filtered = experiences.filter((e: any) => e.id !== id);
        localStorage.setItem(
          this.MOCK_EXPERIENCES_KEY,
          JSON.stringify(filtered),
        );
        return { success: true } as T;
      }
    }

    // Projects endpoints
    if (endpoint.includes("/api/projects")) {
      const projects = JSON.parse(
        localStorage.getItem(this.MOCK_PROJECTS_KEY) || "[]",
      );

      if (method === "GET") {
        return projects as T;
      }

      if (method === "POST") {
        const newProject = {
          ...body,
          id: String(Date.now()),
          is_published: false,
          is_featured: false,
          created_at: new Date().toISOString(),
        };
        projects.push(newProject);
        localStorage.setItem(this.MOCK_PROJECTS_KEY, JSON.stringify(projects));
        console.log("[Mock API] Created project:", newProject);
        console.log("[Mock API] Total projects now:", projects.length);
        return newProject as T;
      }

      if (method === "PUT") {
        const id = endpoint.split("/").pop();
        const index = projects.findIndex((p: any) => p.id === id);
        if (index !== -1) {
          projects[index] = { ...projects[index], ...body };
          localStorage.setItem(
            this.MOCK_PROJECTS_KEY,
            JSON.stringify(projects),
          );
          return projects[index] as T;
        }
      }

      if (method === "PATCH") {
        const id = endpoint.split("/")[4];
        const index = projects.findIndex((p: any) => p.id === id);
        if (index !== -1) {
          if (endpoint.includes("toggle-publish")) {
            projects[index].is_published = !projects[index].is_published;
          } else if (endpoint.includes("toggle-featured")) {
            projects[index].is_featured = !projects[index].is_featured;
          }
          localStorage.setItem(
            this.MOCK_PROJECTS_KEY,
            JSON.stringify(projects),
          );
          return projects[index] as T;
        }
      }

      if (method === "DELETE") {
        const id = endpoint.split("/").pop();
        const filtered = projects.filter((p: any) => p.id !== id);
        localStorage.setItem(this.MOCK_PROJECTS_KEY, JSON.stringify(filtered));
        return { success: true } as T;
      }
    }

    // Contact endpoints
    if (endpoint.includes("/api/contact")) {
      const contacts = JSON.parse(
        localStorage.getItem(this.MOCK_CONTACTS_KEY) || "[]",
      );

      if (method === "GET") {
        if (endpoint.includes("is_read=false")) {
          return contacts.filter((c: any) => !c.is_read) as T;
        } else if (endpoint.includes("is_read=true")) {
          return contacts.filter((c: any) => c.is_read) as T;
        }
        return contacts as T;
      }

      if (method === "PATCH") {
        const id = endpoint.split("/")[4];
        const index = contacts.findIndex((c: any) => c.id === id);
        if (index !== -1) {
          if (endpoint.includes("mark-read")) {
            contacts[index].is_read = true;
          } else if (endpoint.includes("mark-unread")) {
            contacts[index].is_read = false;
          }
          localStorage.setItem(
            this.MOCK_CONTACTS_KEY,
            JSON.stringify(contacts),
          );
          return contacts[index] as T;
        }
      }

      if (method === "DELETE") {
        const id = endpoint.split("/").pop();
        const filtered = contacts.filter((c: any) => c.id !== id);
        localStorage.setItem(this.MOCK_CONTACTS_KEY, JSON.stringify(filtered));
        return { success: true } as T;
      }
    }

    // Auth verify
    if (endpoint.includes("/api/auth/verify")) {
      return { valid: true, user: { username: "admin" } } as T;
    }

    return {} as T;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    // Development mode: return mock data to avoid backend errors
    if (DEV_MODE) {
      const body = options.body
        ? JSON.parse(options.body as string)
        : undefined;
      return this.getMockData<T>(endpoint, options.method || "GET", body);
    }

    try {
      const { skipAuth = false, ...fetchOptions } = options;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((fetchOptions.headers as Record<string, string>) || {}),
      };

      if (!skipAuth) {
        Object.assign(headers, this.getAuthHeaders());
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      // Handle 401 - token expired or invalid
      if (response.status === 401 && !skipAuth) {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin";
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "An error occurred",
        }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors (backend not running, CORS, etc.)
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch")
      ) {
        console.error(
          "[API] Backend server is not responding. Please ensure the backend is running at",
          this.baseURL,
        );
        throw new Error(
          "Backend server is not responding. Please start your backend server at " +
            this.baseURL,
        );
      }
      throw error;
    }
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request<{
      status: string;
      message: string;
      data: { token: string; user: any };
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      skipAuth: true,
    });
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user: any }>("/api/auth/verify");
  }

  // Skills endpoints
  async getSkills() {
    try {
      const response = await this.request<any>("/api/skills");
      // Handle both array response and wrapped response
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      if (response && Array.isArray(response.skills)) {
        return response.skills;
      }
      console.warn("[API] Unexpected skills response format:", response);
      return [];
    } catch (error) {
      console.error("[API] Error fetching skills:", error);
      return [];
    }
  }

  async createSkill(data: any) {
    return this.request("/api/skills", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createSkillWithIcon(data: any, iconFile: File) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("level", data.level.toString());
    formData.append("category", data.category);
    formData.append("is_published", data.is_published ? "true" : "false");
    if (data.order_index !== undefined) {
      formData.append("order_index", data.order_index.toString());
    }
    formData.append("icon", iconFile);

    const token = localStorage.getItem("admin_token");
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("[API] Creating skill with icon:", {
      name: data.name,
      level: data.level,
      category: data.category,
      fileName: iconFile.name,
      fileSize: iconFile.size,
    });

    const response = await fetch(`${this.baseURL}/api/skills/with-icon`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary
      },
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to create skill with icon",
      }));
      console.error("[API] Create skill error:", error);
      throw new Error(error.message || "Failed to create skill with icon");
    }

    const result = await response.json();
    console.log("[API] Skill created successfully:", result);
    return result.data || result;
  }

  async updateSkill(id: string, data: any) {
    return this.request(`/api/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateSkillWithIcon(id: string, data: any, iconFile: File) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("level", data.level.toString());
    formData.append("category", data.category);
    formData.append("is_published", data.is_published ? "true" : "false");
    if (data.order_index !== undefined) {
      formData.append("order_index", data.order_index.toString());
    }
    formData.append("icon", iconFile);

    const token = localStorage.getItem("admin_token");
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("[API] Updating skill with icon:", {
      id,
      name: data.name,
      level: data.level,
      category: data.category,
      fileName: iconFile.name,
      fileSize: iconFile.size,
    });

    const response = await fetch(`${this.baseURL}/api/skills/${id}/with-icon`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary
      },
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to update skill with icon",
      }));
      console.error("[API] Update skill error:", error);
      throw new Error(error.message || "Failed to update skill with icon");
    }

    const result = await response.json();
    console.log("[API] Skill updated successfully:", result);
    return result.data || result;
  }

  async toggleSkillPublish(id: string) {
    return this.request(`/api/skills/${id}/toggle-publish`, {
      method: "PATCH",
    });
  }

  async deleteSkill(id: string) {
    return this.request(`/api/skills/${id}`, {
      method: "DELETE",
    });
  }

  // Experiences endpoints
  async getExperiences() {
    try {
      const response = await this.request<any>("/api/experiences");
      // Handle both array response and wrapped response
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      if (response && Array.isArray(response.experiences)) {
        return response.experiences;
      }
      console.warn("[API] Unexpected experiences response format:", response);
      return [];
    } catch (error) {
      console.error("[API] Error fetching experiences:", error);
      return [];
    }
  }

  async createExperience(data: any) {
    return this.request("/api/experiences", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateExperience(id: string, data: any) {
    return this.request(`/api/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async toggleExperiencePublish(id: string) {
    return this.request(`/api/experiences/${id}/toggle-publish`, {
      method: "PATCH",
    });
  }

  async deleteExperience(id: string) {
    return this.request(`/api/experiences/${id}`, {
      method: "DELETE",
    });
  }

  // Projects endpoints
  async getProjects() {
    try {
      const response = await this.request<any>("/api/projects");
      // Handle both array response and wrapped response
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      if (response && Array.isArray(response.projects)) {
        return response.projects;
      }
      console.warn("[API] Unexpected projects response format:", response);
      return [];
    } catch (error) {
      console.error("[API] Error fetching projects:", error);
      return [];
    }
  }

  async createProject(data: any) {
    return this.request("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async toggleProjectPublish(id: string) {
    return this.request(`/api/projects/${id}/toggle-publish`, {
      method: "PATCH",
    });
  }

  async toggleProjectFeatured(id: string) {
    return this.request(`/api/projects/${id}/toggle-featured`, {
      method: "PATCH",
    });
  }

  async deleteProject(id: string) {
    return this.request(`/api/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Contact endpoints
  async getContactMessages(isRead?: boolean) {
    try {
      const query = isRead !== undefined ? `?is_read=${isRead}` : "";
      const response = await this.request<any>(`/api/contact${query}`);
      // Handle both array response and wrapped response
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      if (response && Array.isArray(response.messages)) {
        return response.messages;
      }
      console.warn("[API] Unexpected contacts response format:", response);
      return [];
    } catch (error) {
      console.error("[API] Error fetching contact messages:", error);
      return [];
    }
  }

  async markContactRead(id: string) {
    return this.request(`/api/contact/${id}/mark-read`, {
      method: "PATCH",
    });
  }

  async markContactUnread(id: string) {
    return this.request(`/api/contact/${id}/mark-unread`, {
      method: "PATCH",
    });
  }

  async deleteContactMessage(id: string) {
    return this.request(`/api/contact/${id}`, {
      method: "DELETE",
    });
  }

  // Upload project image to backend /public/uploads folder
  async uploadProjectImage(formData: FormData) {
    const token = localStorage.getItem("admin_token");
    const response = await fetch(`${this.baseURL}/api/upload/project-image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Failed to upload image");
    }
    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
