export default function InfoPanelCard({ icon, value, heading }) {
  return (
    <article className="info-panel-card">
      <div className="info-panel-icon">{icon}</div>
      <div className="info-panel-value">{value}</div>
      <div className="info-panel-heading">{heading}</div>
    </article>
  )
}
