# Pixel — Licoes e Memoria

## ADRs (Architecture Decision Records)
- **OBRIGATORIO:** Antes de tomar qualquer decisao arquitetural, buscar em `C:\Projetos\PixRecorrente\Analise\adrs\` se ja existe ADR sobre o tema
- Se existir, seguir a decisao documentada
- Se nao existir e precisar tomar decisao nova, criar ADR seguindo o template em `adrs/TEMPLATE.md`
- Numerar sequencialmente: ADR-001, ADR-002, etc.
- Nome: `ADR-XXX-descricao-curta.md`

## Licoes de Sessoes Anteriores
- Sempre ler CONTRATOS-API.md antes de consumir qualquer endpoint
- Nunca inventar contratos — se nao esta documentado, perguntar pra Vox
- Dark mode em todo componente novo (dark: variants)
- Dados em /data/, nao hardcoded em componentes
- Build (npm run build) tem que passar antes de reportar conclusao
- TypeScript strict, sem any
