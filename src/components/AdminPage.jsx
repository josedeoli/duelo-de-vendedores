import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './AdminPage.css'

const PERSONAGENS = [
  { avatar_id: 'CRISTIANE', nome: 'CRISTIANE' },
  { avatar_id: 'JOSYNEIA',  nome: 'JOSYNEIA'  },
  { avatar_id: 'LAURA',     nome: 'LAURA'     },
  { avatar_id: 'YORRAN',    nome: 'YORRAN'    },
]

const META = 10

function defaultDuelo(id) {
  return { duelo_id: id, p1_idx: 0, p1_vendas: 0, p2_idx: 1, p2_vendas: 0, meta: META }
}

export default function AdminPage() {
  const [duelos, setDuelos] = useState({ '1': defaultDuelo('1'), '2': defaultDuelo('2') })

  useEffect(() => {
    supabase.from('duelos').select('*').then(({ data }) => {
      if (data) {
        setDuelos(prev => {
          const next = { ...prev }
          data.forEach(d => { next[d.duelo_id] = d })
          return next
        })
      }
    })

    const channel = supabase
      .channel('admin-all')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'duelos' }, payload => {
        setDuelos(prev => ({ ...prev, [payload.new.duelo_id]: payload.new }))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function updateField(dueloId, field, value) {
    setDuelos(prev => ({ ...prev, [dueloId]: { ...prev[dueloId], [field]: value } }))
    await supabase.from('duelos').update({ [field]: value }).eq('duelo_id', dueloId)
  }

  function addVenda(dueloId, player) {
    const field = player === 1 ? 'p1_vendas' : 'p2_vendas'
    const current = duelos[dueloId]?.[field] ?? 0
    if (current >= META) return
    updateField(dueloId, field, current + 1)
  }

  function subVenda(dueloId, player) {
    const field = player === 1 ? 'p1_vendas' : 'p2_vendas'
    const current = duelos[dueloId]?.[field] ?? 0
    if (current <= 0) return
    updateField(dueloId, field, current - 1)
  }

  function nextChar(dueloId, player, dir) {
    const field = player === 1 ? 'p1_idx' : 'p2_idx'
    const current = duelos[dueloId]?.[field] ?? 0
    const next = (current + dir + PERSONAGENS.length) % PERSONAGENS.length
    updateField(dueloId, field, next)
  }

  async function resetDuelo(dueloId) {
    if (!confirm(`Resetar o Duelo ${dueloId}? As vendas voltarão a zero.`)) return
    setDuelos(prev => ({ ...prev, [dueloId]: { ...prev[dueloId], p1_vendas: 0, p2_vendas: 0 } }))
    await supabase.from('duelos').update({ p1_vendas: 0, p2_vendas: 0 }).eq('duelo_id', dueloId)
  }

  return (
    <div className="admin-page">
      <h1 className="admin-header">⚔ PAINEL ADMIN</h1>

      {['1', '2'].map(id => {
        const d = duelos[id]
        const p1 = PERSONAGENS[d.p1_idx ?? 0]
        const p2 = PERSONAGENS[d.p2_idx ?? 1]

        return (
          <div key={id} className="admin-card">
            <div className="admin-card-title">DUELO {id} DA SEMANA</div>

            <div className="admin-players">
              <div className="admin-player">
                <div className="admin-char-selector">
                  <button className="admin-btn admin-btn-nav" onClick={() => nextChar(id, 1, -1)}>◄</button>
                  <img
                    className="admin-char-img"
                    src={`${import.meta.env.BASE_URL}assets/Vendedores/${p1.avatar_id}.png`}
                    alt={p1.nome}
                  />
                  <button className="admin-btn admin-btn-nav" onClick={() => nextChar(id, 1, 1)}>►</button>
                </div>
                <div className="admin-player-name">{p1.nome}</div>
                <div className="admin-player-score">{d.p1_vendas}</div>
                <div className="admin-sale-buttons">
                  <button className="admin-btn admin-btn-sub" onClick={() => subVenda(id, 1)}>−</button>
                  <button className="admin-btn admin-btn-add" onClick={() => addVenda(id, 1)}>+</button>
                </div>
              </div>

              <div className="admin-vs">VS</div>

              <div className="admin-player">
                <div className="admin-char-selector">
                  <button className="admin-btn admin-btn-nav" onClick={() => nextChar(id, 2, -1)}>◄</button>
                  <img
                    className="admin-char-img"
                    src={`${import.meta.env.BASE_URL}assets/Vendedores/${p2.avatar_id}.png`}
                    alt={p2.nome}
                  />
                  <button className="admin-btn admin-btn-nav" onClick={() => nextChar(id, 2, 1)}>►</button>
                </div>
                <div className="admin-player-name">{p2.nome}</div>
                <div className="admin-player-score">{d.p2_vendas}</div>
                <div className="admin-sale-buttons">
                  <button className="admin-btn admin-btn-sub" onClick={() => subVenda(id, 2)}>−</button>
                  <button className="admin-btn admin-btn-add" onClick={() => addVenda(id, 2)}>+</button>
                </div>
              </div>
            </div>

            <button className="admin-btn admin-btn-reset" onClick={() => resetDuelo(id)}>
              RESETAR DUELO {id}
            </button>
          </div>
        )
      })}
    </div>
  )
}
