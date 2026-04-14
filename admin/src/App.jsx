import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import { getStoredRole, getStoredToken } from './lib/storage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import BulkUploadPage from './pages/BulkUploadPage'
import EnrollmentsPage from './pages/EnrollmentsPage'
import LoginPage from './pages/LoginPage'
import ResourcePage from './pages/ResourcePage'

function RequireAdmin({ children }) {
  const token = getStoredToken()
  const role = getStoredRole()

  if (!token || role !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  return children
}

function RedirectHome() {
  const token = getStoredToken()
  const role = getStoredRole()

  if (token && role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Navigate to="/login" replace />
}

function ProtectedAdminRoutes() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </RequireAdmin>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RedirectHome />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={<ProtectedAdminRoutes />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="students" element={<ResourcePage resourceKey="students" />} />
        <Route path="teachers" element={<ResourcePage resourceKey="teachers" />} />
        <Route path="subjects" element={<ResourcePage resourceKey="subjects" />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="bulk-upload" element={<BulkUploadPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
