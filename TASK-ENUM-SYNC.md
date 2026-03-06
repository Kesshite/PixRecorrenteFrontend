# Task: Remover mapeamento numérico de enums e usar strings direto

## Problema
O backend vai passar a serializar enums como strings (ex: `"Ativo"`, `"Pausado"`).
Atualmente `src/lib/api/membros.ts` tem um mapeamento numérico ERRADO:
```typescript
// ERRADO - ordem trocada!
const NUM_TO_STATUS = { 1: "Ativo", 2: "Inadimplente", 3: "Pausado", 4: "Cancelado" };
```
A ordem correta no backend é: `1=Ativo, 2=Pausado, 3=Cancelado, 4=Inadimplente`.
Mas com a correção do backend, os enums virão como STRINGS, não números.

## O que fazer

1. Em `src/lib/api/membros.ts`:
   - Remover `NUM_TO_STATUS`, `STATUS_TO_NUM`, `StatusNumerico`
   - Remover `MembroRaw`, `normalizeStatus`, `normalizeMembro`
   - Os endpoints agora recebem e enviam `StatusMembro` como string diretamente
   - O `alterarStatusMembro` deve enviar `{ "status": "Pausado" }` (string), não `{ "status": 3 }` (número)
   - Remover o comentário sobre "divergência documentada"

2. Remover `DUVIDAS.md` se existir e só tiver esse assunto.

3. Verificar que os tipos em `src/types/index.ts` já estão corretos:
   ```typescript
   export type StatusMembro = "Ativo" | "Pausado" | "Cancelado" | "Inadimplente";
   ```

4. Rodar `npm run build` e garantir zero erros.

## Escopo
- APENAS limpar o mapeamento numérico em membros.ts
- NÃO alterar lógica de UI, componentes, ou estilos
- NÃO alterar outros arquivos além do necessário
