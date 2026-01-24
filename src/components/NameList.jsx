import { useState } from 'react'
import './NameList.css'

const COLORS = [
  '#c76ee8', // light purple
  '#90eaa0', // light green
  '#dda4f4', // lighter purple
  '#b8f5c4', // lighter green
  '#b84de0', // medium purple
  '#7ae68d', // medium green
]

function NameList({ names, onAddName, onRemoveName }) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAddName(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="name-list">
      <h2>Participants</h2>

      <form className="add-name-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add name..."
          className="name-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <ul className="names">
        {names.map((name, index) => (
          <li key={index} className="name-item">
            <span
              className="color-dot"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="name-text">{name}</span>
            <button
              className="remove-button"
              onClick={() => onRemoveName(index)}
              aria-label={`Remove ${name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {names.length === 0 && (
        <p className="empty-message">Add participants to spin</p>
      )}
    </div>
  )
}

export default NameList
