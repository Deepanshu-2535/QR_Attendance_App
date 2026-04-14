export default function MetricCard({ icon, value, heading, supportingCopy }) {
  return (
    <article className="metric-card">
      <div className="metric-card-icon">{icon}</div>
      <div className="metric-card-value">{value}</div>
      <div className="metric-card-heading">{heading}</div>
      {supportingCopy ? <p className="metric-card-copy">{supportingCopy}</p> : null}
    </article>
  )
}
