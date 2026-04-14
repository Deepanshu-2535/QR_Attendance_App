export default function LoadingSpinner({
  message = 'Loading...',
  showMessage = true,
  fullScreen = true,
  small = false
}) {
  return (
    <div className={fullScreen ? 'loading-screen' : 'loading-inline'}>
      <div className={`spinner ${small ? 'spinner-small' : ''}`} />
      {showMessage ? <p className="loading-message">{message}</p> : null}
    </div>
  )
}
