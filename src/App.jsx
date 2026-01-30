import { useState, useEffect } from 'react'
import FortuneWheel from './components/FortuneWheel'
import NameList from './components/NameList'
import WinnerModal from './components/WinnerModal'
import QuoteModal from './components/QuoteModal'
import './App.css'

const STORAGE_KEY = 'daily-spin-names'

function App() {
  const [names, setNames] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [winner, setWinner] = useState(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names))
  }, [names])

  const handleAddName = (name) => {
    if (name.trim() && !names.includes(name.trim())) {
      setNames([...names, name.trim()])
    }
  }

  const handleRemoveName = (index) => {
    setNames(names.filter((_, i) => i !== index))
  }

  const handleSpinEnd = (selectedWinner) => {
    setWinner(selectedWinner)
  }

  const handleCloseModal = () => {
    setWinner(null)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <NameList
          names={names}
          onAddName={handleAddName}
          onRemoveName={handleRemoveName}
        />
      </aside>

      <main className="main-content">
        <header className="app-header">
          <h1>Daily Spin</h1>
          <p className="subtitle">Who's leading the daily today?</p>
        </header>

        <FortuneWheel
          names={names}
          onSpinEnd={handleSpinEnd}
          disabled={!!winner}
        />

        <button
          className="quote-button"
          onClick={() => setShowQuoteModal(true)}
        >
          Motivational Quote
        </button>
      </main>

      <WinnerModal winner={winner} onClose={handleCloseModal} />
      <QuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
    </div>
  )
}

export default App
