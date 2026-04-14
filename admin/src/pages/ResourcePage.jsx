import { Plus, RefreshCw, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import ResourceTable from '../components/ResourceTable'
import { useToast } from '../components/ToastProvider'
import { RESOURCE_DEFINITIONS } from '../constants/adminResources'
import { adminService } from '../lib/adminService'
import {
  buildPayload,
  createDraftFromItem,
  createEmptyDraft,
  filterRowsBySearch,
  getItemValue
} from '../lib/normalizers'

export default function ResourcePage({ resourceKey }) {
  const config = RESOURCE_DEFINITIONS[resourceKey]
  const service = adminService[resourceKey]
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [draft, setDraft] = useState(() => createEmptyDraft(config.fields))

  const filteredItems = useMemo(
    () => filterRowsBySearch(items, searchValue, config.columns),
    [items, searchValue, config.columns]
  )

  async function loadItems({ showRefreshing = false } = {}) {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      }

      const data = await service.list()
      setItems(data)
    } catch (error) {
      showToast({
        type: 'error',
        title: `Cannot load ${config.label.toLowerCase()}`,
        message: error.message
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    loadItems()
  }, [resourceKey])

  function handleOpenCreate() {
    setEditingItem(null)
    setDraft(createEmptyDraft(config.fields))
    setModalOpen(true)
  }

  function handleOpenEdit(item) {
    setEditingItem(item)
    setDraft(createDraftFromItem(config.fields, item))
    setModalOpen(true)
  }

  function handleCloseModal() {
    if (saving) return
    setModalOpen(false)
  }

  function handleDraftChange(name, value) {
    setDraft((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    try {
      const payload = buildPayload(config.fields, draft)
      const idValue = getItemValue(editingItem, config.idKey) || payload[config.idKey]

      if (editingItem) {
        await service.update(idValue, payload)
      } else {
        await service.create(payload)
      }

      showToast({
        type: 'info',
        title: editingItem ? `${config.singularLabel} updated` : `${config.singularLabel} created`,
        message: editingItem
          ? `${config.singularLabel} changes were saved successfully.`
          : `${config.singularLabel} has been added to the system.`
      })

      setModalOpen(false)
      await loadItems({ showRefreshing: true })
    } catch (error) {
      showToast({
        type: 'error',
        title: `Cannot save ${config.singularLabel.toLowerCase()}`,
        message: error.message
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(item) {
    const idValue = getItemValue(item, config.idKey)
    const labelValue = getItemValue(item, config.columns[1]) || getItemValue(item, config.idKey)

    if (!window.confirm(`Delete ${config.singularLabel.toLowerCase()} "${labelValue}"?`)) {
      return
    }

    try {
      await service.remove(idValue)
      showToast({
        type: 'info',
        title: `${config.singularLabel} deleted`,
        message: `${config.singularLabel} was removed from the system.`
      })
      await loadItems({ showRefreshing: true })
    } catch (error) {
      showToast({
        type: 'error',
        title: `Cannot delete ${config.singularLabel.toLowerCase()}`,
        message: error.message
      })
    }
  }

  if (loading) {
    return <LoadingSpinner message={`Loading ${config.label.toLowerCase()}...`} />
  }

  return (
    <section className="page-section">
      <section className="standalone-hero">
        <div className="standalone-hero-copy">
          <span className="eyebrow-copy">{config.label}</span>
          <h1>{config.label}</h1>
          <p>{config.description}</p>
        </div>
        <div className="standalone-hero-meta">
          <div className="standalone-meta-item">
            <div>
              <span>Total Records</span>
              <strong>{items.length}</strong>
            </div>
          </div>
          <div className="standalone-meta-item">
            <div>
              <span>Bulk Upload</span>
              <strong>{config.bulkModes.join(' + ')}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="page-card section-stack">
        <div className="toolbar-row">
          <div className="search-shell">
            <Search size={18} />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="search-input"
              placeholder={`Search ${config.label.toLowerCase()}...`}
            />
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => loadItems({ showRefreshing: true })}
              disabled={refreshing}
            >
              <RefreshCw size={16} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button type="button" className="primary-button primary-button-inline" onClick={handleOpenCreate}>
              <Plus size={18} />
              <span>Add {config.singularLabel}</span>
            </button>
          </div>
        </div>

        <ResourceTable
          columns={config.columns}
          rows={filteredItems}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          getRowId={(row, index) => getItemValue(row, config.idKey) || `${resourceKey}-${index}`}
          emptyMessage={`No ${config.label.toLowerCase()} matched your current filters.`}
        />
      </section>

      <Modal
        open={modalOpen}
        title={editingItem ? `Edit ${config.singularLabel}` : `Add ${config.singularLabel}`}
        description="Fields shown here are based on your current admin API plan. Adjust them if the backend contract changes."
        onClose={handleCloseModal}
      >
        <form className="resource-form" onSubmit={handleSubmit}>
          <div className="resource-form-grid">
            {config.fields.map((field) => (
              <label key={field.name} className="form-field">
                <span className="field-label static-label">
                  {field.label}
                  {field.required ? ' *' : ''}
                </span>
                <input
                  type={field.type === 'number' ? 'number' : field.type || 'text'}
                  value={draft[field.name]}
                  placeholder={field.placeholder}
                  onChange={(event) => handleDraftChange(field.name, event.target.value)}
                  className="text-input"
                  disabled={editingItem && field.name === config.idKey}
                  required={field.required && !editingItem}
                />
              </label>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="ghost-button" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="primary-button primary-button-inline" disabled={saving}>
              <span>{saving ? 'Saving...' : editingItem ? 'Save Changes' : `Create ${config.singularLabel}`}</span>
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
