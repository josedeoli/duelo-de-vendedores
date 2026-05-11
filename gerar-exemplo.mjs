import * as XLSX from 'xlsx'

// ── Duelo atual (edite aqui) ──────────────────────────
const duelo = [
  { nome: 'CRISTIANE', vendas: 0 },
  { nome: 'YORRAN',    vendas: 0 },
]

// ── Personagens disponíveis (não edite) ───────────────
const personagens = [
  { personagens_disponiveis: 'CRISTIANE' },
  { personagens_disponiveis: 'JOSYNEIA'  },
  { personagens_disponiveis: 'LAURA'     },
  { personagens_disponiveis: 'YORRAN'    },
]

const wb = XLSX.utils.book_new()

const wsDuelo = XLSX.utils.json_to_sheet(duelo)
wsDuelo['!cols'] = [{ wch: 20 }, { wch: 10 }]
XLSX.utils.book_append_sheet(wb, wsDuelo, 'Duelo')

const wsRef = XLSX.utils.json_to_sheet(personagens)
wsRef['!cols'] = [{ wch: 25 }]
XLSX.utils.book_append_sheet(wb, wsRef, 'Referencia')

XLSX.writeFile(wb, 'vendas.xlsx')

console.log('[ok] vendas.xlsx gerado com sucesso')
console.log(`  P1: ${duelo[0].nome} — ${duelo[0].vendas} vendas`)
console.log(`  P2: ${duelo[1].nome} — ${duelo[1].vendas} vendas`)
console.log('  Aba "Referencia" contém os personagens disponíveis')
