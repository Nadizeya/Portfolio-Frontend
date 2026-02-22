import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import DataTable, { TableActions } from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { apiClient } from "../utils/apiClient";
import { toastManager } from "../utils/toast";

interface Project {
  id: string;
  title: string;
  description: string;
  full_description: string;
  my_role: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  demo_video?: string;
  status: "completed" | "in-progress" | "planned";
  featured: boolean;
  order_index: number;
  is_published: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    full_description: "",
    my_role: "",
    image: "",
    tags: "",
    link: "",
    github: "",
    demo_video: "",
    status: "completed" as "completed" | "in-progress" | "planned",
    order_index: "0",
    is_published: true,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProjects();
      console.log("[Projects] Loaded projects:", data);
      // Ensure data is always an array
      setProjects(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("[Projects] Error loading projects:", error);
      toastManager.error(error.message || "Failed to load projects");
      setProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        full_description: project.full_description,
        my_role: project.my_role,
        image: project.image,
        tags: (project.tags || []).join(", "),
        link: project.link || "",
        github: project.github || "",
        demo_video: project.demo_video || "",
        status: project.status,
        order_index: String(project.order_index || 0),
        is_published: project.is_published,
      });
      setImagePreview(project.image);
      setImageFile(null);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        full_description: "",
        my_role: "",
        image: "",
        tags: "",
        link: "",
        github: "",
        demo_video: "",
        status: "completed",
        order_index: "0",
        is_published: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image;
    const fd = new FormData();
    fd.append("image", imageFile);
    try {
      setUploading(true);
      const res = await apiClient.uploadProjectImage(fd);
      return res.data.url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Projects] Submitting form:", formData);

    try {
      const imageUrl = await uploadImage();
      if (!imageUrl) {
        toastManager.error("Please upload an image or provide an image URL");
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        full_description: formData.full_description,
        my_role: formData.my_role,
        image: imageUrl,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        link: formData.link || undefined,
        github: formData.github || undefined,
        demo_video: formData.demo_video || undefined,
        status: formData.status,
        order_index: parseInt(formData.order_index) || 0,
        is_published: formData.is_published,
        featured: false, // Default to false, can be toggled later
      };

      if (editingProject) {
        console.log("[Projects] Updating project:", editingProject.id);
        await apiClient.updateProject(editingProject.id, payload);
        toastManager.success("Project updated successfully");
      } else {
        console.log("[Projects] Creating new project");
        const result = await apiClient.createProject(payload);
        console.log("[Projects] Create result:", result);
        toastManager.success("Project created successfully");
      }
      setShowModal(false);
      await loadProjects();
      console.log("[Projects] Form submitted successfully");
    } catch (error: any) {
      console.error("[Projects] Error submitting form:", error);
      toastManager.error(error.message);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      await apiClient.toggleProjectPublish(project.id);
      toastManager.success(
        `Project ${project.is_published ? "unpublished" : "published"}`,
      );
      loadProjects();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await apiClient.toggleProjectFeatured(project.id);
      toastManager.success(
        `Project ${project.featured ? "unfeatured" : "featured"}`,
      );
      loadProjects();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteProject(id);
      toastManager.success("Project deleted successfully");
      setDeleteConfirm(null);
      loadProjects();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (project: Project) => (
        <img
          src={project.image}
          alt={project.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
      ),
    },
    { key: "title", label: "Title" },
    {
      key: "tags",
      label: "Tags",
      render: (project: Project) => (
        <div className="flex flex-wrap gap-1">
          {(project.tags || []).slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {tech}
            </span>
          ))}
          {(project.tags || []).length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              +{(project.tags || []).length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (project: Project) => (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                project.is_published
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {project.is_published ? "Published" : "Draft"}
            </span>
            {project.featured && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${
              project.status === "completed"
                ? "bg-blue-100 text-blue-800"
                : project.status === "in-progress"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {project.status}
          </span>
        </div>
      ),
    },
  ];

  const actions = [
    {
      icon: TableActions.Edit,
      label: "Edit",
      onClick: (project: Project) => handleOpenModal(project),
    },
    {
      icon: TableActions.ToggleVisible(true),
      label: "Toggle Publish",
      onClick: (project: Project) => handleTogglePublish(project),
    },
    {
      icon: <Star size={18} fill={true ? "currentColor" : "none"} />,
      label: "Toggle Featured",
      onClick: (project: Project) => handleToggleFeatured(project),
      variant: "success" as const,
    },
    {
      icon: TableActions.Delete,
      label: "Delete",
      onClick: (project: Project) => setDeleteConfirm(project.id),
      variant: "danger" as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">
              Showcase your portfolio projects
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Project
          </button>
        </div>

        <DataTable
          data={projects}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="No projects found. Add your first project!"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? "Edit Project" : "Add New Project"}
        maxWidth="2xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                placeholder="Brief project description for cards"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description *
              </label>
              <textarea
                value={formData.full_description}
                onChange={(e) =>
                  setFormData({ ...formData, full_description: e.target.value })
                }
                rows={3}
                placeholder="Detailed project overview for modal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                My Role *
              </label>
              <textarea
                value={formData.my_role}
                onChange={(e) =>
                  setFormData({ ...formData, my_role: e.target.value })
                }
                rows={2}
                placeholder="Describe your contributions and responsibilities"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Image *
              </label>

              {/* Preview */}
              {imagePreview && (
                <div className="mb-3 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                      setFormData((p) => ({ ...p, image: "" }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* File Upload */}
              <label className="block cursor-pointer mb-3">
                <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400 mb-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                      {uploading
                        ? "Uploading..."
                        : imageFile
                          ? imageFile.name
                          : "Click to upload image"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* OR url */}
              <div className="relative flex items-center gap-3 mb-2">
                <div className="flex-1 border-t border-gray-300" />
                <span className="text-xs text-gray-500">OR paste URL</span>
                <div className="flex-1 border-t border-gray-300" />
              </div>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  if (e.target.value) {
                    setImagePreview(e.target.value);
                    setImageFile(null);
                  }
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated) *
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="React, TypeScript, Node.js"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Live URL
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="https://github.com/username/repo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demo Video URL
              </label>
              <input
                type="url"
                value={formData.demo_video}
                onChange={(e) =>
                  setFormData({ ...formData, demo_video: e.target.value })
                }
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({ ...formData, order_index: e.target.value })
                }
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData({ ...formData, is_published: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Published (visible on public site)
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingProject ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </AdminLayout>
  );
}
