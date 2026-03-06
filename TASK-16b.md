# Task 16b — Tela de Configurações do Estabelecimento (Frontend)

## Objetivo
Substituir o placeholder "Em breve" em /dashboard/configuracoes por um formulário real de perfil do estabelecimento, integrado com a API.

## IMPORTANTE: Leia antes de começar
1. Leia CLAUDE.md
2. Leia `C:\Projetos\PixRecorrente\Analise\CONTRATOS-API.md` — seção Estabelecimento (GET + PUT)
3. Leia `src/app/dashboard/membros/page.tsx` — referência de padrão visual
4. Leia ADR-015 em `Analise/adrs/ADR-015-paginacao-e-selecao-de-entidades.md`

## Endpoints disponíveis (backend rodando em localhost:5000)

### GET /api/estabelecimento
Retorna perfil do estabelecimento autenticado.
- Auth: Bearer JWT
- Response 200:
```json
{
  "id": "string (UUID)",
  "nome": "string",
  "documento": "string",
  "email": "string",
  "telefone": "string | null",
  "chavePix": "string | null",
  "plano": "string | null",
  "status": "string",
  "logotipo": "string | null",
  "regraCobranca": "string | null",
  "criadoEm": "string",
  "atualizadoEm": "string"
}
```

### PUT /api/estabelecimento
Atualiza perfil.
- Auth: Bearer JWT
- Body:
```json
{
  "nome": "string (required)",
  "documento": "string (required)",
  "telefone": "string | null",
  "chavePix": "string | null",
  "logotipo": "string | null"
}
```
- Response 200: EstabelecimentoDTO atualizado

## O que criar

### 1. Client API (`src/lib/api/estabelecimento.ts`)
- `obterEstabelecimento()` — GET
- `atualizarEstabelecimento(body)` — PUT
- Usar `apiFetchJson` do client centralizado

### 2. Tipos (`src/types/index.ts`)
- Adicionar tipo `Estabelecimento` e `AtualizarEstabelecimentoBody`

### 3. Página (`src/app/dashboard/configuracoes/page.tsx`)
Substituir o placeholder por formulário funcional:

**Layout:**
- Título "Configurações" com subtítulo "Gerencie os dados do seu estabelecimento"
- Card com formulário dividido em seções:

**Seção 1 — Dados do Estabelecimento:**
- Nome (input text, obrigatório)
- Documento CNPJ/CPF (input text, obrigatório)
- Email (input text, readonly/disabled, com visual de "não editável")
- Telefone (input text, opcional)

**Seção 2 — Pix:**
- Chave Pix (input text, opcional, placeholder "CPF, CNPJ, email, celular ou chave aleatória")

**Seção 3 — Plano:**
- Mostrar plano atual (readonly, badge estilizado)
- Status da conta (readonly, badge)

**Botão "Salvar Alterações":**
- Ao clicar, chama PUT /api/estabelecimento
- Loading state no botão
- Toast de sucesso/erro

**Ao carregar a página:**
- Chama GET /api/estabelecimento
- Preenche o formulário com os dados atuais
- Loading skeleton enquanto carrega

## Regras
- Dark mode obrigatório
- Responsivo
- Campos readonly devem ter visual distinto (fundo mais escuro, cursor not-allowed)
- Validação client-side: nome e documento obrigatórios
- `npm run build` sem erros
- NUNCA pedir UUID pro usuário (ADR-015)

## Não fazer
- NÃO implementar upload de logotipo (só campo URL por enquanto)
- NÃO implementar edição de régua de cobrança (futuro)
- NÃO alterar a sidebar ou outras páginas
