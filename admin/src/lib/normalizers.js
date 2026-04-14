function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function toArray(payload) {
  if (Array.isArray(payload)) return payload

  const candidates = [
    payload?.items,
    payload?.content,
    payload?.results,
    payload?.data,
    payload?.students,
    payload?.teachers,
    payload?.subjects,
    payload?.enrollments
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }

  return []
}

export function getItemValue(item, descriptor) {
  if (!item) return ''

  const keys =
    typeof descriptor === 'string'
      ? [descriptor]
      : [descriptor.key, ...(descriptor.aliases || [])].filter(Boolean)

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      return item[key]
    }
  }

  const normalizedEntries = new Map(Object.keys(item).map((key) => [slugify(key), key]))

  for (const key of keys) {
    const match = normalizedEntries.get(slugify(key))
    if (match) {
      return item[match]
    }
  }

  return ''
}

export function formatCellValue(value) {
  if (value === null || value === undefined || value === '') return '-'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

export function createEmptyDraft(fields) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = ''
    return accumulator
  }, {})
}

export function createDraftFromItem(fields, item) {
  return fields.reduce((accumulator, field) => {
    const resolved = getItemValue(item, { key: field.name, aliases: field.aliases })
    accumulator[field.name] = resolved === null || resolved === undefined ? '' : String(resolved)
    return accumulator
  }, {})
}

export function buildPayload(fields, draft) {
  return fields.reduce((accumulator, field) => {
    const rawValue = draft[field.name]

    if (rawValue === null || rawValue === undefined) {
      return accumulator
    }

    const trimmedValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue

    if (trimmedValue === '') {
      return accumulator
    }

    accumulator[field.name] = field.type === 'number' ? Number(trimmedValue) : trimmedValue

    return accumulator
  }, {})
}

export function filterRowsBySearch(rows, searchValue, columns) {
  const query = searchValue.trim().toLowerCase()

  if (!query) return rows

  return rows.filter((row) =>
    columns.some((column) => {
      const value = getItemValue(row, column)
      return String(value || '')
        .toLowerCase()
        .includes(query)
    })
  )
}

export function mapSpreadsheetRow(row, fields) {
  const normalizedEntries = new Map(
    Object.entries(row).map(([key, value]) => [slugify(key), value])
  )

  return fields.reduce((accumulator, field) => {
    const aliases = [field.name, ...(field.aliases || [])]

    for (const alias of aliases) {
      const matchedValue = normalizedEntries.get(slugify(alias))
      if (matchedValue !== undefined) {
        accumulator[field.name] = matchedValue
        break
      }
    }

    if (accumulator[field.name] === undefined) {
      accumulator[field.name] = ''
    }

    return accumulator
  }, {})
}

export function resolveMissingRequiredFields(fields, payload) {
  return fields
    .filter((field) => field.required)
    .filter((field) => {
      const value = payload[field.name]
      return value === null || value === undefined || String(value).trim() === ''
    })
    .map((field) => field.label)
}

export function getSpreadsheetColumns(fields) {
  return fields.map((field) => field.name)
}
