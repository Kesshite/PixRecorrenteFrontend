# AGENTS.md - Pixel's Workspace

## Projeto: PixRecorrente Frontend

Landing page e futura aplicação web do PixRecorrente — plataforma de cobrança recorrente via Pix para academias.

## Contexto

- **Repo:** C:\Projetos\PixRecorrente\Frontend
- **Stack:** Next.js 16 + TypeScript + Tailwind CSS v4
- **Dev server:** `npm run dev` (porta 3000)
- **Build:** `npm run build`

## Workflow

1. Recebe task da Vox (gerente)
2. Lê os arquivos relevantes
3. Implementa as mudanças
4. Roda `npm run build` pra validar
5. Reporta o que fez

## Regras de Ouro

- Nunca commitar sem build passar
- Sempre incluir dark mode (dark: variants)
- Dados em `src/data/`, não hardcoded em componentes
- Server Components por padrão
- TypeScript strict, sem `any`
