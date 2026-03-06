# Task 10 — Tela de Cobranças (Frontend)

## Objetivo
Criar a tela de cobranças replicando o padrão da tela de Membros, integrada direto com a API real (sem mock).

## IMPORTANTE: Leia antes de começar
1. Leia CLAUDE.md
2. Leia `src/app/dashboard/membros/page.tsx` — é o **template** a seguir (estrutura, padrões, componentes)
3. Leia `C:\Projetos\PixRecorrente\Analise\CONTRATOS-API.md` — seção Cobranças e endpoints
4. Leia `src/lib/api/membros.ts` — padrão do client API

## Endpoints disponíveis (backend rodando em localhost:5000)

### POST /api/cobrancas
Gera cobrança Pix para um membro.
- Body: `{ membroId: string, valor?: number, dataVencimento?: string }`
- Response 201: CobrancaDTO

### GET /api/cobrancas
Lista cobranças paginadas.
- Query: pagina, porPagina, busca (nome do membro), status (Pendente|Paga|Vencida|Cancelada), membroId?
- Response 200: `{ items: CobrancaDTO[], total, pagina, porPagina, totalPaginas }`

### GET /api/cobrancas/{id}
Detalhe de uma cobrança.
- Response 200: CobrancaDTO

### PATCH /api/cobrancas/{id}/cancelar
Cancela cobrança com status Pendente.
- Response 200: CobrancaDTO

### CobrancaDTO (shape da resposta)
```typescript
interface Cobranca {
  id: string;
  estabelecimentoId: string;
  membroId: string;
  nomeMembro: string;  // nome do membro (vem do backend)
  valor: number;
  dataVencimento: string; // YYYY-MM-DD
  status: "Pendente" | "Paga" | "Vencida" | "Cancelada";
  provedorPsp?: string;
  idCobrancaPsp?: string;
  brcode?: string;
  qrcodeUrl?: string;
  linkPagamento?: string;
  pagoEm?: string;
  valorPago?: number;
  statusNotificacao?: string;
  criadoEm: string;
  atualizadoEm: string;
}
```

## O que criar

### 1. Tipos (`src/types/index.ts`)
- Adicionar tipo `Cobranca` e `StatusCobranca`
- Adicionar tipos `CriarCobrancaBody`

### 2. Client API (`src/lib/api/cobrancas.ts`)
Seguir padrão de `src/lib/api/membros.ts`:
- `listarCobrancas(params)` — GET paginado com filtros
- `criarCobranca(body)` — POST
- `cancelarCobranca(id)` — PATCH
- Usar `apiFetchJson` do client centralizado

### 3. Página (`src/app/dashboard/cobrancas/page.tsx`)
Substituir o placeholder "Em breve" por tela funcional.

**Replicar padrão de Membros:**
- Tabela com colunas: Membro (nomeMembro), Valor (R$), Vencimento, Status, Ações
- Paginação
- Busca por nome do membro
- Filtro por status (Pendente, Paga, Vencida, Cancelada)
- Botão "Nova Cobrança" que abre modal
- Modal de criação: select de membro (pode ser input text com membroId por enquanto), valor (opcional), data vencimento (opcional)
- Ação de cancelar no menu de 3 pontinhos (só pra status Pendente)
- Badge colorido pro status (Pendente=amarelo, Paga=verde, Vencida=vermelho, Cancelada=cinza)

### 4. Sidebar
Atualizar o link "Cobranças" na sidebar pra não mostrar "Em breve" — deve ser um link normal como Membros.

## Regras
- Integrar direto com API real (SEM mock)
- Dark mode obrigatório (seguir padrão existente)
- Responsivo (seguir padrão existente)
- `npm run build` deve compilar sem erros
- Valores monetários formatados como BRL (R$ 129,90)

## Não fazer
- NÃO mostrar QR Code (isso vem depois)
- NÃO implementar edição de cobrança (não existe endpoint)
- NÃO criar páginas novas além da de cobranças
