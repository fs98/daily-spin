import { useState, useEffect } from 'react'
import FortuneWheel from './components/FortuneWheel'
import NameList from './components/NameList'
import WinnerModal from './components/WinnerModal'
import './App.css'

const STORAGE_KEY = 'daily-spin-names'

function App() {
  const [names, setNames] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [winner, setWinner] = useState(null)

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
      </main>

      <WinnerModal winner={winner} onClose={handleCloseModal} />
    </div>
  )
}

export default App
