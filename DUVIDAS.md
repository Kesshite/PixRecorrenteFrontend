# DUVIDAS.md — Divergências e Endpoints Faltando

## Divergência: StatusMembro — enum numérico vs. string

**Endpoint afetado:** Todos os endpoints de membros (GET, POST, PUT, PATCH status)

**Contrato (CONTRATOS-API.md):** `status` é `string` — `"Ativo" | "Pausado" | "Cancelado" | "Inadimplente"`

**Comportamento real do backend:**
- O backend retorna `status` como enum **numérico** nos objetos `MembroDTO`
- O PATCH `/api/membros/:id/status` aceita `status` como enum **numérico**

**Mapeamento numérico:**
| Número | String |
|--------|--------|
| 1 | Ativo |
| 2 | Inadimplente |
| 3 | Pausado |
| 4 | Cancelado |

**Como tratamos no frontend:**
- Ao receber dados da API, convertemos número → string (função `normalizeStatus` em `src/lib/api/membros.ts`)
- Ao enviar PATCH status, convertemos string → número (usando `STATUS_TO_NUM`)
- O contrato de query param (`?status=Ativo`) ainda usa string (não foi testado com numérico)

**Ação necessária:** Atualizar `CONTRATOS-API.md` para refletir o enum numérico, ou corrigir o backend para retornar strings.
