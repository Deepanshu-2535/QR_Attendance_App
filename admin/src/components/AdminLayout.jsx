import {
  BookOpenText,
  GraduationCap,
  LayoutDashboard,
  Link2,
  LogOut,
  Upload,
  Users
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession } from '../lib/storage'

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: GraduationCap },
  { to: '/admin/teachers', label: 'Teachers', icon: Users },
  { to: '/admin/subjects', label: 'Subjects', icon: BookOpenText },
  { to: '/admin/enrollments', label: 'Enrollments', icon: Link2 },
  { to: '/admin/bulk-upload', label: 'Bulk Upload', icon: Upload }
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page-shell admin-shell">
      <div className="page-accent page-accent-top" />
      <div className="page-accent page-accent-bottom" />
      <div className="page-accent page-accent-side" />

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div className="app-icon-placeholder">APP</div>
            <div>
              <div className="app-name">Admin Panel</div>
              <p className="sidebar-copy">Attendance control center</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-nav-item sidebar-nav-item-active' : 'sidebar-nav-item'
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="admin-sidebar-note">
            <span className="eyebrow-copy">Admin</span>
            <p className="sidebar-copy">
              Maintain people, subjects, enrollments, and spreadsheet imports without leaving the
              same system.
            </p>
          </div>

          <button type="button" className="ghost-button sidebar-logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </aside>

        <main className="page-content admin-page-content">{children}</main>
      </div>
    </div>
  )
}
