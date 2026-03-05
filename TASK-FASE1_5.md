# Task: Fase 1.5 — Integração e Polish

Leia CLAUDE.md primeiro. Depois execute as 3 sub-tasks abaixo em ordem.

## Sub-task 6a: Integrar Auth Real

Substituir o mock de autenticação pelo backend real rodando em http://localhost:5000.

**Endpoints (ver Analise/CONTRATOS-API.md para detalhes):**
- POST /api/auth/registro — criar conta
- POST /api/auth/login — retorna accessToken + refreshToken
- POST /api/auth/refresh — renova token
- POST /api/auth/logout — invalida refresh token

**O que fazer:**
1. Criar um service/client HTTP (ex: `src/lib/api.ts`) centralizado
2. Substituir o mock auth context por chamadas reais
3. Guardar accessToken em memória (estado React) e refreshToken em httpOnly cookie ou localStorage
4. Tratar erros de auth (401, credenciais inválidas, etc.)
5. Manter fallback: se backend estiver offline, mostrar mensagem amigável (não crashar)

## Sub-task 6b: Auto-refresh de Token

1. Criar interceptor no client HTTP que detecta 401
2. Tentar refresh automaticamente usando o refreshToken
3. Se refresh falhar, redirecionar pra /login
4. Retry da request original após refresh bem-sucedido

## Sub-task 6c: Placeholder /dashboard/configuracoes

1. Criar a rota /dashboard/configuracoes
2. Página simples com título "Configurações" e mensagem "Em breve"
3. Deve seguir o layout do dashboard (sidebar, header, dark mode)

## Regras

- **Build tem que passar** (`npm run build`) ao final de CADA sub-task
- Seguir ADRs em `C:\Projetos\PixRecorrente\Analise\adrs\`
- Atualizar CLAUDE.md com o estado novo ao terminar

## IMPORTANTE: Dúvidas Arquiteturais

Se encontrar qualquer decisão arquitetural que não esteja coberta por uma ADR existente:
1. **NÃO decida sozinho**
2. Escreva a dúvida em `DUVIDAS.md` na raiz do projeto (crie o arquivo se não existir)
3. Formato: `## Dúvida X: [titulo]\n[contexto + opções que você vê]\n`
4. **PARE a execução** e notifique com: `openclaw system event --text "Pixel parou: duvida arquitetural em DUVIDAS.md" --mode now`
5. Só continue quando receber instrução

Quando terminar tudo com sucesso:
`openclaw system event --text "Pixel concluiu Fase 1.5: auth real + refresh + configuracoes placeholder" --mode now`
