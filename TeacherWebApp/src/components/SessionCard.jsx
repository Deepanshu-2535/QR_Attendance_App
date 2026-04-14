import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SessionCard({ sessionId, subjectName, sessionDate, present, absent }) {
  const navigate = useNavigate()
  const total = present + absent
  const presentPercent = total > 0 ? (present / total) * 100 : 0
  const absentPercent = total > 0 ? (absent / total) * 100 : 0

  return (
    <button
      type="button"
      className="session-card"
      onClick={() => navigate(`/teacher/session/${sessionId}`)}
    >
      <div className="session-card-header">
        <div>
          <h3>{subjectName}</h3>
          <p>{sessionDate}</p>
        </div>
        <div className="session-card-right">
          <ChevronRight size={18} />
        </div>
      </div>
      <div className="session-card-stats">
        <div className="session-stat-pill">
          <span className="session-dot session-dot-success" />
          <span>{present} Present</span>
        </div>
        <div className="session-stat-pill session-stat-pill-danger">
          <span className="session-dot session-dot-danger" />
          <span>{absent} Absent</span>
        </div>
      </div>
      <div className="session-progress-track">
        <div className="session-progress-present" style={{ width: `${presentPercent}%` }} />
        <div className="session-progress-absent" style={{ width: `${absentPercent}%` }} />
      </div>
    </button>
  )
}
