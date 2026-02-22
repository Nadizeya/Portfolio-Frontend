import { useEffect, useState } from "react";
import { Code, Briefcase, FolderGit2, Mail } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "../utils/apiClient";

interface Stats {
  skills: number;
  experiences: number;
  projects: number;
  unreadMessages: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    skills: 0,
    experiences: 0,
    projects: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [skills, experiences, projects, contacts] = await Promise.all([
        apiClient.getSkills(),
        apiClient.getExperiences(),
        apiClient.getProjects(),
        apiClient.getContactMessages(false),
      ]);

      setStats({
        skills: skills.length,
        experiences: experiences.length,
        projects: projects.length,
        unreadMessages: contacts.length,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Skills",
      value: stats.skills,
      icon: Code,
      color: "bg-blue-500",
      link: "/admin/skills",
    },
    {
      title: "Total Experiences",
      value: stats.experiences,
      icon: Briefcase,
      color: "bg-green-500",
      link: "/admin/experiences",
    },
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderGit2,
      color: "bg-purple-500",
      link: "/admin/projects",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: Mail,
      color: "bg-red-500",
      link: "/admin/contact",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of your portfolio content
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.title}
                  href={card.link}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${card.color} rounded-lg mb-4`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </a>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/skills"
              className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
            >
              Manage Skills
            </a>
            <a
              href="/admin/experiences"
              className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-center font-medium"
            >
              Manage Experiences
            </a>
            <a
              href="/admin/projects"
              className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium"
            >
              Manage Projects
            </a>
            <a
              href="/admin/contact"
              className="px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-center font-medium"
            >
              View Messages
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
