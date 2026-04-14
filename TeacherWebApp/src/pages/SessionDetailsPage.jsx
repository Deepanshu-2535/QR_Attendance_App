import { ArrowLeft, CalendarDays, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CircularProgress from '../components/CircularProgress'
import Divider from '../components/Divider'
import LoadingSpinner from '../components/LoadingSpinner'
import { ENDPOINTS } from '../constants/api'
import api from '../lib/apiClient'
import { useToast } from '../components/ToastProvider'

const initialDetails = {
  subjectCode: '',
  subjectName: '',
  sessionDate: '',
  totalNoOfStudents: 0,
  noOfStudentsPresent: 0,
  attendances: []
}

export default function SessionDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [sessionDetailedAttendance, setSessionDetailedAttendance] = useState(initialDetails)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadSessionDetailedAttendance() {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        const data = await api.get(ENDPOINTS.TEACHER.SESSIONS.DETAILS(id))
        if (isMounted) {
          setSessionDetailedAttendance(data)
        }
      } catch (error) {
        if (!isMounted) return
        showToast({
          type: 'error',
          title: 'Cannot load details',
          message: error.message
        })
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSessionDetailedAttendance()

    return () => {
      isMounted = false
    }
  }, [id, showToast])

  const percentage =
    sessionDetailedAttendance.totalNoOfStudents > 0
      ? (sessionDetailedAttendance.noOfStudentsPresent /
          sessionDetailedAttendance.totalNoOfStudents) *
        100
      : 0

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="standalone-shell">
      <div className="page-accent page-accent-top" />
      <div className="page-accent page-accent-bottom" />

      <div className="standalone-content">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <section className="standalone-hero details-hero">
          <div className="standalone-hero-copy">
            <span className="eyebrow-copy">Session Details</span>
            <h1>{sessionDetailedAttendance.subjectName}</h1>
            <p>
              Review the attendance breakdown for this class session, including present and absent
              counts for each student.
            </p>
          </div>
          <div className="standalone-hero-meta">
            <div className="standalone-meta-item">
              <CalendarDays size={18} />
              <div>
                <span>Date</span>
                <strong>{sessionDetailedAttendance.sessionDate}</strong>
              </div>
            </div>
            <div className="standalone-meta-item">
              <Users size={18} />
              <div>
                <span>Total Students</span>
                <strong>{sessionDetailedAttendance.totalNoOfStudents}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="details-layout">
          <div className="page-card details-card">
            <div className="details-card-header">
              <div className="details-copy">
                <h2 className="card-title">Attendance Summary</h2>
                <div className="details-meta">
                  <p>{sessionDetailedAttendance.subjectCode || 'Subject session overview'}</p>
                </div>
              </div>
              <CircularProgress size={104} fill={percentage} />
            </div>

            <Divider margin={12} />

            <div className="details-stats">
              <div className="details-stat-row">
                <span>Present</span>
                <strong className="success-copy">{sessionDetailedAttendance.noOfStudentsPresent}</strong>
              </div>
              <Divider vertical margin={10} />
              <div className="details-stat-row">
                <span>Absent</span>
                <strong className="danger-copy">
                  {sessionDetailedAttendance.totalNoOfStudents -
                    sessionDetailedAttendance.noOfStudentsPresent}
                </strong>
              </div>
            </div>
          </div>

          <div className="page-card attendance-list-card">
            <div className="standalone-section-header">
              <div>
                <h2 className="section-title">Attendance</h2>
                <p className="subtle-text">Student-wise status for this session.</p>
              </div>
            </div>
            {sessionDetailedAttendance.attendances.length > 0 ? (
              sessionDetailedAttendance.attendances.map((attendance, index) => (
                <div key={attendance.rollNo}>
                  <div className="attendance-row">
                    <span>
                      {attendance.rollNo}. {attendance.studentName}
                    </span>
                    <strong
                      className={
                        attendance.attendanceStatus === 'PRESENT'
                          ? 'success-copy'
                          : 'danger-copy'
                      }
                    >
                      {attendance.attendanceStatus}
                    </strong>
                  </div>
                  {index < sessionDetailedAttendance.attendances.length - 1 ? (
                    <Divider margin={10} />
                  ) : null}
                </div>
              ))
            ) : (
              <p className="subtle-text">No attendance records found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
