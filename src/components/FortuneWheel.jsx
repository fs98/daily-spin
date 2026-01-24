import { useRef, useEffect, useState } from 'react'
import './FortuneWheel.css'

const COLORS = [
  '#c76ee8', // light purple
  '#90eaa0', // light green
  '#dda4f4', // lighter purple
  '#b8f5c4', // lighter green
  '#b84de0', // medium purple
  '#7ae68d', // medium green
]

function FortuneWheel({ names, onSpinEnd, disabled }) {
  const canvasRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const drawWheel = (ctx, currentRotation) => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 8

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (names.length === 0) {
      ctx.fillStyle = 'rgba(33, 43, 69, 0.05)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = 'rgba(33, 43, 69, 0.3)'
      ctx.font = `${14 * dpr}px system-ui`
      ctx.textAlign = 'center'
      ctx.fillText('Add names to spin', centerX, centerY)
      return
    }

    const sliceAngle = (2 * Math.PI) / names.length

    names.forEach((name, i) => {
      const startAngle = i * sliceAngle + currentRotation
      const endAngle = startAngle + sliceAngle

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()

      // Draw border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 2 * dpr
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#212B45'
      ctx.font = `500 ${14 * dpr}px system-ui`
      ctx.fillText(name, radius - 24, 5)
      ctx.restore()
    })

    // Center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10 * dpr, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.strokeStyle = 'rgba(33, 43, 69, 0.1)'
    ctx.lineWidth = 2 * dpr
    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    canvas.width = 320 * dpr
    canvas.height = 320 * dpr
    canvas.style.width = '320px'
    canvas.style.height = '320px'

    drawWheel(ctx, rotation)
  }, [names, rotation])

  const spin = () => {
    if (isSpinning || names.length === 0 || disabled) return

    setIsSpinning(true)

    // Pick random winner first (uniform distribution)
    const winnerIndex = Math.floor(Math.random() * names.length)

    // Slice geometry (matches drawing code)
    const sliceAngle = (2 * Math.PI) / names.length

    // Slice i is drawn from angle (i * sliceAngle + rotation) to ((i+1) * sliceAngle + rotation)
    // Slice center is at: i * sliceAngle + sliceAngle/2 + rotation
    // Pointer is at 3π/2 (top, pointing down)
    // We need: winnerIndex * sliceAngle + sliceAngle/2 + finalRotation = 3π/2
    // So: finalRotation = 3π/2 - winnerIndex * sliceAngle - sliceAngle/2

    const sliceCenterOffset = winnerIndex * sliceAngle + sliceAngle / 2
    const targetRotation = (3 * Math.PI / 2) - sliceCenterOffset

    // Add randomness within the slice (stay away from edges)
    const wobble = (Math.random() - 0.5) * sliceAngle * 0.6
    const finalTarget = targetRotation + wobble

    // Normalize to positive and add full spins for visual effect
    const fullSpins = Math.PI * 2 * (6 + Math.floor(Math.random() * 5))
    const normalizedTarget = ((finalTarget % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const totalRotation = fullSpins + normalizedTarget

    const spinDuration = 3500 + Math.random() * 1500
    const startTime = Date.now()
    const startRotation = 0 // Always start from 0 for consistency
    setRotation(0)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / spinDuration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const currentRotation = startRotation + (totalRotation - startRotation) * easeOut

      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        if (onSpinEnd) {
          onSpinEnd(names[winnerIndex])
        }
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div className="fortune-wheel">
      <div className="wheel-wrapper">
        <div className="pointer" />
        <canvas ref={canvasRef} />
      </div>
      <button
        className="spin-button"
        onClick={spin}
        disabled={isSpinning || names.length === 0 || disabled}
      >
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  )
}

export default FortuneWheel
