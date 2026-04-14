import { Check, ChevronDown, GraduationCap } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import Divider from '../components/Divider'
import LoadingSpinner from '../components/LoadingSpinner'
import { ENDPOINTS } from '../constants/api'
import api from '../lib/apiClient'
import { useToast } from '../components/ToastProvider'

export default function QRCodePage() {
  const { showToast } = useToast()
  const [subjects, setSubjects] = useState([])
  const [subjectsLoading, setSubjectsLoading] = useState(true)
  const [subjectsError, setSubjectsError] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [showQr, setShowQr] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [token, setToken] = useState('')
  const [tokenLoading, setTokenLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false)
  const [teacherDetails, setTeacherDetails] = useState({
    firstName: '',
    lastName: '',
    teacherId: ''
  })
  const [teacherId, setTeacherId] = useState('')
  const tokenTimerRef = useRef(null)
  const subjectMenuRef = useRef(null)

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.subjectCode === selectedId),
    [selectedId, subjects]
  )

  useEffect(() => {
    let isMounted = true

    async function loadSubjects() {
      setSubjectsLoading(true)
      setSubjectsError('')

      try {
        const data = await api.get(ENDPOINTS.TEACHER.SUBJECTS)
        if (!isMounted) return
        setSubjects(data)
        setSelectedId(data[0]?.subjectCode || '')
      } catch (error) {
        if (!isMounted) return
        setSubjectsError(error.message || 'Failed to load subjects')
        showToast({
          type: 'error',
          title: 'Cannot load subjects',
          message: error.message
        })
      } finally {
        if (isMounted) {
          setSubjectsLoading(false)
        }
      }
    }

    async function loadTeacherProfile() {
      try {
        const data = await api.get(ENDPOINTS.TEACHER.PROFILE)
        if (!isMounted || !data) return

        const resolvedTeacherId = data.teacherId
        setTeacherDetails({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          teacherId: resolvedTeacherId || ''
        })
        setTeacherId(resolvedTeacherId || '')
      } catch (error) {
        if (!isMounted) return
        showToast({
          type: 'error',
          title: 'Cannot load Teacher',
          message: error.message
        })
      }
    }

    loadSubjects()
    loadTeacherProfile()

    return () => {
      isMounted = false
      if (tokenTimerRef.current) {
        window.clearInterval(tokenTimerRef.current)
      }
    }
  }, [showToast])

  useEffect(() => {
    function handlePointerDown(event) {
      if (subjectMenuRef.current && !subjectMenuRef.current.contains(event.target)) {
        setIsSubjectMenuOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsSubjectMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  async function fetchToken(id) {
    setTokenLoading(true)

    try {
      const data = await api.get(ENDPOINTS.TEACHER.SESSIONS.TOKEN(id))
      setToken(data.token)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Cannot fetch token',
        message: error.message
      })
      setToken('')
    } finally {
      setTokenLoading(false)
    }
  }

  async function startSession() {
    if (!selectedId || actionLoading) return

    setActionLoading(true)

    try {
      if (!teacherId) {
        setShowQr(false)
        return
      }

      const data = await api.post(ENDPOINTS.TEACHER.SESSIONS.START, {
        teacherId,
        subjectCode: selectedId
      })

      const id = data.sessionId

      if (!id) {
        setShowQr(false)
        return
      }

      setSessionId(id)
      setShowQr(true)
      await fetchToken(id)

      if (tokenTimerRef.current) {
        window.clearInterval(tokenTimerRef.current)
      }

      tokenTimerRef.current = window.setInterval(() => {
        fetchToken(id)
      }, 10000)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Cannot Start Session',
        message: error.message
      })
      setShowQr(false)
    } finally {
      setActionLoading(false)
    }
  }

  async function stopSession() {
    if (!sessionId || actionLoading) return

    setActionLoading(true)

    try {
      await api.patch(ENDPOINTS.TEACHER.SESSIONS.STOP(sessionId))
    } catch {
    } finally {
      if (tokenTimerRef.current) {
        window.clearInterval(tokenTimerRef.current)
      }
      tokenTimerRef.current = null
      setToken('')
      setSessionId('')
      setShowQr(false)
      setActionLoading(false)
    }
  }

  async function handleSubjectChange(nextValue) {
    if (sessionId) {
      await stopSession()
    }
    setSelectedId(nextValue)
    setIsSubjectMenuOpen(false)
  }

  return (
    <section className="page-section">
      <div className="headline-block">
        <h1>QR Code</h1>
        <p>Pick a subject to generate a QR for attendance.</p>
      </div>

      <div className="qr-layout">
        <div className="page-card qr-control-card">
          <h2 className="card-title">Subject</h2>
          <p className="subtle-text">Choose the class you want to open for attendance.</p>
          {subjectsLoading ? (
            <div className="inline-status">
              <LoadingSpinner fullScreen={false} showMessage={false} small />
              <span>Loading subjects...</span>
            </div>
          ) : null}
          {subjectsError ? <p className="error-copy">{subjectsError}</p> : null}

          <div className="select-shell" ref={subjectMenuRef}>
            <div className="select-control">
              <div className="select-input-shell">
                <div className="select-input-icon">
                  <GraduationCap size={18} />
                </div>
                <button
                  type="button"
                  className="select-input select-trigger-button"
                  onClick={() => setIsSubjectMenuOpen((current) => !current)}
                  disabled={subjects.length === 0 || actionLoading}
                  aria-haspopup="listbox"
                  aria-expanded={isSubjectMenuOpen}
                >
                  <span className="select-trigger-copy">
                    {selectedSubject
                      ? `${selectedSubject.subjectName} (${selectedSubject.subjectCode})`
                      : 'No subjects available'}
                  </span>
                </button>
                <div
                  className={
                    isSubjectMenuOpen
                      ? 'select-input-chevron select-input-chevron-open'
                      : 'select-input-chevron'
                  }
                >
                  <ChevronDown size={18} />
                </div>
              </div>
              {isSubjectMenuOpen ? (
                <div className="select-menu" role="listbox" aria-label="Subjects">
                  {subjects.map((subject) => {
                    const isActive = subject.subjectCode === selectedId

                    return (
                      <button
                        key={subject.subjectCode}
                        type="button"
                        className={isActive ? 'select-menu-item select-menu-item-active' : 'select-menu-item'}
                        onClick={() => {
                          void handleSubjectChange(subject.subjectCode)
                        }}
                      >
                        <span className="select-menu-item-copy">
                          <strong>{subject.subjectName}</strong>
                          <span>{subject.subjectCode}</span>
                        </span>
                        {isActive ? <Check size={16} /> : null}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
            {selectedSubject ? (
              <div className="select-helper-text">
                {selectedSubject.subjectName} · {selectedSubject.subjectCode}
              </div>
            ) : null}
          </div>

          <Divider margin={12} />

          {showQr ? (
            <button
              type="button"
              onClick={() => {
                void stopSession()
              }}
              className="danger-button"
              disabled={actionLoading}
            >
              {actionLoading ? 'Stopping...' : 'Stop QR'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                void startSession()
              }}
              className="primary-button"
              disabled={!selectedSubject || subjectsLoading || actionLoading}
            >
              {actionLoading ? 'Starting...' : 'Show QR'}
            </button>
          )}
        </div>

        <div className="page-card qr-display-card">
          <h2 className="card-title">Active QR</h2>
          <div className="qr-frame">
            {showQr && token ? (
              <div className="qr-code-wrap">
                <QRCode
                  value={token}
                  fgColor="var(--color-text)"
                  bgColor="transparent"
                  style={{ width: '100%', height: 'auto', maxWidth: '280px' }}
                />
              </div>
            ) : tokenLoading ? (
              <LoadingSpinner fullScreen={false} showMessage={false} small />
            ) : (
              <p className="subtle-text">
                {selectedSubject ? 'Tap Show QR' : 'Select a subject'}
              </p>
            )}
          </div>

          <Divider margin={14} />

          <div className="key-value-row">
            <span>Teacher</span>
            <strong>
              {teacherDetails.firstName || teacherDetails.lastName
                ? `${teacherDetails.firstName} ${teacherDetails.lastName}`.trim()
                : '-'}
            </strong>
          </div>
          <div className="key-value-row">
            <span>Teacher ID</span>
            <strong>{teacherDetails.teacherId || '-'}</strong>
          </div>
          <div className="key-value-row">
            <span>Subject</span>
            <strong>{selectedSubject ? selectedSubject.subjectName : '-'}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
