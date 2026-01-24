import { useState, useEffect } from 'react'
import './WinnerModal.css'

const EXCLUDE_CATEGORIES = 'relationships,love,faith,humor,art,writing,fear,nature,freedom,death,happiness'

function WinnerModal({ winner, onClose }) {
  const [quote, setQuote] = useState(null)
  const [loadingQuote, setLoadingQuote] = useState(false)

  useEffect(() => {
    if (winner) {
      fetchQuote()
    } else {
      setQuote(null)
    }
  }, [winner])

  const fetchQuote = async () => {
    setLoadingQuote(true)

    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v2/randomquotes?exclude_categories=${EXCLUDE_CATEGORIES}`,
        {
          headers: {
            'X-Api-Key': 'hLkmGBsRCX6pliSsroxw1GtEH99DPIjLtZUoPvQM'
          }
        }
      )
      const data = await response.json()
      if (data?.length > 0) {
        setQuote(data[0])
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error)
    } finally {
      setLoadingQuote(false)
    }
  }

  if (!winner) return null

  return (
    <div className="winner-modal-backdrop" onClick={onClose}>
      <div className="winner-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confetti">🎉</div>
        <h2>Today's Leader</h2>
        <div className="winner-name">{winner}</div>
        <p className="winner-subtitle">Time to shine!</p>
        <div className="confetti">🎊</div>

        <div className="quote-section">
          {loadingQuote ? (
            <p className="quote-loading">Loading quote...</p>
          ) : quote ? (
            <>
              <p className="quote-text">"{quote.quote}"</p>
              <p className="quote-author">— {quote.author}</p>
            </>
          ) : null}
        </div>
      </div>
      <p className="dismiss-hint">Click anywhere to close</p>
    </div>
  )
}

export default WinnerModal
