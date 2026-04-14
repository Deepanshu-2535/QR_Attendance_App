import axios from 'axios'
import { BASE_URL } from '../constants/api'
import { getStoredToken } from './storage'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    if (response.status === 204) return null
    return response.data
  },
  (error) => {
    const message =
      error.response?.data?.message || `HTTP ${error.response?.status || 'Error'}`
    const resolvedError = new Error(message)
    resolvedError.status = error.response?.status
    return Promise.reject(resolvedError)
  }
)

export default api
