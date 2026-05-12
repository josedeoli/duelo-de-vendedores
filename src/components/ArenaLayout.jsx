import HpBar from './HpBar'
import PlayerCard from './PlayerCard'
import VsIcon from './VsIcon'
import VictoryScreen from './VictoryScreen'
import { useDuelo } from '../hooks/useDuelo'
import './ArenaLayout.css'

const PERSONAGENS = [
  { avatar_id: 'CRISTIANE', nome: 'CRISTIANE' },
  { avatar_id: 'JOSYNEIA',  nome: 'JOSYNEIA'  },
  { avatar_id: 'LAURA',     nome: 'LAURA'     },
  { avatar_id: 'YORRAN',    nome: 'YORRAN'    },
]

const META = 10

export default function ArenaLayout({ dueloId = '1' }) {
  const { data, loading } = useDuelo(dueloId)

  if (loading || !data) {
    return (
      <div className="arena">
        <div className="arena-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Press Start 2P'", color: '#FFD700', fontSize: '1.5rem' }}>
            CARREGANDO...
          </span>
        </div>
      </div>
    )
  }

  const jogador1 = { ...PERSONAGENS[data.p1_idx ?? 0], vendas: data.p1_vendas }
  const jogador2 = { ...PERSONAGENS[data.p2_idx ?? 1], vendas: data.p2_vendas }
  const winner = data.p1_vendas >= META ? jogador1 : data.p2_vendas >= META ? jogador2 : null

  return (
    <div className="arena">
      <video
        className="arena-video"
        src={`${import.meta.env.BASE_URL}assets/videos/stage-background${dueloId === '1' ? '' : '.' + dueloId}.mp4`}
        autoPlay loop muted playsInline
      />

      <div className="arena-content">
        <div className="arena-titulo">DUELO {dueloId} DA SEMANA</div>

        <div className="arena-hud">
          <div className="hud-player hud-player--left">
            <span className="hud-name">{jogador1.nome}</span>
            <HpBar vendas={data.p1_vendas} reversed={false} />
            <span className="hud-score">{Math.min(data.p1_vendas, META)} / {META}</span>
            <span className="hud-label">TOTAL DE VENDAS</span>
          </div>

          <VsIcon />

          <div className="hud-player hud-player--right">
            <span className="hud-name">{jogador2.nome}</span>
            <HpBar vendas={data.p2_vendas} reversed={true} />
            <span className="hud-score">{Math.min(data.p2_vendas, META)} / {META}</span>
            <span className="hud-label">TOTAL DE VENDAS</span>
          </div>
        </div>

        <div className="arena-stage">
          <PlayerCard player={jogador1} side="left" />
          <PlayerCard player={jogador2} side="right" />
        </div>
      </div>

      <VictoryScreen winner={winner} onReset={null} />
    </div>
  )
}
