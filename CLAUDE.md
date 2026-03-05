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
│   ├── (public)/           → Landing page (nao autenticado)
│   ├── login/              → Tela de login
│   ├── registro/           → Tela de registro
│   └── dashboard/          → Area autenticada
│       ├── membros/        → Tela de membros (CRUD)
│       ├── cobrancas/      → Placeholder
│       └── configuracoes/  → Placeholder (404 ainda)
├── components/
│   ├── sections/           → Secoes da landing page
│   ├── layout/             → Header, footer, sidebar
│   └── ui/                 → Button, Card, Modal, Badge
├── data/                   → Dados estaticos e mocks
├── lib/                    → Contexts, providers, utils
└── types/                  → Tipos TypeScript
```

## Convenções
- **Server Components por padrao** — "use client" so com state/effects/handlers
- **Dados em /data/** — componentes nao devem ter arrays hardcoded
- **Dark mode em tudo** — sempre incluir dark: variants
- **Copy honesto** — sem numeros inventados ou social proof fake
- **Build tem que passar** — sempre rodar `npm run build` ao final
- **TypeScript strict** — sem `any`

## Paleta
- Primaria: emerald/green (Pix, dinheiro, pagamentos)
- Dark mode: slate backgrounds
- Status badges: verde=Ativo, amarelo=Pausado, vermelho=Inadimplente, cinza=Cancelado

## Auth (estado atual)
- Login e registro com **mock** (qualquer credencial funciona)
- AuthContext com token em memoria
- Rotas protegidas via middleware/context
- **Pendente:** integrar com API real (Task 6a), auto-refresh de token (Task 6b)

## Contratos de API (OBRIGATÓRIO)
Arquivo compartilhado: `C:\Projetos\PixRecorrente\Analise\CONTRATOS-API.md`

**Antes de consumir qualquer endpoint, LEIA esse arquivo.** Ele e a fonte da verdade. NUNCA invente contratos.

## Comandos
- Dev: `npm run dev` (porta 3000)
- Build: `npm run build`
- Lint: `npm run lint`

## ADRs (Architecture Decision Records)

Pasta compartilhada: `C:\Projetos\PixRecorrente\Analise\adrs\`
Template: `TEMPLATE.md` na mesma pasta.

**Regras:**
1. Antes de tomar qualquer decisao arquitetural, busque em `Analise/adrs/` se ja existe ADR sobre o tema
2. Se existir, siga a decisao documentada
3. Se nao existir e voce precisar tomar uma decisao nova, crie uma ADR seguindo o template
4. Numere sequencialmente: ADR-001, ADR-002, etc.
5. Nome do arquivo: `ADR-XXX-descricao-curta.md` (sem acentos)

## Estado Atual (2026-03-05)
- Landing page: completa, generalizada, dark mode, responsiva
- Login/Registro: mock funcional
- Dashboard: sidebar, header, dark mode toggle
- Membros: **CRUD completo** — tabela, paginacao, busca, filtros, modais (cadastro/edicao/exclusao), alteracao de status com transicoes validas, mock service in-memory
- Cobrancas: placeholder
- Configuracoes: rota nao existe (404)
