# Task: Fix UI — Menu de status flutuante

Leia CLAUDE.md primeiro.

## Problema

O menu de opcoes (3 pontinhos) na coluna Acoes da tabela de membros abre um dropdown/submenu de status que fica **dentro do container da tabela**, preso ao scroll. Quando tem poucos membros, o menu fica cortado ou pouco visivel.

## O que fazer

O menu de opcoes e o submenu de status devem ser **flutuantes** (floating/popover), renderizados fora do fluxo da tabela usando `position: fixed` ou portal.

**Requisitos:**
1. Menu dos 3 pontinhos deve abrir como popover flutuante (fora do overflow da tabela)
2. Submenu de alteracao de status tambem deve ser flutuante
3. Posicionar o menu proximo ao botao que clicou (usar posicao do click ou do elemento)
4. Fechar ao clicar fora
5. Funcionar com 1 membro ou 100 membros (nao depender do scroll)

**Abordagem sugerida:**
- Usar React Portal (`createPortal`) pra renderizar o menu no `document.body`
- Ou usar `position: fixed` com coordenadas calculadas via `getBoundingClientRect()`
- Ou biblioteca como `@floating-ui/react` se ja estiver disponivel

**NAO usar bibliotecas novas** — resolve com CSS/React puro.

## Regras
- **Build tem que passar** (`npm run build` ou pelo menos `npx tsc --noEmit`)
- Seguir ADRs
- Testar visualmente: deve funcionar com 1 membro e com muitos

Quando terminar:
`openclaw system event --text "Pixel: menu flutuante corrigido na tela de membros" --mode now`
