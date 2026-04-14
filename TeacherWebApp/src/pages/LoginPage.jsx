import { ChartNoAxesColumn, QrCode, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/apiClient'
import { ENDPOINTS } from '../constants/api'
import { storeSession } from '../lib/storage'
import { useToast } from '../components/ToastProvider'

export default function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const data = await api.post(ENDPOINTS.AUTH, { email, password })

      if (data.role !== 'TEACHER') {
        showToast({
          type: 'error',
          title: 'Teacher account required',
          message: 'This web app currently supports teacher accounts only.'
        })
        return
      }

      storeSession(data.token, data.role)
      navigate('/teacher/dashboard', { replace: true })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error in logging in',
        message: error.message
      })
    } finally {
      setLoading(false)
    }
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
            <div className="app-name">Teacher Portal</div>
          </div>

          <section className="headline-block auth-headline">
            <h1>Welcome Back</h1>
            <p>A focused teacher workspace for QR attendance, session history, and class insights.</p>
          </section>

          <div className="auth-mini-stats">
            <div className="auth-mini-stat">
              <span>Teacher-first</span>
            </div>
            <div className="auth-mini-stat">
              <span>Session history</span>
            </div>
            <div className="auth-mini-stat">
              <span>Live sessions</span>
            </div>
          </div>

          <div className="auth-point-list">
            <div className="auth-point">
              <div className="auth-point-icon">
                <QrCode size={18} />
              </div>
              <div>
                <strong>Start QR sessions instantly</strong>
                <span>Open attendance in seconds without leaving your dashboard.</span>
              </div>
            </div>
            <div className="auth-point">
              <div className="auth-point-icon">
                <ChartNoAxesColumn size={18} />
              </div>
              <div>
                <strong>Review session performance</strong>
                <span>Check recent classes and detailed present or absent breakdowns.</span>
              </div>
            </div>
            <div className="auth-point">
              <div className="auth-point-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong>Secure teacher access</strong>
                <span>Sign in with your institution credentials and continue where you left off.</span>
              </div>
            </div>
          </div>

          <p className="support-copy">Need help? Contact your department or campus admin.</p>
        </section>

        <section className="auth-form-shell">
          <form className="page-card auth-card auth-card-hero" onSubmit={handleLogin}>
            <div className="auth-card-top">
              <h2>Sign In</h2>
              <p className="subtle-text">Enter your credentials to access the teacher dashboard.</p>
            </div>

            <label className="field-label" htmlFor="email">
              College Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@college.edu"
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
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="text-input"
              required
            />

            <button type="submit" className="primary-button auth-submit-button" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
