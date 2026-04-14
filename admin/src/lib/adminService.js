import { ENDPOINTS } from '../constants/api'
import api from './apiClient'
import { toArray } from './normalizers'

async function loadList(endpoint) {
  const data = await api.get(endpoint)
  return toArray(data)
}

export const adminService = {
  students: {
    list: () => loadList(ENDPOINTS.ADMIN.STUDENTS),
    create: (payload) => api.post(ENDPOINTS.ADMIN.STUDENTS, payload),
    update: (rollNo, payload) => api.put(ENDPOINTS.ADMIN.STUDENT(rollNo), payload),
    remove: (rollNo) => api.delete(ENDPOINTS.ADMIN.STUDENT(rollNo))
  },
  teachers: {
    list: () => loadList(ENDPOINTS.ADMIN.TEACHERS),
    create: (payload) => api.post(ENDPOINTS.ADMIN.TEACHERS, payload),
    update: (teacherId, payload) => api.put(ENDPOINTS.ADMIN.TEACHER(teacherId), payload),
    remove: (teacherId) => api.delete(ENDPOINTS.ADMIN.TEACHER(teacherId))
  },
  subjects: {
    list: () => loadList(ENDPOINTS.ADMIN.SUBJECTS),
    create: (payload) => api.post(ENDPOINTS.ADMIN.SUBJECTS, payload),
    update: (subjectCode, payload) => api.put(ENDPOINTS.ADMIN.SUBJECT(subjectCode), payload),
    remove: (subjectCode) => api.delete(ENDPOINTS.ADMIN.SUBJECT(subjectCode))
  },
  enrollments: {
    list: () => loadList(ENDPOINTS.ADMIN.ENROLLMENTS),
    create: (payload) => api.post(ENDPOINTS.ADMIN.ENROLLMENTS, payload),
    remove: (id) => api.delete(ENDPOINTS.ADMIN.ENROLLMENT(id))
  }
}
