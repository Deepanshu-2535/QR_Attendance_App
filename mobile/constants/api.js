export const BASE_URL = 'https://projecttempbackend-production-dc3a.up.railway.app'
export const ENDPOINTS = {
  AUTH: '/api/v1/auth',
  STUDENT: {
    OVERVIEW: '/api/v1/student/attendance/overview',
    SUBJECT: (code) => `/api/v1/student/attendance/subject/${code}`,
    SCAN: '/api/v1/student/attendance/scan',
    PROFILE: '/api/v1/student/profile',
  },
  TEACHER: {
    DASHBOARD: '/api/v1/teacher/dashboard',
    SUBJECTS: '/api/v1/teacher/subjects',
    SESSIONS: {
      START: '/api/v1/teacher/sessions/start',
      STOP: (id) => `/api/v1/teacher/sessions/${id}/stop`,
      TOKEN: (id) => `/api/v1/teacher/sessions/${id}/token`,
      DETAILS: (id) => `/api/v1/teacher/sessions/${id}/details`,
    },
    PROFILE: '/api/v1/teacher/profile',
  },
}
