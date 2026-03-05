# Task: Integrar Tela de Membros com API Real

Leia CLAUDE.md primeiro. Depois execute esta task.

## Contexto

A tela de membros (/dashboard/membros) funciona com dados mock in-memory. Agora precisa consumir a API real do backend em http://localhost:5000/api.

**IMPORTANTE:** Leia `C:\Projetos\PixRecorrente\Analise\CONTRATOS-API.md` (secao Membros) antes de comecar. E a fonte da verdade dos endpoints.

## Endpoints disponiveis (resumo)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | /api/membros | Criar membro |
| GET | /api/membros/:id | Buscar membro por ID |
| PUT | /api/membros/:id | Atualizar membro (update completo) |
| DELETE | /api/membros/:id | Remover membro |
| GET | /api/membros?pagina=&porPagina=&busca=&status= | Listar com paginacao e filtros |
| PATCH | /api/membros/:id/status | Alterar status (transicoes validas) |

**OBS sobre status:** A API aceita enum **numerico** no PATCH status (1=Ativo, 2=Inadimplente, 3=Pausado, 4=Cancelado), mas retorna numerico nos objetos tambem. O CONTRATOS-API.md diz string — use numerico por enquanto e documente a divergencia.

## O que fazer

1. Criar `src/lib/api/membros.ts` — client HTTP para todos os 6 endpoints (usar o `apiFetch`/`apiFetchJson` de `client.ts`)
2. Substituir o mock service na tela de membros pelas chamadas reais
3. Manter toda a UI existente (tabela, paginacao, busca, filtros, modais)
4. Tratar erros da API (422 validacao, 409 CPF duplicado, 404, 401)
5. Paginacao real (usar query params pagina/porPagina)
6. Busca real (usar query param busca)
7. Filtro por status real (usar query param status)

## Mapeamento de status (enum numerico)

```typescript
enum StatusMembro {
  Ativo = 1,
  Inadimplente = 2,
  Pausado = 3,
  Cancelado = 4,
}
```

## Cuidados

- O token JWT ja e injetado automaticamente pelo `apiFetch` (via auth context)
- Ao criar/editar membro, mostrar erros da API no formulario (ex: "CPF invalido", "CPF ja cadastrado")
- Ao deletar, pedir confirmacao antes
- Ao alterar status, usar PATCH /:id/status com o enum numerico
- Loading states: mostrar indicador enquanto carrega

## Se faltar algum endpoint

Se voce precisar de algo que NAO existe nos contratos (ex: bulk delete, export CSV):
1. **NAO invente o endpoint**
2. Escreva em `DUVIDAS.md`: qual endpoint falta e por que
3. Notifique: `openclaw system event --text "Pixel: endpoint faltando, ver DUVIDAS.md" --mode now`
4. Continue com o que tem — o que nao tiver endpoint fica desabilitado na UI

## Regras

- **Build tem que passar** (`npm run build`)
- Seguir ADRs em `C:\Projetos\PixRecorrente\Analise\adrs\`
- Atualizar CLAUDE.md com estado novo ao terminar
- Se tomar decisao arquitetural nova, criar ADR (serie 100+)

Quando terminar:
`openclaw system event --text "Pixel concluiu integracao membros com API real (CRUD completo)" --mode now`
