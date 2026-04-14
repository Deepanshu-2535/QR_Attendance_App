import { DatabaseZap, ShieldCheck, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ToastProvider'
import { getStoredRole, getStoredToken, storeSession } from '../lib/storage'

const DUMMY_ADMIN_TOKEN = 'dummy-admin-token'
const DUMMY_ADMIN_ROLE = 'ADMIN'
const DEFAULT_EMAIL = 'admin@demo.local'
const DEFAULT_PASSWORD = 'demo-admin'

export default function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getStoredToken() && getStoredRole() === DUMMY_ADMIN_ROLE) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  function handleLogin(event) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      showToast({
        type: 'error',
        title: 'Missing dummy credentials',
        message: 'Enter any email and password to continue with the placeholder admin login.'
      })
      return
    }

    setLoading(true)

    storeSession(DUMMY_ADMIN_TOKEN, DUMMY_ADMIN_ROLE)
    showToast({
      type: 'success',
      title: 'Dummy admin session started',
      message: 'Backend authentication is bypassed on this page for now.'
    })
    navigate('/admin/dashboard', { replace: true })
    setLoading(false)
  }

  return (
    <div className="page-shell page-shell-login">
      <div className="page-accent page-accent-top" />
      <div className="page-accent page-accent-bottom" />
      <div className="page-accent page-accent-side" />

      <main className="auth-container">
        <section className="auth-showcase">
          <div className="app-header">
            <div className="app-icon-placeholder">APP</div>
            <div className="app-name">Admin Panel</div>
          </div>

          <section className="headline-block auth-headline">
            <h1>System Control</h1>
            <p>
              A unified admin workspace for students, teachers, subjects, enrollments, and bulk
              onboarding.
            </p>
          </section>

          <div className="auth-mini-stats">
            <div className="auth-mini-stat">
              <span>Roster management</span>
            </div>
            <div className="auth-mini-stat">
              <span>Bulk imports</span>
            </div>
            <div className="auth-mini-stat">
              <span>Faculty control</span>
            </div>
          </div>

          <div className="auth-point-list">
            <div className="auth-point">
              <div className="auth-point-icon">
                <DatabaseZap size={18} />
              </div>
              <div>
                <strong>Maintain the live academic registry</strong>
                <span>Update students, teachers, and subjects without leaving the dashboard.</span>
              </div>
            </div>
            <div className="auth-point">
              <div className="auth-point-icon">
                <Upload size={18} />
              </div>
              <div>
                <strong>Import spreadsheets in minutes</strong>
                <span>Upload CSV or Excel files, preview rows, and push verified records quickly.</span>
              </div>
            </div>
            <div className="auth-point">
              <div className="auth-point-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong>Use a temporary local-only admin entry</strong>
                <span>This screen now creates a placeholder admin session without contacting the backend.</span>
              </div>
            </div>
          </div>

          <p className="support-copy">This temporary sign-in is for UI flow only while the real admin auth is on hold.</p>
        </section>

        <section className="auth-form-shell">
          <form className="page-card auth-card auth-card-hero" onSubmit={handleLogin}>
            <div className="auth-card-top">
              <h2>Dummy Admin Sign In</h2>
              <p className="subtle-text">Enter any values below to create a local placeholder admin session.</p>
            </div>

            <label className="field-label" htmlFor="email">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@demo.local"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="text-input"
              required
            />

            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter any password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="text-input"
              required
            />

            <button type="submit" className="primary-button auth-submit-button" disabled={loading}>
              {loading ? 'Opening Admin...' : 'Continue to Admin'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
