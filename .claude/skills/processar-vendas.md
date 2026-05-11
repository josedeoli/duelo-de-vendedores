---
name: processar-vendas
description: Skill especializada em ler planilhas XLS/CSV de vendas e converter para o formato JSON do Duelo de Vendedores.
disable-model-invocation: false
---

# Skill: Processamento de Dados (XLS -> JSON)

Esta skill deve ser invocada sempre que um novo arquivo de dados for fornecido ou quando o usuário pedir para "atualizar o ranking".

## 1. Mapeamento de Colunas Esperadas
Ao ler o arquivo, identifique e valide as seguintes colunas:
- **Vendedor**: Nome do competidor.
- **Vendas Próprias**: Quantidade (vale 3 pontos cada).
- **Vendas Compartilhadas**: Quantidade (vale 2 pontos cada).
- **Comparecimentos**: Quantidade de visitas geradas (vale 1 ponto cada).
- **Fechamentos**: Usado para calcular a Taxa de Conversão.

## 2. Lógica de Transformação
Para cada linha da planilha, calcule:
1. **Pontuação Total**: `(Vendas Próprias * 3) + (Vendas Compartilhadas * 2) + (Comparecimentos * 1)`.
2. **Taxa de Conversão**: `(Fechamentos / Comparecimentos) * 100`.
3. **Status de Bônus**: Se `Taxa de Conversão >= 50%`, marcar como `bonus_ativo: true`.

## 3. Formato de Saída (JSON)
Gere ou atualize o arquivo `src/data/vendas.json` seguindo esta estrutura:

```json
{
  "ultima_atualizacao": "ISO_DATE",
  "vendedores": [
    {
      "nome": "João",
      "vendas_proprias": 10,
      "vendas_compartilhadas": 5,
      "comparecimentos": 20,
      "fechamentos": 12,
      "pontos": 60,
      "conversao": "60.00%",
      "bonus_ativo": true,
      "status": "vitoria"
    }
  ]
}
```

### Campos calculados

| Campo | Fórmula |
|---|---|
| `pontos` | `(vendas_proprias * 3) + (vendas_compartilhadas * 2) + (comparecimentos * 1)` |
| `conversao` | `(fechamentos / comparecimentos * 100).toFixed(2) + "%"` — retornar `"0.00%"` se `comparecimentos === 0` |
| `bonus_ativo` | `true` se `conversao >= 50%`, caso contrário `false` |
| `status` | `"vitoria"` para o 1º lugar em `pontos`, `"derrota"` para os demais |

## 4. Validações Obrigatórias

Antes de transformar, verifique:
- Todas as 5 colunas obrigatórias estão presentes (erro se faltar alguma).
- Os campos numéricos (`Vendas Próprias`, `Vendas Compartilhadas`, `Comparecimentos`, `Fechamentos`) são não-negativos.
- Pelo menos um vendedor tem `pontos > 0` (alertar se todos forem zero).

Se uma coluna obrigatória estiver ausente, interrompa e informe o nome exato da coluna faltante.

## 5. Passos de Execução

1. Ler o arquivo fornecido com a biblioteca `xlsx` (`sheet_to_json` com `defval: 0`).
2. Validar as colunas (passo 4).
3. Para cada linha, calcular `pontos`, `conversao` e `bonus_ativo`.
4. Ordenar o array `vendedores` por `pontos` decrescente.
5. Atribuir `status`: o primeiro recebe `"vitoria"`, os demais `"derrota"`.
6. Montar o objeto final com `ultima_atualizacao: new Date().toISOString()`.
7. Gravar em `src/data/vendas.json` (criar o diretório se não existir).
8. Confirmar ao usuário: quantidade de vendedores processados e quem está em 1º lugar.
