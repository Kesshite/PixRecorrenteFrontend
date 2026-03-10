# Task 13 — Dashboard Financeiro

## Objetivo
Transformar a página `/dashboard` (atualmente com cards placeholder "Em breve") num dashboard financeiro real com dados da API de transações.

## O que construir

### 1. Cards de resumo (topo da página)
Usar a API `GET /api/transacoes/resumo` (já existe e funciona):
- **Total Recebido** — `totalRecebido` (verde/emerald)
- **Total Estornos** — `totalEstornos` (vermelho)
- **Saldo Líquido** — `saldo` (azul ou emerald)
- **Transações no Período** — `quantidadeTransacoes`

Adicionar seletor de período (mês atual, últimos 30 dias, últimos 3 meses, personalizado com de/até).

### 2. Gráfico de receita mensal
- Gráfico de barras ou área mostrando receita por mês (últimos 6 meses)
- **NOTA:** A API atual retorna resumo de um período, não por mês. Pode ser necessário fazer múltiplas chamadas (uma por mês) ou chamar a listagem e agrupar no frontend.
- Se isso for ineficiente, anote que precisa de endpoint novo e eu peço pro Forge.

### 3. Indicadores rápidos
- **Membros ativos** — usar `GET /api/membros?status=Ativo&porPagina=1` (pegar o `total`)
- **Cobranças pendentes** — usar `GET /api/cobrancas?status=Pendente&porPagina=1` (pegar o `total`)
- **Taxa de inadimplência** — membros Inadimplente / total de membros (2 chamadas ao GET /api/membros)

### 4. Lista de cobranças recentes
- Últimas 5 cobranças (GET /api/cobrancas?porPagina=5) com status badge
- Link "Ver todas" → /dashboard/cobrancas

### 5. Lista de transações recentes
- Últimas 5 transações (GET /api/transacoes?porPagina=5)
- Link "Ver todas" → /dashboard/transacoes

## Biblioteca de gráficos
Usar **recharts** (já é padrão em projetos Next.js, leve, suporta SSR):
```bash
npm install recharts
```

## Referência
- API de transações: `C:\Projetos\PixRecorrente\Analise\CONTRATOS-API.md` (seção Transações)
- API de membros: mesma pasta (seção Membros)
- API de cobranças: mesma pasta (seção Cobranças)
- ADRs: leia `C:\Projetos\PixRecorrente\Analise\ADRs\indice.md` PRIMEIRO (só abra ADR completa se necessário)
- Padrão visual: olhe as telas existentes em `src/app/dashboard/` (membros, cobrancas, transacoes, configuracoes)

## Regras
- Dark mode obrigatório em tudo
- HTTP client centralizado (`src/lib/api/client.ts`)
- TypeScript strict, sem `any`
- `npm run build` tem que passar com 0 erros no final
- Se precisar de endpoint novo no backend, NÃO invente — anote no final do arquivo quais endpoints faltam

## Output
- Código implementado diretamente nos arquivos
- Rodar `npm run build` e confirmar 0 erros
- Se faltar endpoint, adicionar seção "## Endpoints Necessários" no final deste arquivo com a especificação
