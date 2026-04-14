import { Pencil, Trash2 } from 'lucide-react'
import { formatCellValue, getItemValue } from '../lib/normalizers'

export default function ResourceTable({
  columns,
  rows,
  onEdit,
  onDelete,
  showEdit = true,
  getRowId,
  emptyMessage = 'No records found.'
}) {
  if (!rows.length) {
    return <div className="page-card empty-card">{emptyMessage}</div>
  }

  return (
    <div className="table-shell">
      <table className="resource-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th className="table-actions-heading">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={getRowId(row, index)}>
              {columns.map((column) => (
                <td key={column.key} data-label={column.label}>
                  {formatCellValue(getItemValue(row, column))}
                </td>
              ))}
              <td data-label="Actions">
                <div className="table-action-row">
                  {showEdit ? (
                    <button type="button" className="ghost-button" onClick={() => onEdit(row)}>
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>
                  ) : null}
                  <button type="button" className="ghost-button danger-ghost" onClick={() => onDelete(row)}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
