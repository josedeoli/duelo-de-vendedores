# CLAUDE.md — Constituição do Duelo de Vendedores · Vitrine

> Este arquivo é a fonte de verdade do projeto. Em toda interação, Claude deve ler e respeitar estas diretrizes sem precisar que o usuário as repita.

---

## 1. Identidade do Projeto

**Nome:** Duelo de Vendedores — Vitrine
**Formato:** Dashboard para TV corporativa (fullscreen, 1920×1080, sem interação de toque)
**Propósito:** Exibir, em tempo real, um duelo X1 (1 vs 1) entre dois vendedores, impulsionando competição saudável pelo número de Vendas Efetivadas.

---

## 2. Stack Tecnológica — Regras Absolutas

| Camada | Tecnologia | Observação |
|---|---|---|
| Frontend | React + Vite | JSX, componentes funcionais, hooks |
| Estilo | Tailwind CSS | Nenhum CSS global avulso; só utilitários Tailwind + `cn()` quando necessário |
| Animações | **Framer Motion** | Obrigatório para barras de HP, transições de estado e efeitos de vitória |
| Ícones | Lucide React | Único pacote de ícones permitido |
| Parse Excel | `xlsx` (SheetJS) | Leitura do `vendas.xlsx` no script de conversão |
| Conversão | Script Node.js (`gerar-config.mjs`) | Transforma `vendas.xlsx` → `duelo_config.json` |

**Proibido:** CSS-in-JS, styled-components, outro pacote de ícones, jQuery ou qualquer lib de UI genérica (MUI, Chakra, etc.).

---

## 3. Comandos

```bash
npm run dev        # Servidor de desenvolvimento (Vite HMR)
npm run build      # Build de produção → dist/
npm run preview    # Serve o build de produção localmente
npm run lint       # ESLint em todos os .js/.jsx
node gerar-config.mjs   # Lê vendas.xlsx e grava public/duelo_config.json
```

Não há suite de testes configurada.

---

## 4. Regras de Negócio do Duelo — Imutáveis

### 4.1 Métrica principal
A única métrica que conta no Duelo é **Vendas Efetivadas** (`vendas_efetivadas`).

### 4.2 Meta do Duelo
A meta fixa de cada duelo é **10 vendas**. Isso nunca muda via UI; só muda em `duelo_config.json`.

### 4.3 Barra de HP (Energia)
- Dividida em **10 segmentos iguais**.
- Cada segmento representa **1 venda = 10% da barra**.
- Preenchimento: `segmentos_preenchidos = Math.min(vendas_efetivadas, 10)`.
- A barra **nunca ultrapassa 10 segmentos**, mesmo que as vendas excedam 10.
- Animação obrigatória (Framer Motion) ao preencher cada novo segmento.

### 4.4 Condição de Vitória
- Quando `vendas_efetivadas >= 10`, disparar a tela de vitória com:
  - Texto **"K.O.!"** piscando no estilo arcade.
  - Overlay com **"YOU WIN"** para o vencedor e **"YOU LOSE"** para o perdedor.
  - Animação de flash na tela inteira (frame branco → normal).
- Enquanto nenhum jogador atingiu 10, exibir apenas as barras em disputa.

### 4.5 Identificação dos Jogadores
- Nomes sempre em **MAIÚSCULAS** (transformar via CSS `text-transform: uppercase` ou `.toUpperCase()` no JS).
- Jogador 1 posicionado à **esquerda**, Jogador 2 à **direita**.
- Ícone **"VS"** centralizado entre os dois combatentes, estilo arcade pixel.

---

## 5. Arquitetura de Dados

### 5.1 Arquivo-fonte: `vendas.xlsx`
Editado pelo diretor. Colunas obrigatórias:

| Coluna Excel | Campo JSON | Tipo |
|---|---|---|
| `nome` | `vendedor_nome` | string |
| `avatar` | `avatar_id` | string (nome do arquivo sem extensão) |
| `vendas` | `vendas_efetivadas` | number |

### 5.2 Arquivo gerado: `public/duelo_config.json`

```json
{
  "duelo": {
    "meta": 10,
    "jogador1": {
      "vendedor_nome": "NOME EM MAIÚSCULAS",
      "avatar_id": "nome-do-arquivo",
      "vendas_efetivadas": 0
    },
    "jogador2": {
      "vendedor_nome": "NOME EM MAIÚSCULAS",
      "avatar_id": "nome-do-arquivo",
      "vendas_efetivadas": 0
    }
  }
}
```

O script `gerar-config.mjs` lê as **duas primeiras linhas** de dados do Excel e preenche `jogador1` e `jogador2`. Se o Excel tiver mais linhas, ignorar as demais (este é um duelo X1).

### 5.3 Assets dos Personagens
- Caminho: `public/assets/{avatar_id}.png`
- O frontend monta a URL dinamicamente: `/assets/${jogador.avatar_id}.png`
- Se o arquivo não existir, exibir placeholder `/assets/default.png`

---

## 6. Guia de Estilo — Manual de Marca

### 6.1 Estética obrigatória: Street Fighter II / Arcade Anos 90
- Visual pixel art; bordas com efeito de tela de tubo (CRT glow sutil).
- Sem cantos arredondados excessivos — bordas retas ou levemente arredondadas (2–4 px).
- Fundo: preto profundo (`#0a0a0a`) com gradiente sutil de cena de luta.

### 6.2 Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `arcade-black` | `#0a0a0a` | Fundo principal |
| `arcade-yellow` | `#FFD700` | Barra de HP cheia, destaque primário |
| `arcade-red` | `#FF2020` | HP crítico (≤ 30%), alertas |
| `arcade-green` | `#00FF41` | Vitória, "PERFECT" |
| `arcade-blue` | `#1E90FF` | Jogador 2 (lado direito) |
| `arcade-white` | `#F0F0F0` | Textos principais |
| `arcade-gray` | `#3a3a3a` | Segmentos de HP vazios |
| `arcade-orange` | `#FF8C00` | HP médio (31%–60%) |

Configurar esses tokens em `tailwind.config.js` → `theme.extend.colors`.

### 6.3 Tipografia
- Fonte principal: **"Press Start 2P"** (Google Fonts — pixel art) para nomes, placar e textos de destaque.
- Fonte secundária: **monospace do sistema** para informações auxiliares.
- Tamanhos mínimos para TV: nomes `text-4xl`, placar `text-6xl`, HP labels `text-2xl`.

### 6.4 Layout da Tela Principal
```
┌──────────────────────────────────────────────────────────────────┐
│                    DUELO DE VENDEDORES · VITRINE                  │
│                         [barra de título]                         │
├──────────────────┬───────────┬───────────────────────────────────┤
│   JOGADOR 1      │    VS     │              JOGADOR 2             │
│   [avatar]       │  [ícone]  │              [avatar]              │
│   [nome]         │           │              [nome]                │
│   [HP bar ←]     │           │              [→ HP bar]            │
│   [placar]       │           │              [placar]              │
└──────────────────┴───────────┴───────────────────────────────────┘
```

- Barra de HP do Jogador 1: cresce da **esquerda para a direita** (`→`).
- Barra de HP do Jogador 2: cresce da **direita para a esquerda** (`←`), espelhada.
- O "VS" central nunca se move — é âncora visual fixa.

### 6.5 Efeitos Visuais (Framer Motion)
- **Novo segmento HP preenchido:** `scale: [1, 1.3, 1]` + flash de cor por 300 ms.
- **Vitória (K.O.):** overlay em fade-in com `scale: [0.5, 1.1, 1]` + texto piscando com `opacity: [0, 1]` em loop.
- **Transição de estado:** crossfade suave (300 ms) entre cenas.
- Proibido usar animações CSS puras quando Framer Motion puder fazer o mesmo.

---

## 7. Estrutura de Arquivos Esperada

```
duelo-de-vendedores/
├── public/
│   ├── assets/              # Imagens dos personagens ({avatar_id}.png)
│   │   └── default.png      # Placeholder obrigatório
│   └── duelo_config.json    # Gerado por gerar-config.mjs
├── src/
│   ├── components/
│   │   ├── ArenaLayout.jsx  # Layout principal da tela de duelo
│   │   ├── HpBar.jsx        # Barra de HP segmentada com Framer Motion
│   │   ├── PlayerCard.jsx   # Avatar + nome + placar de um jogador
│   │   ├── VsIcon.jsx       # Ícone central "VS"
│   │   └── VictoryScreen.jsx# Overlay de K.O. / YOU WIN
│   ├── hooks/
│   │   └── useDueloData.js  # Lê duelo_config.json e expõe estado
│   ├── App.jsx
│   └── main.jsx
├── gerar-config.mjs         # Script de conversão Excel → JSON
├── vendas.xlsx              # Editado pelo diretor (não comitar dados reais)
├── tailwind.config.js
├── vite.config.js
├── CLAUDE.md                # Este arquivo
└── package.json
```

---

## 8. Restrições de Display (TV Corporativa)

- Resolução alvo: **1920×1080** (Full HD, fullscreen).
- Nenhum scroll permitido — tudo deve caber em uma única tela.
- Contraste mínimo WCAG AA para todos os textos sobre fundo escuro.
- Fonte mínima visível a ~3 metros: **32px** (equivale a `text-3xl` do Tailwind).
- Nenhum elemento interativo (botões, inputs) na tela do duelo — é somente leitura.

---

## 9. Regras de Desenvolvimento — Para Claude

1. **Nunca** reintroduzir CSS avulso ou arquivos `.css` globais. Todo estilo via Tailwind.
2. **Sempre** usar Framer Motion para qualquer animação nova — nunca `@keyframes` CSS puro.
3. Ao criar ou modificar componentes, verificar se `Press Start 2P` está importada no `index.html` antes de usá-la.
4. O script `gerar-config.mjs` é a **única** fonte de escrita de `duelo_config.json` — o frontend só lê.
5. Manter `vendas.xlsx` fora do `.gitignore` somente se contiver dados fictícios de exemplo.
6. Ao adicionar uma nova dependência, justificar por que nenhuma das libs já instaladas resolve o problema.
7. Componentes devem ser pequenos e de responsabilidade única. `ArenaLayout` orquestra; os filhos renderizam.
8. `useDueloData.js` deve fazer `fetch('/duelo_config.json')` com polling a cada **30 segundos** para refletir atualizações sem recarregar a página.
