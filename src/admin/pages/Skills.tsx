import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import DataTable, { TableActions } from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import IconPicker from "../components/IconPicker";
import { apiClient } from "../utils/apiClient";
import { toastManager } from "../utils/toast";
import { getIconByName, isReactIcon } from "../../utils/iconMap";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  is_published: boolean;
  created_at: string;
}

const CATEGORIES = ["Frontend", "Backend", "Tools", "AI"] as const;

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: 50,
    icon: "",
    is_published: false,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSkills();
      console.log("[Skills] Loaded skills:", data);
      // Ensure data is always an array
      setSkills(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("[Skills] Error loading skills:", error);
      toastManager.error(error.message || "Failed to load skills");
      setSkills([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon || "",
        is_published: skill.is_published,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "Frontend",
        level: 50,
        icon: "",
        is_published: false,
      });
    }
    setSubmitting(false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Skills] Submitting form:", formData);

    try {
      setSubmitting(true);

      if (editingSkill) {
        console.log("[Skills] Updating skill:", editingSkill.id);
        await apiClient.updateSkill(editingSkill.id, formData);
        toastManager.success("Skill updated successfully");
      } else {
        console.log("[Skills] Creating new skill");
        await apiClient.createSkill(formData);
        toastManager.success("Skill created successfully");
      }

      setShowModal(false);
      await loadSkills();
      console.log("[Skills] Form submitted successfully");
    } catch (error: any) {
      console.error("[Skills] Error submitting form:", error);
      toastManager.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (skill: Skill) => {
    try {
      await apiClient.toggleSkillPublish(skill.id);
      toastManager.success(
        `Skill ${skill.is_published ? "unpublished" : "published"}`,
      );
      loadSkills();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteSkill(id);
      toastManager.success("Skill deleted successfully");
      setDeleteConfirm(null);
      loadSkills();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const columns = [
    {
      key: "icon",
      label: "Icon",
      render: (skill: Skill) => (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 border border-gray-200">
          {skill.icon ? (
            isReactIcon(skill.icon) ? (
              (() => {
                const IconComponent = getIconByName(skill.icon);
                return IconComponent ? (
                  <IconComponent className="w-5 h-5 text-gray-700" />
                ) : (
                  <span className="text-xs font-bold text-gray-500">
                    {skill.name.substring(0, 2).toUpperCase()}
                  </span>
                );
              })()
            ) : (
              <img
                src={skill.icon}
                alt={skill.name}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("span");
                    fallback.className = "text-xs font-bold text-gray-500";
                    fallback.textContent = skill.name
                      .substring(0, 2)
                      .toUpperCase();
                    parent.appendChild(fallback);
                  }
                }}
              />
            )
          ) : (
            <span className="text-xs font-bold text-gray-500">
              {skill.name.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    {
      key: "level",
      label: "Level",
      render: (skill: Skill) => `${skill.level}%`,
    },
    {
      key: "is_published",
      label: "Status",
      render: (skill: Skill) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            skill.is_published
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {skill.is_published ? "Published" : "Draft"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      icon: TableActions.Edit,
      label: "Edit",
      onClick: (skill: Skill) => handleOpenModal(skill),
    },
    {
      icon: TableActions.ToggleVisible(true),
      label: "Toggle Publish",
      onClick: (skill: Skill) => handleTogglePublish(skill),
    },
    {
      icon: TableActions.Delete,
      label: "Delete",
      onClick: (skill: Skill) => setDeleteConfirm(skill.id),
      variant: "danger" as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
            <p className="text-gray-600 mt-1">Manage your technical skills</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Skill
          </button>
        </div>

        <DataTable
          data={skills}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="No skills found. Add your first skill!"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (React Icons)
            </label>
            <IconPicker
              value={formData.icon}
              onChange={(iconName) =>
                setFormData({ ...formData, icon: iconName })
              }
              category={formData.category}
            />
            <p className="text-xs text-gray-500 mt-2">
              Choose from popular tech icons or search for any React Icon.
              Examples: FaReact, SiTypescript, DiNodejs
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level: {formData.level}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_published: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="is_published"
              className="text-sm font-medium text-gray-700"
            >
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={submitting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>{editingSkill ? "Update" : "Create"}</>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </AdminLayout>
  );
}
