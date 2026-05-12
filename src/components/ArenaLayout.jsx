import { useState, useEffect } from 'react'
import HpBar from './HpBar'

import PlayerCard from './PlayerCard'
import VsIcon from './VsIcon'
import VictoryScreen from './VictoryScreen'
import './ArenaLayout.css'

const PERSONAGENS = [
  { avatar_id: 'CRISTIANE', nome: 'CRISTIANE' },
  { avatar_id: 'JOSYNEIA',  nome: 'JOSYNEIA'  },
  { avatar_id: 'LAURA',     nome: 'LAURA'     },
  { avatar_id: 'YORRAN',    nome: 'YORRAN'    },
]

const META = 10

export default function ArenaLayout() {
  const [p1, setP1] = useState(() => {
    try {
      const saved = localStorage.getItem('duelo_p1')
      return saved ? JSON.parse(saved) : { idx: 0, vendas: 0 }
    } catch { return { idx: 0, vendas: 0 } }
  })
  const [p2, setP2] = useState(() => {
    try {
      const saved = localStorage.getItem('duelo_p2')
      return saved ? JSON.parse(saved) : { idx: 1, vendas: 0 }
    } catch { return { idx: 1, vendas: 0 } }
  })

  useEffect(() => { localStorage.setItem('duelo_p1', JSON.stringify(p1)) }, [p1])
  useEffect(() => { localStorage.setItem('duelo_p2', JSON.stringify(p2)) }, [p2])

  const jogador1 = { ...PERSONAGENS[p1.idx], vendas: p1.vendas }
  const jogador2 = { ...PERSONAGENS[p2.idx], vendas: p2.vendas }
  const winner = p1.vendas >= META ? jogador1 : p2.vendas >= META ? jogador2 : null

  function nextChar(setter, currentIdx, dir) {
    setter(prev => ({
      ...prev,
      idx: (currentIdx + dir + PERSONAGENS.length) % PERSONAGENS.length,
    }))
  }

  function addVenda(setter, current) {
    if (current.vendas >= META) return
    setter(prev => ({ ...prev, vendas: prev.vendas + 1 }))
  }

  function subVenda(setter, current) {
    if (current.vendas <= 0) return
    setter(prev => ({ ...prev, vendas: prev.vendas - 1 }))
  }

  function reset() {
    setP1(prev => ({ ...prev, vendas: 0 }))
    setP2(prev => ({ ...prev, vendas: 0 }))
    localStorage.removeItem('duelo_p1')
    localStorage.removeItem('duelo_p2')
  }

  return (
    <div className="arena">

      {/* Camada 0 — vídeo de fundo */}
      <video
        className="arena-video"
        src={`${import.meta.env.BASE_URL}assets/videos/stage-background.mp4`}
        autoPlay loop muted playsInline
      />

      {/* Camada 1 — conteúdo */}
      <div className="arena-content">

        <div className="arena-titulo">DUELO 1 DA SEMANA</div>

        {/* HUD */}
        <div className="arena-hud">
          <div className="hud-player hud-player--left">
            <span className="hud-name">{jogador1.nome}</span>
            <HpBar vendas={p1.vendas} reversed={false} />
            <span className="hud-score">{Math.min(p1.vendas, META)} / {META}</span>
            <span className="hud-label">TOTAL DE VENDAS</span>
          </div>

          <VsIcon />

          <div className="hud-player hud-player--right">
            <span className="hud-name">{jogador2.nome}</span>
            <HpBar vendas={p2.vendas} reversed={true} />
            <span className="hud-score">{Math.min(p2.vendas, META)} / {META}</span>
            <span className="hud-label">TOTAL DE VENDAS</span>
          </div>
        </div>

        {/* Stage */}
        <div className="arena-stage">
          <PlayerCard player={jogador1} side="left" />
          <PlayerCard player={jogador2} side="right" />
        </div>

        {/* Painel de controle */}
        <div className="arena-controls">

          {/* Controles P1 */}
          <div className="player-controls">
            <div className="char-selector">
              <button className="btn-arcade btn-nav" onClick={() => nextChar(setP1, p1.idx, -1)}>◄</button>
              <img
                src={`${import.meta.env.BASE_URL}assets/Vendedores/${PERSONAGENS[p1.idx].avatar_id}.png`}
                className="char-thumb"
                alt={PERSONAGENS[p1.idx].nome}
              />
              <button className="btn-arcade btn-nav" onClick={() => nextChar(setP1, p1.idx, 1)}>►</button>
            </div>
            <div className="sale-buttons">
              <button className="btn-arcade btn-sub" onClick={() => subVenda(setP1, p1)}>−</button>
              <button className="btn-arcade btn-add" onClick={() => addVenda(setP1, p1)}>+</button>
            </div>
          </div>

          {/* Controles P2 */}
          <div className="player-controls">
            <div className="sale-buttons">
              <button className="btn-arcade btn-sub" onClick={() => subVenda(setP2, p2)}>−</button>
              <button className="btn-arcade btn-add" onClick={() => addVenda(setP2, p2)}>+</button>
            </div>
            <div className="char-selector">
              <button className="btn-arcade btn-nav" onClick={() => nextChar(setP2, p2.idx, -1)}>◄</button>
              <img
                src={`${import.meta.env.BASE_URL}assets/Vendedores/${PERSONAGENS[p2.idx].avatar_id}.png`}
                className="char-thumb"
                alt={PERSONAGENS[p2.idx].nome}
              />
              <button className="btn-arcade btn-nav" onClick={() => nextChar(setP2, p2.idx, 1)}>►</button>
            </div>
          </div>

        </div>
      </div>

      {/* Camada 2 — vitória */}
      <VictoryScreen winner={winner} onReset={reset} />

    </div>
  )
}
