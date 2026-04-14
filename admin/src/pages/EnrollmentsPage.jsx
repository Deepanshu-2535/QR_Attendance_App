import { Link2, RefreshCw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import ResourceTable from '../components/ResourceTable'
import { useToast } from '../components/ToastProvider'
import { RESOURCE_DEFINITIONS } from '../constants/adminResources'
import { adminService } from '../lib/adminService'
import { buildPayload, createEmptyDraft, getItemValue } from '../lib/normalizers'

const config = RESOURCE_DEFINITIONS.enrollments

export default function EnrollmentsPage() {
  const { showToast } = useToast()
  const [listLoading, setListLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [enrollmentListSupported, setEnrollmentListSupported] = useState(true)
  const [enrollments, setEnrollments] = useState([])
  const [createDraft, setCreateDraft] = useState(() => createEmptyDraft(config.fields))
  const [deleteId, setDeleteId] = useState('')

  async function loadEnrollments({ showRefreshing = false } = {}) {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      }

      const data = await adminService.enrollments.list()
      setEnrollments(data)
      setEnrollmentListSupported(true)
    } catch (error) {
      if ([404, 405].includes(error.status)) {
        setEnrollmentListSupported(false)
        setEnrollments([])
      } else {
        showToast({
          type: 'error',
          title: 'Cannot load enrollments',
          message: error.message
        })
      }
    } finally {
      setListLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [])

  function handleCreateDraftChange(name, value) {
    setCreateDraft((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function handleCreate(event) {
    event.preventDefault()
    setSaving(true)

    try {
      await adminService.enrollments.create(buildPayload(config.fields, createDraft))
      showToast({
        type: 'info',
        title: 'Enrollment created',
        message: 'The student has been enrolled in the selected subject.'
      })
      setCreateDraft(createEmptyDraft(config.fields))
      await loadEnrollments({ showRefreshing: true })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Cannot create enrollment',
        message: error.message
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteById(id) {
    if (!id) {
      showToast({
        type: 'error',
        title: 'Enrollment ID required',
        message: 'Provide an enrollment ID to remove.'
      })
      return
    }

    if (!window.confirm(`Delete enrollment "${id}"?`)) {
      return
    }

    setDeleting(true)

    try {
      await adminService.enrollments.remove(id)
      showToast({
        type: 'info',
        title: 'Enrollment removed',
        message: 'The enrollment record has been deleted.'
      })
      setDeleteId('')
      await loadEnrollments({ showRefreshing: true })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Cannot delete enrollment',
        message: error.message
      })
    } finally {
      setDeleting(false)
    }
  }

  if (listLoading) {
    return <LoadingSpinner message="Loading enrollments..." />
  }

  return (
    <section className="page-section">
      <section className="standalone-hero">
        <div className="standalone-hero-copy">
          <span className="eyebrow-copy">Enrollments</span>
          <h1>Connect students to subjects</h1>
          <p>
            Add enrollment relationships directly here or feed them through the bulk upload screen
            when you have a spreadsheet ready.
          </p>
        </div>
        <div className="standalone-hero-meta">
          <div className="standalone-meta-item">
            <div>
              <span>List Support</span>
              <strong>{enrollmentListSupported ? 'Available' : 'Needed'}</strong>
            </div>
          </div>
          <div className="standalone-meta-item">
            <div>
              <span>Known Records</span>
              <strong>{enrollmentListSupported ? enrollments.length : 'Unknown'}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="split-layout">
        <section className="page-card">
          <div className="section-heading-row">
            <div>
              <h2 className="section-title">Create Enrollment</h2>
              <p className="subtle-text">Use roll number and subject code to create the relationship.</p>
            </div>
          </div>

          <form className="resource-form" onSubmit={handleCreate}>
            <div className="resource-form-grid">
              {config.fields.map((field) => (
                <label key={field.name} className="form-field">
                  <span className="field-label static-label">{field.label}</span>
                  <input
                    value={createDraft[field.name]}
                    onChange={(event) => handleCreateDraftChange(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    className="text-input"
                    required={field.required}
                  />
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button type="submit" className="primary-button primary-button-inline" disabled={saving}>
                <Link2 size={18} />
                <span>{saving ? 'Creating...' : 'Create Enrollment'}</span>
              </button>
            </div>
          </form>
        </section>

        <aside className="page-card section-stack">
          <div>
            <h2 className="section-title">Delete Enrollment</h2>
            <p className="subtle-text">
              Your current API plan exposes deletion by enrollment ID, so this panel accepts manual IDs
              even if the list endpoint has not been added yet.
            </p>
          </div>

          <div className="inline-form">
            <input
              value={deleteId}
              onChange={(event) => setDeleteId(event.target.value)}
              placeholder="Enrollment ID"
              className="text-input"
            />
            <button
              type="button"
              className="danger-button danger-button-inline"
              onClick={() => handleDeleteById(deleteId)}
              disabled={deleting}
            >
              <Trash2 size={18} />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>

          <div className="status-banner">
            <strong>Recommendation</strong>
            <span>
              Add <code>GET /api/v1/admin/enrollments</code> so this screen can list existing rows
              and provide one-click deletion from the table below.
            </span>
          </div>
        </aside>
      </div>

      <section className="page-card section-stack">
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">Enrollment Records</h2>
            <p className="subtle-text">
              {enrollmentListSupported
                ? 'Existing enrollment records loaded from the backend.'
                : 'Listing is waiting on a GET endpoint. Once it exists, this table will start working automatically.'}
            </p>
          </div>
          <button
            type="button"
            className="ghost-button"
            onClick={() => loadEnrollments({ showRefreshing: true })}
            disabled={refreshing}
          >
            <RefreshCw size={16} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {enrollmentListSupported ? (
          <ResourceTable
            columns={config.columns}
            rows={enrollments}
            showEdit={false}
            onDelete={(row) => handleDeleteById(getItemValue(row, config.idKey))}
            getRowId={(row, index) => getItemValue(row, config.idKey) || `enrollment-${index}`}
            emptyMessage="No enrollments were returned by the API."
          />
        ) : (
          <div className="page-card empty-card">
            The panel is ready for enrollment listing, but the backend still needs
            <code> GET /api/v1/admin/enrollments</code>.
          </div>
        )}
      </section>
    </section>
  )
}
