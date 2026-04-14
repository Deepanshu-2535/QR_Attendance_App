import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import TeacherTabsLayout from './components/TeacherTabsLayout'
import AboutPage from './pages/AboutPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import QRCodePage from './pages/QRCodePage'
import SessionDetailsPage from './pages/SessionDetailsPage'
import TeacherDashboardPage from './pages/TeacherDashboardPage'
import { getStoredRole, getStoredToken } from './lib/storage'

function RequireTeacher({ children }) {
  const token = getStoredToken()
  const role = getStoredRole()

  if (!token || role !== 'TEACHER') {
    return <Navigate to="/login" replace />
  }

  return children
}

function RedirectHome() {
  const token = getStoredToken()
  const role = getStoredRole()

  if (token && role === 'TEACHER') {
    return <Navigate to="/teacher/dashboard" replace />
  }

  return <Navigate to="/login" replace />
}

function TeacherTabRoutes() {
  return (
    <RequireTeacher>
      <TeacherTabsLayout>
        <Outlet />
      </TeacherTabsLayout>
    </RequireTeacher>
  )
}

function ProtectedStandalone() {
  return (
    <RequireTeacher>
      <Outlet />
    </RequireTeacher>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RedirectHome />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/teacher" element={<TeacherTabRoutes />}>
        <Route path="dashboard" element={<TeacherDashboardPage />} />
        <Route path="qrcode" element={<QRCodePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route element={<ProtectedStandalone />}>
        <Route path="/teacher/session/:id" element={<SessionDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
