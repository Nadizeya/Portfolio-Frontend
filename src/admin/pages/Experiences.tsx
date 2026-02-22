import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import DataTable, { TableActions } from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { apiClient } from "../utils/apiClient";
import { toastManager } from "../utils/toast";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  company_logo?: string;
  location?: string;
  order_index: number;
  is_published: boolean;
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "",
    description: "", // newline-separated in the textarea, split to array on submit
    company_logo: "",
    location: "",
    order_index: "0",
    is_published: true,
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getExperiences();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toastManager.error(error.message || "Failed to load experiences");
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        role: exp.role,
        company: exp.company,
        period: exp.period,
        description: (exp.description || []).join("\n"),
        company_logo: exp.company_logo || "",
        location: exp.location || "",
        order_index: String(exp.order_index || 0),
        is_published: exp.is_published,
      });
    } else {
      setEditingExp(null);
      setFormData({
        role: "",
        company: "",
        period: "",
        description: "",
        company_logo: "",
        location: "",
        order_index: "0",
        is_published: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        role: formData.role,
        company: formData.company,
        period: formData.period,
        description: formData.description
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        company_logo: formData.company_logo || undefined,
        location: formData.location || undefined,
        order_index: parseInt(formData.order_index) || 0,
        is_published: formData.is_published,
      };

      if (editingExp) {
        await apiClient.updateExperience(editingExp.id, payload);
        toastManager.success("Experience updated successfully");
      } else {
        await apiClient.createExperience(payload);
        toastManager.success("Experience created successfully");
      }
      setShowModal(false);
      await loadExperiences();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const handleTogglePublish = async (exp: Experience) => {
    try {
      await apiClient.toggleExperiencePublish(exp.id);
      toastManager.success(
        `Experience ${exp.is_published ? "unpublished" : "published"}`,
      );
      loadExperiences();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteExperience(id);
      toastManager.success("Experience deleted successfully");
      setDeleteConfirm(null);
      loadExperiences();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const columns = [
    { key: "role", label: "Role" },
    { key: "company", label: "Company" },
    { key: "period", label: "Period" },
    {
      key: "location",
      label: "Location",
      render: (exp: Experience) => exp.location || "—",
    },
    {
      key: "is_published",
      label: "Status",
      render: (exp: Experience) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            exp.is_published
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {exp.is_published ? "Published" : "Draft"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      icon: TableActions.Edit,
      label: "Edit",
      onClick: (exp: Experience) => handleOpenModal(exp),
    },
    {
      icon: TableActions.ToggleVisible(true),
      label: "Toggle Publish",
      onClick: (exp: Experience) => handleTogglePublish(exp),
    },
    {
      icon: TableActions.Delete,
      label: "Delete",
      onClick: (exp: Experience) => setDeleteConfirm(exp.id),
      variant: "danger" as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
            <p className="text-gray-600 mt-1">
              Manage your work experience history
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Experience
          </button>
        </div>

        <DataTable
          data={experiences}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="No experiences found. Add your first experience!"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingExp ? "Edit Experience" : "Add New Experience"}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role / Job Title *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="Senior Frontend Engineer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Acme Corp"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period *
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                placeholder="2022 - Present"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="San Francisco, CA"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
              <span className="ml-2 text-xs text-gray-400 font-normal">
                (one bullet point per line)
              </span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              placeholder={`Led development of core platform features.\nReduced load time by 40% through optimization.\nMentored 3 junior developers.`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo URL
              </label>
              <input
                type="url"
                value={formData.company_logo}
                onChange={(e) =>
                  setFormData({ ...formData, company_logo: e.target.value })
                }
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
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
          </div>

          <div>
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
              {editingExp ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </AdminLayout>
  );
}
