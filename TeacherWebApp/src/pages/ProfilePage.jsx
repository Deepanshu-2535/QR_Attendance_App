import { ChevronRight, Info, LockKeyhole, UserRoundPen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Divider from '../components/Divider'
import LoadingSpinner from '../components/LoadingSpinner'
import { ENDPOINTS } from '../constants/api'
import api from '../lib/apiClient'
import { clearSession } from '../lib/storage'
import { useToast } from '../components/ToastProvider'

const initialProfile = {
  teacherId: '',
  title: '',
  firstName: '',
  lastName: '',
  designation: '',
  department: ''
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [teacherDetails, setTeacherDetails] = useState(initialProfile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadTeacherDetails() {
      try {
        const data = await api.get(ENDPOINTS.TEACHER.PROFILE)
        if (isMounted) {
          setTeacherDetails(data)
        }
      } catch (error) {
        if (!isMounted) return
        showToast({
          type: 'error',
          title: 'Cannot load profile',
          message: error.message
        })
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTeacherDetails()

    return () => {
      isMounted = false
    }
  }, [showToast])

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <section className="page-section">
      <div className="profile-layout">
        <div className="profile-main">
          <div className="profile-hero profile-hero-card">
            <div className="profile-avatar">
              <UserRoundPen size={40} color="var(--color-muted)" />
            </div>
            <span className="eyebrow-copy">Teacher Profile</span>
            <h1>
              {teacherDetails.firstName} {teacherDetails.lastName}
            </h1>
          </div>

          <div className="page-card">
            <div>
              <h2 className="card-title">Department</h2>
              <p className="subtle-text strong-copy">{teacherDetails.department}</p>
            </div>
            <Divider margin={10} />
            <div className="profile-details-grid">
              <div>
                <span className="field-label static-label">Designation</span>
                <p className="subtle-text strong-copy">{teacherDetails.designation}</p>
              </div>
              <Divider vertical margin={10} />
              <div className="profile-id-row">
                <span className="field-label static-label">Teacher ID</span>
                <p className="subtle-text strong-copy">{teacherDetails.teacherId}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="profile-side">
          <div className="page-card">
            <h2 className="section-title">Settings</h2>
            <div className="settings-list">
              <button
                type="button"
                className="settings-row"
                onClick={() => navigate('/change-password')}
              >
                <span className="settings-row-left">
                  <LockKeyhole size={20} />
                  <span>Change Password</span>
                </span>
                <ChevronRight size={20} />
              </button>
              <Divider margin={12} />
              <button type="button" className="settings-row" onClick={() => navigate('/about')}>
                <span className="settings-row-left">
                  <Info size={20} />
                  <span>About App</span>
                </span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <button type="button" className="danger-button profile-logout" onClick={handleLogout}>
            Logout
          </button>
        </aside>
      </div>
    </section>
  )
}
