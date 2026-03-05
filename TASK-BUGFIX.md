# Task: Bugfix — 2 bugs reportados pelo QA

Leia CLAUDE.md primeiro. Depois corrija os 2 bugs abaixo.

## Bug 1: Registro nao redireciona pro dashboard

**Arquivo provavel:** `src/app/(auth)/registro/page.tsx` e/ou `src/lib/auth-context.tsx`

**Problema:** Apos registro bem-sucedido (API retorna 201 com tokens), a pagina permanece em /registro. Deveria redirecionar pra /dashboard.

**Comportamento esperado:** Apos submit do formulario de registro:
1. Chamar POST /api/auth/registro
2. Receber tokens + dados do estabelecimento
3. Salvar no auth context (mesma logica do login)
4. Redirecionar pra /dashboard

**Referencia:** O fluxo de LOGIN funciona perfeitamente — provavelmente o registro nao chama a mesma logica de persistir sessao + redirect.

## Bug 2: Refresh com tokens invalidos nao redireciona pra /login

**Arquivo provavel:** `src/lib/auth-context.tsx` e/ou `src/lib/api/client.ts`

**Problema:** Se os tokens no localStorage forem invalidos (corrompidos ou expirados sem refresh), o frontend fica "preso" em /dashboard sem redirecionar pra /login.

**Cenario de reproducao:**
1. Login valido
2. Corromper accessToken e refreshToken no localStorage
3. Recarregar pagina
4. Frontend deveria detectar falha no refresh e redirecionar pra /login

**Comportamento esperado:** 
- Na hidratacao (mount do AuthContext), se os tokens forem invalidos, limpar sessao e redirecionar
- Se refresh falhar com 401, chamar onAuthExpired() que limpa estado e redireciona

**Possivel causa:** Na hidratacao do localStorage, o contexto confia cegamente nos tokens armazenados sem validar. Opcoes:
- Fazer uma chamada de validacao (ex: GET /api/auth/me ou qualquer endpoint autenticado) no mount
- Ou: deixar o interceptor 401 cuidar disso na primeira chamada real — mas garantir que o dashboard FAZ uma chamada ao montar

## Regras
- **Build tem que passar** (`npm run build`)
- Seguir ADRs
- Atualizar CLAUDE.md com estado novo
- NAO alterar testes — quem cuida de testes e o QA (Lyra)

Quando terminar:
`openclaw system event --text "Pixel corrigiu 2 bugs: registro redirect + refresh invalidation" --mode now`
