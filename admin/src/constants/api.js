const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL

export const BASE_URL =
  configuredBaseUrl ||
  (import.meta.env.DEV ? '' : 'https://projecttempbackend-production.up.railway.app')

export const ENDPOINTS = {
  AUTH: '/api/v1/auth',
  ADMIN: {
    STUDENTS: '/api/v1/admin/students',
    STUDENT: (rollNo) => `/api/v1/admin/students/${encodeURIComponent(rollNo)}`,
    TEACHERS: '/api/v1/admin/teachers',
    TEACHER: (teacherId) => `/api/v1/admin/teachers/${encodeURIComponent(teacherId)}`,
    SUBJECTS: '/api/v1/admin/subjects',
    SUBJECT: (subjectCode) => `/api/v1/admin/subjects/${encodeURIComponent(subjectCode)}`,
    ENROLLMENTS: '/api/v1/admin/enrollments',
    ENROLLMENT: (id) => `/api/v1/admin/enrollments/${encodeURIComponent(id)}`
  }
}
