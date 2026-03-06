# Task 10 Fix — Dropdown de Membro no Modal de Nova Cobrança

## Problema
O modal "Nova Cobrança" pede pro usuário digitar o UUID do membro. Isso é inaceitável.
Precisa ser um dropdown com busca (searchable select).

## O que fazer

### 1. Substituir o campo "ID do Membro" por um dropdown com busca
No modal de "Nova Cobrança" em `src/app/dashboard/cobrancas/page.tsx`:

- Remover o input de texto "UUID do membro"
- Criar um combobox/dropdown searchable:
  - Ao abrir o modal, carregar os primeiros 10 membros ativos via `GET /api/membros?porPagina=10&status=Ativo`
  - Campo de busca no topo do dropdown — conforme digita, chama `GET /api/membros?porPagina=10&status=Ativo&busca=texto` (debounce 300ms)
  - Cada opção mostra: **Nome** + CPF (se tiver) + Plano (se tiver)
  - Ao selecionar, preenche o membroId internamente e mostra o nome selecionado
  - Se o membro tem valorMensal e diaVencimento, preencher automaticamente os campos Valor e Data de Vencimento como sugestão (editável)
- Usar a função `listarMembros` de `src/lib/api/membros.ts` que já existe

### 2. Melhorar labels
- "Valor (R$)" → manter, mas mostrar placeholder "129,90" (valor do membro selecionado)
- "Data de Vencimento" → manter, mas auto-preencher com próximo vencimento baseado em diaVencimento

## Regras
- O dropdown deve ser bonito, seguir dark mode, e ser responsivo
- Debounce de 300ms na busca
- Só mostrar membros com status Ativo (não faz sentido cobrar Cancelado/Pausado)
- `npm run build` sem erros
- Leia ADR-015 em `Analise/adrs/ADR-015-paginacao-e-selecao-de-entidades.md`

## Não fazer
- NÃO alterar a API (os endpoints já existem)
- NÃO instalar bibliotecas externas (react-select, etc) — implementar com HTML/CSS/React nativo
- NÃO alterar outras telas
