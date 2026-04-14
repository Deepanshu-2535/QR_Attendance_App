export default function Divider({ vertical = false, margin = 12 }) {
  return (
    <div
      className={vertical ? 'divider divider-vertical' : 'divider'}
      style={vertical ? { marginInline: margin } : { marginBlock: margin }}
    />
  )
}
