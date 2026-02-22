# Admin Dashboard Structure

## 📁 Folder Organization

```
src/admin/
├── components/          # Reusable admin UI components
│   ├── AdminLayout.tsx  # Main layout wrapper with sidebar & header
│   ├── AuthGuard.tsx    # Route protection component
│   ├── Sidebar.tsx      # Left navigation sidebar
│   ├── Header.tsx       # Top header with user menu
│   ├── DataTable.tsx    # Reusable data table component
│   ├── Modal.tsx        # Modal dialog component
│   ├── ConfirmDialog.tsx # Confirmation dialog
│   └── ToastContainer.tsx # Toast notifications
│
├── pages/              # Admin page components
│   ├── Login.tsx       # Admin login page
│   ├── Dashboard.tsx   # Overview dashboard
│   ├── Skills.tsx      # Skills CRUD page
│   ├── Experiences.tsx # Experiences CRUD page
│   ├── Projects.tsx    # Projects CRUD page
│   └── Contact.tsx     # Contact messages page
│
└── utils/              # Admin utilities
    ├── apiClient.ts    # API client with JWT auto-injection
    ├── auth.ts         # Authentication helpers
    └── toast.ts        # Toast notification manager
```

## 🔐 Authentication Flow

1. User visits `/admin` → Login page
2. Enters credentials → JWT token returned
3. Token stored in localStorage
4. All protected routes wrapped in `<AuthGuard>`
5. AuthGuard verifies token on load
6. Invalid/expired token → redirect to login

## 🛠️ Admin Features

### Dashboard Overview

- Total counts for Skills, Experiences, Projects
- Unread contact messages count
- Quick action links

### Skills Management

- Create, update, delete skills
- Toggle publish status
- Set proficiency levels
- Categorize skills

### Experiences Management

- Add work experiences
- Set date ranges (current job support)
- Toggle publish status
- Rich descriptions

### Projects Management

- Manage portfolio projects
- Toggle publish & featured status
- Add technologies, URLs
- Link to GitHub & live demos

### Contact Messages

- View incoming messages
- Mark as read/unread
- Filter by status
- Delete messages
- Reply via email

## 🎨 UI Components

### DataTable

Reusable table with:

- Column configuration
- Custom renderers
- Row actions
- Loading states
- Empty states

### Modal

Form modals with:

- Title & close button
- Custom width options
- Backdrop overlay
- Clean styling

### Toast Notifications

- Success, Error, Info, Warning types
- Auto-dismiss with custom duration
- Manual dismiss option
- Sliding animation

### ConfirmDialog

- Confirmation prompts before destructive actions
- Danger, Warning, Info variants
- Custom messages & labels

## 🔧 API Client

Auto-injected JWT authentication:

```typescript
apiClient.getSkills(); // GET /api/skills
apiClient.createSkill(data); // POST /api/skills
apiClient.updateSkill(id, data); // PUT /api/skills/:id
apiClient.toggleSkillPublish(id); // PATCH /api/skills/:id/toggle-publish
apiClient.deleteSkill(id); // DELETE /api/skills/:id
```

Similar methods for Experiences, Projects, and Contact.

## 📝 Usage Example

### Adding a new admin page:

1. Create page in `src/admin/pages/`
2. Add route in `src/index.tsx`
3. Wrap with `<AuthGuard>`
4. Add sidebar link in `Sidebar.tsx`
5. Use `AdminLayout` wrapper
6. Use `apiClient` for API calls
7. Show toasts with `toastManager`

```tsx
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "../utils/apiClient";
import { toastManager } from "../utils/toast";

export default function MyPage() {
  const handleAction = async () => {
    try {
      await apiClient.someAction();
      toastManager.success("Action completed!");
    } catch (error) {
      toastManager.error(error.message);
    }
  };

  return <AdminLayout>{/* Your content */}</AdminLayout>;
}
```

## 🚀 Getting Started

1. Ensure backend API is running
2. Set `VITE_API_BASE_URL` in `.env` (defaults to `http://localhost:3000`)
3. Start dev server: `npm run dev`
4. Navigate to `/admin`
5. Login with admin credentials
6. Access protected admin routes

## 🔒 Security Notes

- JWT tokens stored in localStorage
- Auto-redirect on token expiration
- 401 responses trigger logout
- Password stored as `Leepassword@123` (update in backend)
- All admin routes protected by AuthGuard

## 🎯 Best Practices

- Always wrap API calls in try/catch
- Show loading states during operations
- Provide success/error feedback via toasts
- Confirm destructive actions with ConfirmDialog
- Use optimistic UI updates when appropriate
- Keep forms simple and validated
