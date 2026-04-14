import { ArrowLeft, BadgeInfo, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Divider from '../components/Divider'

const cards = [
  {
    title: 'What It Does',
    copy:
      'QR Attendance helps students and faculty track class attendance quickly and accurately.'
  },
  {
    title: 'Key Features',
    copy:
      'Fast check-in, clean dashboards, and subject summaries that help you stay on top of your semester.'
  },
  {
    title: 'Data & Privacy',
    copy:
      'Attendance data is stored securely within the app and is only used for your academic tracking.'
  },
  {
    title: 'Support',
    copy: 'For help, contact your department or the campus admin team.'
  },
  {
    title: 'Version',
    copy: '1.0.0'
  }
]

export default function AboutPage() {
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

        <section className="standalone-hero about-hero">
          <div className="standalone-hero-copy">
            <span className="eyebrow-copy">About</span>
            <h1>About App</h1>
            <p>
              QR Attendance helps students and faculty track class attendance quickly and
              accurately.
            </p>
          </div>
          <div className="standalone-hero-meta about-hero-meta">
            <div className="standalone-meta-item">
              <Sparkles size={18} />
              <div>
                <span>Product</span>
                <strong>QR Attendance</strong>
              </div>
            </div>
            <div className="standalone-meta-item">
              <ShieldCheck size={18} />
              <div>
                <span>Version</span>
                <strong>1.0.0</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="about-layout">
          <div className="about-grid">
            {cards.map((card) => (
              <div key={card.title} className="page-card about-card">
                <div className="about-card-icon">
                  <BadgeInfo size={18} />
                </div>
                <h2 className="card-title">{card.title}</h2>
                <p className="subtle-text">{card.copy}</p>
              </div>
            ))}
          </div>

          <aside className="page-card about-side-card">
            <h2 className="section-title">Why It Exists</h2>
            <p className="subtle-text">
              The web app gives teachers a cleaner desktop workspace for running attendance
              sessions, checking results, and reviewing historical data without relying on a
              phone-sized UI.
            </p>
            <Divider margin={12} />
            <div className="about-side-points">
              <div className="about-side-point">
                <strong>Fast workflows</strong>
                <span>Launch a class session and share a QR with minimal friction.</span>
              </div>
              <div className="about-side-point">
                <strong>Clear reporting</strong>
                <span>See attendance outcomes and detailed student status in one place.</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
