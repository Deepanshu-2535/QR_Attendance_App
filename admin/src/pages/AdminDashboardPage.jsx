import {
  BookOpenText,
  GraduationCap,
  RefreshCw,
  Upload,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import MetricCard from '../components/MetricCard'
import { useToast } from '../components/ToastProvider'
import { adminService } from '../lib/adminService'

const initialCounts = {
  students: 0,
  teachers: 0,
  subjects: 0
}

export default function AdminDashboardPage() {
  const { showToast } = useToast()
  const [counts, setCounts] = useState(initialCounts)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function loadOverview() {
    try {
      const [students, teachers, subjects] = await Promise.all([
        adminService.students.list(),
        adminService.teachers.list(),
        adminService.subjects.list()
      ])

      const nextCounts = {
        students: students.length,
        teachers: teachers.length,
        subjects: subjects.length
      }

      setCounts(nextCounts)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Cannot load admin overview',
        message: error.message
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOverview()
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await loadOverview()
  }

  if (loading) {
    return <LoadingSpinner message="Loading admin overview..." />
  }

  return (
    <section className="page-section">
      <section className="dashboard-hero">
        <div className="headline-block dashboard-headline">
          <span className="eyebrow-copy">Admin Overview</span>
          <h1>Keep the attendance system in sync.</h1>
          <p>
            Monitor the academic registry, manage core entities, and move large roster updates
            through spreadsheet imports without breaking the visual language of the rest of the
            platform.
          </p>
        </div>

        <div className="page-card dashboard-action-card">
          <span className="eyebrow-copy">Quick Action</span>
          <h2 className="card-title">Refresh live registry counts</h2>
          <p className="subtle-text">
            Pull the latest student, teacher, and subject counts from the backend.
          </p>
          <button type="button" className="primary-button" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={20} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Overview'}</span>
          </button>
        </div>
      </section>

      <div className="overview-grid">
        <MetricCard
          icon={<GraduationCap color="var(--color-primary)" size={24} />}
          value={counts.students}
          heading="Students"
          supportingCopy="Student records available for attendance and enrollment."
        />
        <MetricCard
          icon={<Users color="var(--color-primary)" size={24} />}
          value={counts.teachers}
          heading="Teachers"
          supportingCopy="Faculty accounts connected to teaching and session control."
        />
        <MetricCard
          icon={<BookOpenText color="var(--color-primary)" size={24} />}
          value={counts.subjects}
          heading="Subjects"
          supportingCopy="Subject catalog entries currently active in the system."
        />
      </div>

      <div className="split-layout">
        <section className="page-card section-stack">
          <div className="section-heading-row">
            <div>
              <h2 className="section-title">Admin Workflows</h2>
              <p className="subtle-text">Jump into the most common maintenance flows.</p>
            </div>
          </div>

          <div className="action-card-grid">
            <Link to="/admin/students" className="action-link-card">
              <GraduationCap size={20} />
              <div>
                <strong>Manage Students</strong>
                <span>Create, edit, and clean up student records.</span>
              </div>
            </Link>
            <Link to="/admin/teachers" className="action-link-card">
              <Users size={20} />
              <div>
                <strong>Manage Teachers</strong>
                <span>Keep faculty identities and departments current.</span>
              </div>
            </Link>
            <Link to="/admin/subjects" className="action-link-card">
              <BookOpenText size={20} />
              <div>
                <strong>Manage Subjects</strong>
                <span>Maintain subject codes and teacher assignments.</span>
              </div>
            </Link>
            <Link to="/admin/bulk-upload" className="action-link-card">
              <Upload size={20} />
              <div>
                <strong>Bulk Upload</strong>
                <span>Import CSV or Excel files with preview and validation.</span>
              </div>
            </Link>
          </div>
        </section>

        <aside className="page-card page-note">
          <h2 className="section-title">API Readiness</h2>
          <p className="subtle-text">
            The panel already works with your planned student, teacher, subject, and enrollment
            mutation endpoints.
          </p>
          <div className="status-banner">
            <strong>Recommended next addition</strong>
            <span>
              Add <code>GET /api/v1/admin/enrollments</code> so admins can browse and remove
              enrollments without manually entering IDs.
            </span>
          </div>
          <div className="status-banner">
            <strong>Bulk upload note</strong>
            <span>
              Current uploads call the create or update endpoints row-by-row. Dedicated bulk
              endpoints would make large imports much faster and more reliable.
            </span>
          </div>
        </aside>
      </div>
    </section>
  )
}
