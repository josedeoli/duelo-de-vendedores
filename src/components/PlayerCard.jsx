import { useState } from 'react'
import './PlayerCard.css'

// Direção natural de cada sprite no arquivo PNG
const FACING = {
  JOSYNEIA:  'left',
  LAURA:     'right',
  CRISTIANE: 'right',
  YORRAN:    'right',
}

export default function PlayerCard({ player, side }) {
  const [imgError, setImgError] = useState(false)
  const src = imgError ? '/assets/Vendedores/default.png' : `/assets/Vendedores/${player.avatar_id}.png`

  const naturalDir = FACING[player.avatar_id] || 'right'
  const needsFlip = (side === 'left' && naturalDir === 'left') ||
                    (side === 'right' && naturalDir === 'right')

  return (
    <div className={`player-card player-card--${side}`}>
      <img
        src={src}
        alt={player.nome}
        className="player-sprite"
        style={needsFlip ? { transform: 'scaleX(-1)' } : undefined}
        onError={() => setImgError(true)}
      />
    </div>
  )
}
