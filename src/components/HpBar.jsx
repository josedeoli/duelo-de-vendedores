import { motion, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'
import './HpBar.css'

const TOTAL = 10

function segmentColor(filled) {
  if (filled >= TOTAL) return '#00FF41'
  return '#FFD700'
}

export default function HpBar({ vendas = 0, reversed = false }) {
  const filled = Math.min(vendas, TOTAL)
  const color = segmentColor(filled)
  const shakeControls = useAnimation()
  const prevRef = useRef(vendas)

  useEffect(() => {
    if (vendas > prevRef.current && vendas <= TOTAL) {
      shakeControls.start({
        x: [0, -9, 9, -6, 6, -3, 3, 0],
        transition: { duration: 0.45, ease: 'easeOut' },
      })
    }
    prevRef.current = vendas
  }, [vendas, shakeControls])

  return (
    <motion.div
      className={`hp-bar ${reversed ? 'hp-bar--reversed' : ''}`}
      animate={shakeControls}
    >
      {Array.from({ length: TOTAL }, (_, i) => {
        const isFilled = i < filled
        return (
          <motion.div
            key={i}
            className="hp-segment"
            animate={{
              backgroundColor: isFilled ? color : '#2a2a2a',
              boxShadow: isFilled
                ? `0 0 10px ${color}, 0 0 20px ${color}60, inset 0 1px 0 rgba(255,255,255,0.25)`
                : 'none',
            }}
            transition={{
              duration: 0.25,
              delay: isFilled ? i * 0.04 : 0,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </motion.div>
  )
}
