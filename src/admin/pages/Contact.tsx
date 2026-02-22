import { useEffect, useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import DataTable, { TableActions } from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { apiClient } from "../utils/apiClient";
import { toastManager } from "../utils/toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Contact() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      let data;
      if (filter === "unread") {
        data = await apiClient.getContactMessages(false);
      } else if (filter === "read") {
        data = await apiClient.getContactMessages(true);
      } else {
        data = await apiClient.getContactMessages();
      }
      // Ensure data is always an array
      setMessages(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("[Contact] Error loading messages:", error);
      toastManager.error(error.message || "Failed to load messages");
      setMessages([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setViewMessage(message);

    // Mark as read if unread
    if (!message.is_read) {
      try {
        await apiClient.markContactRead(message.id);
        loadMessages();
      } catch (error: any) {
        toastManager.error(error.message);
      }
    }
  };

  const handleToggleRead = async (message: ContactMessage) => {
    try {
      if (message.is_read) {
        await apiClient.markContactUnread(message.id);
        toastManager.success("Marked as unread");
      } else {
        await apiClient.markContactRead(message.id);
        toastManager.success("Marked as read");
      }
      loadMessages();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteContactMessage(id);
      toastManager.success("Message deleted successfully");
      setDeleteConfirm(null);
      loadMessages();
    } catch (error: any) {
      toastManager.error(error.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      key: "status",
      label: "",
      render: (msg: ContactMessage) => (
        <div className="w-2 h-2 rounded-full">
          {!msg.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "message",
      label: "Message Preview",
      render: (msg: ContactMessage) => (
        <span className="line-clamp-1 text-gray-600">
          {msg.message.substring(0, 60)}...
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (msg: ContactMessage) => (
        <span className="text-sm text-gray-500">
          {formatDate(msg.created_at)}
        </span>
      ),
    },
  ];

  const actions = [
    {
      icon: <Mail size={18} />,
      label: "View",
      onClick: (msg: ContactMessage) => handleViewMessage(msg),
    },
    {
      icon: msg.is_read ? <Mail size={18} /> : <MailOpen size={18} />,
      label: msg.is_read ? "Mark Unread" : "Mark Read",
      onClick: (msg: ContactMessage) => handleToggleRead(msg),
    },
    {
      icon: TableActions.Delete,
      label: "Delete",
      onClick: (msg: ContactMessage) => setDeleteConfirm(msg.id),
      variant: "danger" as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contact Messages
            </h1>
            <p className="text-gray-600 mt-1">
              Manage incoming contact form submissions
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "read"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Read
            </button>
          </div>
        </div>

        <DataTable
          data={messages}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage={
            filter === "unread"
              ? "No unread messages"
              : filter === "read"
                ? "No read messages"
                : "No messages yet"
          }
        />
      </div>

      {/* View Message Modal */}
      <Modal
        isOpen={viewMessage !== null}
        onClose={() => setViewMessage(null)}
        title="Contact Message"
        maxWidth="xl"
      >
        {viewMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900">{viewMessage.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <a
                  href={`mailto:${viewMessage.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {viewMessage.email}
                </a>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Received
              </label>
              <p className="text-gray-900">
                {formatDate(viewMessage.created_at)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {viewMessage.message}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                onClick={() => setViewMessage(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <a
                href={`mailto:${viewMessage.email}?subject=Re: Your message&body=Hi ${viewMessage.name},%0D%0A%0D%0A`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Mail size={18} />
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </AdminLayout>
  );
}
