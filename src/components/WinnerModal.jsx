import './WinnerModal.css'

function WinnerModal({ winner, onClose }) {
  if (!winner) return null

  return (
    <div className="winner-modal-backdrop" onClick={onClose}>
      <div className="winner-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confetti">🎉</div>
        <h2>Today's Leader</h2>
        <div className="winner-name">{winner}</div>
        <p className="winner-subtitle">Time to shine!</p>
        <div className="confetti">🎊</div>
      </div>
      <p className="dismiss-hint">Click anywhere to close</p>
    </div>
  )
}

export default WinnerModal
