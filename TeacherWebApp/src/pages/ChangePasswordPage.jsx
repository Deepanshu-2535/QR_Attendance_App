import { ArrowLeft, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ChangePasswordPage() {
  const navigate = useNavigate()

  return (
    <div className="standalone-shell">
      <div className="page-accent page-accent-top" />
      <div className="page-accent page-accent-bottom" />

      <div className="standalone-content">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <section className="standalone-hero password-hero">
          <div className="standalone-hero-copy">
            <span className="eyebrow-copy">Security</span>
            <h1>Change Password</h1>
            <p>Update your account password to keep your profile secure.</p>
          </div>
          <div className="standalone-hero-meta">
            <div className="standalone-meta-item">
              <ShieldCheck size={18} />
              <div>
                <span>Account Safety</span>
                <strong>Protected access</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="password-layout">
          <div className="page-card password-form-card">
            <div className="page-card-header">
              <LockKeyhole size={22} color="var(--color-muted)" />
              <h2 className="card-title">Password Details</h2>
            </div>

            <label className="field-label" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              className="text-input"
            />

            <label className="field-label" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              className="text-input"
            />

            <label className="field-label" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              className="text-input"
            />

            <button type="button" className="primary-button password-submit-button">
              Update Password
            </button>
          </div>

          <aside className="page-card password-side-card">
            <div className="page-card-header">
              <KeyRound size={22} color="var(--color-muted)" />
              <h2 className="card-title">Password Tips</h2>
            </div>
            <div className="password-tip-list">
              <div className="password-tip">
                <strong>Use at least 8 characters</strong>
                <span>Longer passwords are harder to guess and easier to keep secure.</span>
              </div>
              <div className="password-tip">
                <strong>Mix letters and numbers</strong>
                <span>Use a combination that is memorable for you but difficult for others.</span>
              </div>
              <div className="password-tip">
                <strong>Avoid reusing passwords</strong>
                <span>Keep this account separate from personal or unrelated logins.</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
