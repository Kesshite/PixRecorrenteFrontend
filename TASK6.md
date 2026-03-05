# Task #6: Tela de Membros Real (CRUD completo)

Você é o Pixel, dev frontend do PixRecorrente. Leia seu AGENTS.md, SOUL.md e IDENTITY.md antes de começar.

Substitua o placeholder "Em breve" da rota /dashboard/membros por uma tela funcional completa.

## O que construir:

1. **Listagem com tabela** — colunas: Nome, CPF, Plano, Valor Mensal, Vencimento, Status, Ações
   - Paginação real (usar ListagemPaginadaDTO: items, total, pagina, porPagina, totalPaginas)
   - Campo de busca (filtra por nome/CPF/email)
   - Filtro por status (Ativo, Pausado, Cancelado, Inadimplente)
   - Botão "Novo Membro"

2. **Modal/drawer de cadastro** — campos conforme POST /api/membros:
   - nome (obrigatório), cpf, telefone, email, nomePlano, valorMensal (obrigatório, > 0), diaVencimento (obrigatório, 1-28), tags
   - Validação client-side antes de enviar

3. **Modal/drawer de edição** — mesmos campos, pre-populados (PUT /api/membros/{id})

4. **Confirmação de exclusão** — dialog antes de DELETE /api/membros/{id}

5. **Alteração de status** — dropdown ou botões com as transições válidas:
   - Ativo → Pausado, Cancelado, Inadimplente
   - Pausado → Ativo, Cancelado
   - Inadimplente → Ativo, Cancelado
   - Cancelado → nenhuma (estado final)
   - Usa PATCH /api/membros/{id}/status

6. **Badges de status** com cores:
   - Ativo = verde, Pausado = amarelo, Inadimplente = vermelho, Cancelado = cinza

## Integração:

- Crie um service/hook (ex: useMembros ou membrosService) que encapsula as chamadas HTTP
- **POR ENQUANTO use dados mock** (mesma abordagem do auth mock) — a API real ainda não está conectada ao frontend
- Os mocks devem respeitar exatamente os shapes do contrato (MembroDTO, ListagemPaginadaDTO)
- Quando a integração real vier (Task 6a), será só trocar o mock pelo fetch real

## Padrões:
- Dark mode compatível (Tailwind dark:)
- Responsivo
- Componentes reutilizáveis
- TypeScript strict
- Manter consistência visual com o dashboard shell existente

## Referência:
Leia C:\Projetos\PixRecorrente\Analise\CONTRATOS-API.md para os shapes exatos dos DTOs e endpoints.

Quando terminar, rode este comando:
```
openclaw system event --text "Pixel terminou Task 6: Tela de Membros completa" --mode now
```
