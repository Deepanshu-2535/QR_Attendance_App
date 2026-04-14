export const AUTH_TOKEN_KEY = 'adminAuthToken'
export const USER_ROLE_KEY = 'adminUserRole'

export function getStoredToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredRole() {
  return window.localStorage.getItem(USER_ROLE_KEY)
}

export function storeSession(token, role) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  window.localStorage.setItem(USER_ROLE_KEY, role)
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
  window.localStorage.removeItem(USER_ROLE_KEY)
}
