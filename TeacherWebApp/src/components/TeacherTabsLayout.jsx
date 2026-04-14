import { House, QrCode, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/teacher/dashboard', label: 'Home', icon: House },
  { to: '/teacher/qrcode', label: 'QR Code', icon: QrCode },
  { to: '/teacher/profile', label: 'Profile', icon: UserRound }
]

export default function TeacherTabsLayout({ children }) {
  return (
    <div className="page-shell teacher-shell">
      <div className="page-accent page-accent-top" />
      <div className="page-accent page-accent-bottom" />
      <div className="page-accent page-accent-side" />

      <div className="teacher-layout">
        <aside className="teacher-sidebar">
          <div className="teacher-sidebar-brand">
            <div className="app-icon-placeholder">APP</div>
            <div>
              <div className="app-name">Teacher Portal</div>
              <p className="sidebar-copy">Attendance dashboard</p>
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

          <div className="teacher-sidebar-note">
            <span className="eyebrow-copy">Teacher</span>
            <p className="sidebar-copy">
              Manage live attendance, recent sessions, and profile settings from one place.
            </p>
          </div>
        </aside>

        <main className="page-content teacher-page-content">{children}</main>
      </div>
    </div>
  )
}
