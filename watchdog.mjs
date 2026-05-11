import { readFileSync, writeFileSync, mkdirSync, watchFile } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EXCEL_PATH = join(__dirname, 'vendas.xlsx')
const OUT_DIR    = join(__dirname, 'public')
const OUT_PATH   = join(OUT_DIR, 'duelo_config.json')
const POLL_MS    = 1500  // intervalo de verificação do arquivo (ms)

// Extrai primeiro nome em maiúsculas para mapear ao arquivo PNG do vendedor
// ex: "Cristiane Santos" → "CRISTIANE"  |  "YORRAN" → "YORRAN"
function toAvatarId(raw) {
  return String(raw)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .split(/\s+/)[0]
    .toUpperCase()
}

// Lê um campo aceitando camelCase ou PascalCase (ex: "nome" ou "Nome")
function campo(row, key) {
  const pascalKey = key.charAt(0).toUpperCase() + key.slice(1)
  const valor = row[key] ?? row[pascalKey] ?? ''
  return String(valor).trim()
}

function processar() {
  try {
    const wb   = XLSX.read(readFileSync(EXCEL_PATH))
    const ws   = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

    if (rows.length < 2) {
      console.error('[watchdog] ERRO: vendas.xlsx precisa ter pelo menos 2 linhas de dados (uma por competidor).')
      return
    }

    const config = {
      p1: {
        nome:      campo(rows[0], 'nome'),
        vendas:    Number(campo(rows[0], 'vendas')) || 0,
        avatar_id: toAvatarId(campo(rows[0], 'nome')),
      },
      p2: {
        nome:      campo(rows[1], 'nome'),
        vendas:    Number(campo(rows[1], 'vendas')) || 0,
        avatar_id: toAvatarId(campo(rows[1], 'nome')),
      },
    }

    mkdirSync(OUT_DIR, { recursive: true })
    writeFileSync(OUT_PATH, JSON.stringify(config, null, 2), 'utf-8')

    const ts = new Date().toLocaleTimeString('pt-BR')
    console.log(`\n[${ts}] duelo_config.json atualizado com sucesso`)
    console.log(`  P1: "${config.p1.nome}"  →  ${config.p1.vendas} venda(s)  |  avatar: ${config.p1.avatar_id}.png`)
    console.log(`  P2: "${config.p2.nome}"  →  ${config.p2.vendas} venda(s)  |  avatar: ${config.p2.avatar_id}.png`)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('[watchdog] Aguardando vendas.xlsx... (arquivo não encontrado ainda)')
    } else {
      console.error('[watchdog] Erro ao processar:', err.message)
    }
  }
}

// Executa imediatamente ao iniciar
processar()

// Monitora mudanças no arquivo via polling (confiável no Windows com Excel)
watchFile(EXCEL_PATH, { interval: POLL_MS }, (curr, prev) => {
  if (curr.mtimeMs !== prev.mtimeMs) {
    console.log('\n[watchdog] Mudança detectada em vendas.xlsx...')
    processar()
  }
})

console.log('─'.repeat(55))
console.log(' WATCHDOG — Duelo de Vendedores')
console.log(`  Monitorando : vendas.xlsx`)
console.log(`  Saída       : public/duelo_config.json`)
console.log(`  Intervalo   : ${POLL_MS} ms`)
console.log('  Pressione Ctrl+C para parar')
console.log('─'.repeat(55))
