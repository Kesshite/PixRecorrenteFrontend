# CLAUDE.md - PixRecorrente Frontend

## Projeto
Frontend do **PixRecorrente** — plataforma SaaS de cobrança recorrente via Pix para negócios com mensalistas.

## Stack
- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript strict
- Tailwind CSS v4 (com @custom-variant dark)
- lucide-react para ícones
- clsx para classes condicionais

## Estrutura
```
src/
├── app/                    → Pages e layouts (App Router)
│   ├── (landing)/          → Landing page (não autenticado)
│   ├── (auth)/
│   │   ├── login/          → Tela de login
│   │   └── registro/       → Tela de registro
│   └── dashboard/          → Área autenticada
│       ├── membros/        → CRUD de membros (integrado API)
│       ├── cobrancas/      → CRUD de cobranças (integrado API)
│       └── configuracoes/  → Perfil do estabelecimento (integrado API)
├── components/
│   ├── sections/           → Seções da landing page (hero, features, pricing, etc.)
│   ├── layout/             → Header, Footer
│   ├── membros/            → Componentes de membros (modal, delete-dialog, status-badge)
│   ├── ui/                 → Button, Card, Modal, Badge
│   └── signup-modal.tsx    → Modal de lista de espera
├── data/                   → Dados estáticos e mocks
├── lib/
│   ├── api/                → HTTP clients reais (auth, client, membros, cobrancas, estabelecimento)
│   └── contexts/           → AuthContext, providers
└── types/                  → Tipos TypeScript
```

## Convenções
- **Server Components por padrão** — "use client" só com state/effects/handlers
- **Dados em /data/** — componentes não devem ter arrays hardcoded
- **Dark mode em tudo** — sempre incluir dark: variants
- **Copy honesto** — sem números inventados ou social proof fake
- **Build tem que passar** — sempre rodar `npm run build` ao final
- **TypeScript strict** — sem `any`
- **NUNCA pedir UUID/ID pro usuário** — sempre usar dropdown com busca (ADR-015)
- Quando uma entidade referencia outra (ex: Cobrança→Membro), usar dropdown/combobox searchable
- Dropdown deve: carregar primeiros N resultados, filtrar conforme digita (debounce ~300ms), mostrar nome legível

## Paleta
- Primária: emerald/green (Pix, dinheiro, pagamentos)
- Dark mode: slate backgrounds
- Status badges: verde=Ativo, amarelo=Pausado, vermelho=Inadimplente, cinza=Cancelado

## Auth
- Login e registro integrados com API real (`http://localhost:5000/api`)
- `src/lib/api/client.ts` — HTTP client centralizado com auto-refresh de 401
- `src/lib/api/auth.ts` — chamadas reais para /auth/login, /auth/registro, /auth/logout, /auth/refresh
- AccessToken em memória (React state) + refreshToken em localStorage
- Auto-refresh: 401 → tenta /auth/refresh → retry; falha → logout + redirect /login
- Erros da API propagados com mensagem amigável (ApiError, NetworkError)

## API Clients
- `src/lib/api/client.ts` — base HTTP com interceptor de token e auto-refresh
- `src/lib/api/auth.ts` — registro, login, refresh, logout
- `src/lib/api/membros.ts` — CRUD completo (6 endpoints)
- `src/lib/api/cobrancas.ts` — CRUD + cancelamento (4 endpoints)
- `src/lib/api/estabelecimento.ts` — GET + PUT perfil
- `src/lib/api/transacoes.ts` — GET listagem + GET resumo (read-only)

## Contratos de API (OBRIGATÓRIO)
Arquivo compartilhado: `C:\Projetos\PixRecorrente\Analise\CONTRATOS-API.md`

**Antes de consumir qualquer endpoint, LEIA esse arquivo.** Ele é a fonte da verdade. NUNCA invente contratos.

## Comandos
- Dev: `npm run dev` (porta 3000)
- Build: `npm run build`
- Lint: `npm run lint`

## ADRs (Architecture Decision Records)

Pasta compartilhada: `C:\Projetos\PixRecorrente\Analise\ADRs\`
Template: `TEMPLATE.md` na mesma pasta.

**⚠️ SEMPRE leia `Analise/ADRs/indice.md` PRIMEIRO.** O índice contém o resumo de todas as ADRs. Só abra a ADR completa se a task exigir detalhes daquela decisão específica. Isso economiza tokens.

**Regras:**
1. Antes de tomar qualquer decisão arquitetural, leia o índice de ADRs
2. Se existir ADR sobre o tema, siga a decisão documentada
3. Se não existir e você precisar tomar uma decisão nova, crie uma ADR seguindo o template
4. Numere sequencialmente: ADR-001, ADR-002, etc.
5. Nome do arquivo: `ADR-XXX-descricao-curta.md` (sem acentos)
6. **Atualize o indice.md** ao criar/alterar uma ADR

## Estado Atual (2026-03-09)
- **Landing page:** completa, generalizada, dark mode, responsiva, signup modal (lista de espera)
- **Login/Registro:** integrado com API real, erros de API e rede exibidos, auto-refresh de token
- **Dashboard:** sidebar, header, dark mode toggle, responsivo
- **Membros:** CRUD completo integrado com API real — tabela, paginação, busca, filtros, modais (cadastro/edição/exclusão), alteração de status com transições válidas, reativação de cancelados
- **Cobranças:** CRUD completo integrado com API real — tabela, paginação, busca, filtros, modal com dropdown searchable de membro (auto-preenche valor/vencimento), cancelamento
- **Configurações:** formulário completo integrado com API real — dados do estabelecimento, chave Pix, plano/status readonly, loading skeleton, validação client-side, toast
- **Transações:** extrato financeiro read-only integrado com API real — cards resumo (recebido, estornos, saldo, quantidade), tabela paginada, filtro por tipo, badges coloridos
