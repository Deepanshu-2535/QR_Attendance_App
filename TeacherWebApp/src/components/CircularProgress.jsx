export default function CircularProgress({ size = 110, fill = 0, label = '' }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const safeFill = Math.max(0, Math.min(100, Number.isFinite(fill) ? fill : 0))
  const dashOffset = circumference - (safeFill / 100) * circumference

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(47, 128, 237, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-primary)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="circular-progress-label">
        <strong>{Math.round(safeFill)}%</strong>
        {label ? <span>{label}</span> : null}
      </div>
    </div>
  )
}
