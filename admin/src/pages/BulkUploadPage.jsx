import { FileSpreadsheet, UploadCloud } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BULK_UPLOAD_RESOURCES, RESOURCE_DEFINITIONS } from '../constants/adminResources'
import { useToast } from '../components/ToastProvider'
import { adminService } from '../lib/adminService'
import {
  buildPayload,
  formatCellValue,
  getSpreadsheetColumns,
  mapSpreadsheetRow,
  resolveMissingRequiredFields
} from '../lib/normalizers'

const modeLabels = {
  create: 'Create new records',
  update: 'Update existing records'
}

export default function BulkUploadPage() {
  const { showToast } = useToast()
  const [resourceKey, setResourceKey] = useState('students')
  const [mode, setMode] = useState('create')
  const [fileName, setFileName] = useState('')
  const [parsedRows, setParsedRows] = useState([])
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const resource = RESOURCE_DEFINITIONS[resourceKey]
  const service = adminService[resourceKey]

  useEffect(() => {
    if (!resource.bulkModes.includes(mode)) {
      setMode(resource.bulkModes[0])
    }
  }, [resourceKey, mode, resource.bulkModes])

  const previewRows = useMemo(() => parsedRows.slice(0, 8), [parsedRows])
  const expectedColumns = useMemo(() => getSpreadsheetColumns(resource.fields), [resource.fields])

  async function handleFileSelected(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const xlsx = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const workbook = xlsx.read(buffer, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = xlsx.utils.sheet_to_json(firstSheet, { defval: '' })

      if (!rows.length) {
        showToast({
          type: 'error',
          title: 'Empty file',
          message: 'The selected spreadsheet does not contain any data rows.'
        })
        setParsedRows([])
        setFileName(file.name)
        setResult(null)
        return
      }

      const mappedRows = rows.map((row, index) => {
        const mappedDraft = mapSpreadsheetRow(row, resource.fields)
        const payload = buildPayload(resource.fields, mappedDraft)

        return {
          lineNumber: index + 2,
          payload,
          missingRequired: resolveMissingRequiredFields(resource.fields, payload)
        }
      })

      setParsedRows(mappedRows)
      setFileName(file.name)
      setResult(null)

      showToast({
        type: 'info',
        title: 'Spreadsheet parsed',
        message: `${mappedRows.length} row(s) are ready for preview.`
      })
    } catch (error) {
      setParsedRows([])
      setResult(null)
      showToast({
        type: 'error',
        title: 'Cannot read spreadsheet',
        message: error.message
      })
    }
  }

  async function handleImport() {
    if (!parsedRows.length) {
      showToast({
        type: 'error',
        title: 'No rows loaded',
        message: 'Upload a CSV or Excel file before starting the import.'
      })
      return
    }

    setUploading(true)

    const summary = {
      total: parsedRows.length,
      successCount: 0,
      errorCount: 0,
      errors: []
    }

    try {
      for (const row of parsedRows) {
        if (row.missingRequired.length) {
          summary.errorCount += 1
          summary.errors.push(`Row ${row.lineNumber}: missing ${row.missingRequired.join(', ')}`)
          continue
        }

        try {
          if (mode === 'update') {
            const idValue = row.payload[resource.idKey]
            await service.update(idValue, row.payload)
          } else {
            await service.create(row.payload)
          }

          summary.successCount += 1
        } catch (error) {
          summary.errorCount += 1
          summary.errors.push(`Row ${row.lineNumber}: ${error.message}`)
        }
      }

      setResult(summary)
      showToast({
        type: summary.errorCount ? 'error' : 'info',
        title: summary.errorCount ? 'Import finished with issues' : 'Import finished',
        message: `${summary.successCount} row(s) succeeded, ${summary.errorCount} row(s) failed.`
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="page-section">
      <section className="standalone-hero">
        <div className="standalone-hero-copy">
          <span className="eyebrow-copy">Bulk Upload</span>
          <h1>Import CSV and Excel files</h1>
          <p>
            Load spreadsheets for students, teachers, subjects, or enrollments, preview the parsed
            rows, then send them through your current admin APIs.
          </p>
        </div>
        <div className="standalone-hero-meta">
          <div className="standalone-meta-item">
            <div>
              <span>Accepted Files</span>
              <strong>.csv .xls .xlsx</strong>
            </div>
          </div>
          <div className="standalone-meta-item">
            <div>
              <span>Import Strategy</span>
              <strong>Row-by-row API sync</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="split-layout">
        <section className="page-card section-stack">
          <div className="section-heading-row">
            <div>
              <h2 className="section-title">Upload Settings</h2>
              <p className="subtle-text">Choose the resource type, decide whether you are creating or updating, then upload one sheet.</p>
            </div>
          </div>

          <div className="resource-form-grid">
            <label className="form-field">
              <span className="field-label static-label">Resource Type</span>
              <select
                className="select-input"
                value={resourceKey}
                onChange={(event) => setResourceKey(event.target.value)}
              >
                {BULK_UPLOAD_RESOURCES.map((key) => (
                  <option key={key} value={key}>
                    {RESOURCE_DEFINITIONS[key].label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span className="field-label static-label">Mode</span>
              <select
                className="select-input"
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                {resource.bulkModes.map((value) => (
                  <option key={value} value={value}>
                    {modeLabels[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="upload-dropzone">
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              className="visually-hidden"
              onChange={handleFileSelected}
            />
            <UploadCloud size={26} />
            <strong>{fileName || 'Choose a spreadsheet file'}</strong>
            <span>Only the first worksheet is read. Header names are matched loosely, so `roll_no` and `rollNo` both work.</span>
          </label>

          <div className="upload-stats">
            <div className="upload-stat-card">
              <span>Expected Columns</span>
              <strong>{expectedColumns.join(', ')}</strong>
            </div>
            <div className="upload-stat-card">
              <span>Rows Parsed</span>
              <strong>{parsedRows.length}</strong>
            </div>
          </div>
        </section>

        <aside className="page-card section-stack">
          <div>
            <h2 className="section-title">Import Notes</h2>
            <p className="subtle-text">
              This uploader already supports your current endpoints, but it uses one request per
              row. That is reliable for modest files and a good bridge until dedicated bulk APIs exist.
            </p>
          </div>

          <div className="status-banner">
            <strong>Recommended backend addition</strong>
            <span>
              Add endpoints like <code>POST /api/v1/admin/{'{resource}'}/bulk</code> for larger
              imports, validation summaries, and transaction-safe processing.
            </span>
          </div>

          <button
            type="button"
            className="primary-button primary-button-inline"
            onClick={handleImport}
            disabled={uploading || !parsedRows.length}
          >
            <FileSpreadsheet size={18} />
            <span>{uploading ? 'Importing...' : `Start ${modeLabels[mode]}`}</span>
          </button>
        </aside>
      </div>

      <section className="page-card section-stack">
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">Preview</h2>
            <p className="subtle-text">The first eight parsed rows are shown below before import.</p>
          </div>
        </div>

        {previewRows.length ? (
          <div className="table-shell">
            <table className="resource-table">
              <thead>
                <tr>
                  <th>Row</th>
                  {resource.fields.map((field) => (
                    <th key={field.name}>{field.label}</th>
                  ))}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={`preview-${row.lineNumber}`}>
                    <td data-label="Row">{row.lineNumber}</td>
                    {resource.fields.map((field) => (
                      <td key={`${row.lineNumber}-${field.name}`} data-label={field.label}>
                        {formatCellValue(row.payload[field.name])}
                      </td>
                    ))}
                    <td data-label="Status">
                      {row.missingRequired.length ? (
                        <span className="tag-pill tag-pill-danger">
                          Missing {row.missingRequired.join(', ')}
                        </span>
                      ) : (
                        <span className="tag-pill">Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="page-card empty-card">Upload a CSV or Excel file to see the preview here.</div>
        )}
      </section>

      {result ? (
        <section className="page-card section-stack">
          <div>
            <h2 className="section-title">Last Import Result</h2>
            <p className="subtle-text">
              {result.successCount} succeeded out of {result.total} rows.
            </p>
          </div>

          <div className="upload-stats">
            <div className="upload-stat-card">
              <span>Succeeded</span>
              <strong>{result.successCount}</strong>
            </div>
            <div className="upload-stat-card">
              <span>Failed</span>
              <strong>{result.errorCount}</strong>
            </div>
          </div>

          {result.errors.length ? (
            <div className="error-list">
              {result.errors.slice(0, 12).map((error) => (
                <div key={error} className="status-banner status-banner-danger">
                  <strong>Import issue</strong>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  )
}
