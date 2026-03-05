# Task: Criar ADRs retroativas

Voce e o Pixel, dev frontend do PixRecorrente.

## Objetivo
Ler o arquivo `C:\Projetos\PixRecorrente\Analise\ESTRATEGIA-EXECUCAO.md` (secao "Decisoes Tomadas" e "Padroes Adotados") e criar ADRs para TODAS as decisoes arquiteturais de frontend que foram tomadas.

## Como fazer
1. Leia o template em `C:\Projetos\PixRecorrente\Analise\adrs\TEMPLATE.md`
2. Leia ESTRATEGIA-EXECUCAO.md para ver as decisoes existentes
3. Crie uma ADR por decisao na pasta `C:\Projetos\PixRecorrente\Analise\adrs\`
4. Numere sequencialmente a partir de ADR-100 (para nao colidir com as do Forge que comecam em ADR-001)
5. Nome do arquivo: `ADR-XXX-descricao-curta.md` (sem acentos)
6. Preencha todos os campos do template: Contexto, Decisao, Alternativas, Consequencias
7. Foque nas decisoes de FRONTEND: Next.js App Router, Tailwind v4, dark mode obrigatorio, Server Components por padrao, dados em /data/, pagina generalizada (nao so academias), mock auth (temporario), TypeScript strict, CONTRATOS-API.md como source of truth

## Importante
- Decisor de todas estas ADRs foi "Dudu" (o product owner) com input da Vox
- Data: 2026-03-04 para todas (quando foram tomadas)
- Status: Aceita
- Seja conciso mas completo — cada ADR deve ser compreensivel isoladamente
