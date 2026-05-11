import { motion, AnimatePresence } from 'framer-motion'
import './VictoryScreen.css'

export default function VictoryScreen({ winner, onReset }) {
  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          className="victory-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* flash branco instantâneo */}
          <motion.div
            className="screen-flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.h1
            className="ko-text"
            initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
            animate={{ scale: [0.2, 1.35, 1], rotate: [-15, 6, 0], opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.25, ease: 'easeOut' }}
          >
            K.O.!
          </motion.h1>

          <motion.p
            className="winner-name"
            initial={{ y: 56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {winner.nome.toUpperCase()}
          </motion.p>

          <motion.p
            className="you-win-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
            transition={{ duration: 1.2, delay: 1.4, repeat: Infinity, repeatDelay: 0.5 }}
          >
            YOU WIN!
          </motion.p>

          <motion.button
            className="btn-novo-duelo-victory"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            onClick={onReset}
          >
            NOVO DUELO
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
