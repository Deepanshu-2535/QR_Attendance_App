import { BookOpenText, CheckCircle2, QrCode, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InfoPanelCard from '../components/InfoPanelCard'
import LoadingSpinner from '../components/LoadingSpinner'
import SessionCard from '../components/SessionCard'
import { ENDPOINTS } from '../constants/api'
import api from '../lib/apiClient'
import { useToast } from '../components/ToastProvider'

const initialTeacherDetails = {
  title: '',
  firstName: '',
  lastName: '',
  noOfSubjects: 0,
  totalStudents: 0,
  averageAttendancePercentage: 0,
  sessionHistory: []
}

export default function TeacherDashboardPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [teacherDetails, setTeacherDetails] = useState(initialTeacherDetails)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadTeacherDetails() {
      try {
        const data = await api.get(ENDPOINTS.TEACHER.DASHBOARD)
        if (isMounted) {
          setTeacherDetails(data)
        }
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Cannot load Teacher Details',
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

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <section className="page-section">
      <section className="dashboard-hero">
        <div className="headline-block dashboard-headline">
          <h1>Welcome,</h1>
          <p className="headline-strong">
            {teacherDetails.title} {teacherDetails.firstName} {teacherDetails.lastName}
          </p>
        </div>

        <div className="page-card dashboard-action-card">
          <span className="eyebrow-copy">Quick Action</span>
          <h2 className="card-title">Start a fresh attendance session</h2>
          <p className="subtle-text">
            Generate a live QR for your class and keep the attendance flow moving smoothly.
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/teacher/qrcode')}
          >
            <QrCode size={20} />
            <span>Generate QR</span>
          </button>
        </div>
      </section>

      <div className="stats-grid">
        <InfoPanelCard
          icon={<BookOpenText color="var(--color-primary)" size={24} />}
          value={teacherDetails.noOfSubjects}
          heading="Subjects"
        />
        <InfoPanelCard
          icon={<Users color="var(--color-primary)" size={24} />}
          value={teacherDetails.totalStudents}
          heading="Total Students"
        />
        <InfoPanelCard
          icon={<CheckCircle2 color="var(--color-primary)" size={24} />}
          value={`${teacherDetails.averageAttendancePercentage}%`}
          heading="Average Attendance"
        />
      </div>

      <section className="section-stack">
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">Recent Sessions</h2>
            <p className="subtle-text">Quick view of your latest attendance sessions.</p>
          </div>
        </div>
        <div className="session-list">
          {teacherDetails.sessionHistory.length > 0 ? (
            teacherDetails.sessionHistory.map((session) => (
              <SessionCard
                key={session.sessionId}
                sessionId={session.sessionId}
                subjectName={session.subjectName}
                sessionDate={session.sessionDate}
                present={session.noOfStudentsPresent}
                absent={session.totalNoOfStudents - session.noOfStudentsPresent}
              />
            ))
          ) : (
            <div className="page-card empty-card">No recent sessions yet.</div>
          )}
        </div>
      </section>
    </section>
  )
}
