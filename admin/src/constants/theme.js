export const colors = {
  primary: '#2F80ED',
  success: '#2E8B57',
  danger: '#D94F4F',
  background: '#f2f2f7',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  border: '#e5e7eb'
}

export const withOpacity = (hex, opacity) => {
  const raw = hex.replace('#', '')
  const normalized =
    raw.length === 3
      ? raw
          .split('')
          .map((char) => char + char)
          .join('')
      : raw

  const value = Number.parseInt(normalized, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}
