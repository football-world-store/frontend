# Backend API — mapeamento de endpoints

> Gerado a partir de `https://backend-bywc.onrender.com/docs/json` em 2026-07-15. Spec completo (OpenAPI 3.0) salvo em `docs/backend-openapi.json`. Reexporte esse arquivo sempre que o backend mudar de forma relevante.

⚠️ **O OpenAPI/Scalar não documenta response schemas na maioria dos endpoints** — só descrições textuais. Em 2026-07-15 uma auditoria contra o código-fonte real do backend (`/Users/deiv/Documents/football/backend`, controllers/use-cases/`schema.prisma`) encontrou várias divergências entre o que o front assumia (baseado só no spec) e a realidade. Achado mais importante: **todo endpoint de listagem paginada retorna `{ data: T[], meta: {total,page,limit,totalPages} }` direto, sem o envelope `{ data: {...} }`** que o resto da API usa — o controller repassa o retorno do use-case sem re-embrulhar. Isso afetava products, sales, customers, users e stock-entries simultaneamente. Corrigido via `fetchPaginated()` compartilhado em `src/services/api/pagination.ts`. Ao integrar um endpoint novo, **não confie só no OpenAPI nem no README do módulo** (que pode estar desatualizado em relação ao código, como aconteceu em `dashboard/summary`) — confirme o shape lendo o use-case/controller reais no repo do backend.

Total: 63 operações em 11 tags, 52 paths, 28 DTOs.

## Legenda

- `[OWNER]` — restrito a usuários com role OWNER (403 ACCESS_DENIED para os demais)

- Padrão **IDOR mitigation**: vários endpoints usam `POST .../find`, `PATCH`/`DELETE` no corpo (ID no body) em vez de `:id` na URL

## Diagnóstico — divergências entre backend e frontend (2026-07-15)

### 🔴 Bugs (rotas erradas no front hoje)

- `usersService.audit` chamava `GET /users/audit` — o backend expõe `GET /audit` (tag `Audit`, controller separado). **Corrigido.**
- `customersService.byId` chamava `GET /customers/:id` — não existe no backend. O padrão real é `POST /customers/find` com `{ id }` no body (IDOR mitigation, igual products/sales/users). **Corrigido.**

### 🟡 Customers — API mais completa do que o front assume

O commit `d6720e3` documentava "no customers endpoints", mas o backend tem hoje:

- `PATCH /customers` — editar cliente (ID + campos no body)
- `DELETE /customers` — desativar cliente (OWNER)
- `GET /customers/export` — exporta lista formatada para WhatsApp
- `GET /customers/{id}/purchases` — histórico de compras, totalSpent, averageTicket
- `GET /customers/ranking/by-amount` e `/ranking/by-purchases` (OWNER)
- Filtros no `list`: `favoriteTeam`, `preferredSizes`, `status` (ACTIVE/COOLING/INACTIVE), `minSpent`/`maxSpent`, `search`

Ainda não integrado no front — próximo passo depois dos bugs.

### 🟢 Dashboard — endpoints novos não integrados

- `GET /dashboard/club-trend` — sazonalidade por clube/mês. **Integrado** (commit `d3295ca`).
- `GET /dashboard/customers-by-team` — clientes por time do coração
- `GET /dashboard/reservation-conversion` — taxa de conversão de reservas

### ⏸️ Adiado — n8n, não é o frontend Next.js

- **Public — Chatbot API** (`GET /public/products`, `POST /public/reservations`) — endpoints públicos sem auth, consumidos pelo fluxo n8n do chatbot. Não integrar aqui.

### 🟢 Domínios integrados

- **Customer Auth** (`POST /customer-auth/magic-link`, `POST /customer-auth/verify`, `POST /customer-auth/logout`, `GET /customer-auth/me/orders`) — portal do cliente em `/portal`, `/portal/verify`, `/portal/orders`. **Integrado** (commit `e842406`). `customerApiClient` próprio (sem refresh/redirect de staff), `CustomerAuthContext` isolado no layout do portal, proxy com carve-out dedicado. ⚠️ `verify` e `me/orders` não têm schema de resposta documentado no OpenAPI — os tipos (`CustomerIdentity`, `CustomerOrder`) são melhor-esforço e precisam ser confirmados/ajustados contra o backend real assim que possível.
- **`POST /users/register`** — auto-cadastro público de funcionário (fica inativo até OWNER aprovar via `PATCH isActive:true`). Diferente do `POST /users` (criação direta por OWNER). **Integrado** (commit `85ecdfa`).

## Alerts

### `GET /api/v1/alerts`

**Lista alertas pendentes**  
Retorna todos os alertas não resolvidos, CRITICAL primeiro.  
`operationId: AlertsController_list`

Responses:

- `200`: Lista de alertas pendentes
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/alerts/count`

**Contagem de alertas pendentes**  
Retorna total, críticos e informativos — usado para badge no menu.  
`operationId: AlertsController_count`

Responses:

- `200`: Contagem por severidade
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `PATCH /api/v1/alerts/{id}/resolve`

**Marcar alerta como resolvido**  
Registra resolução manual de um alerta pelo OWNER.  
`operationId: AlertsController_resolve`

Query/Path params:

- `id` (path, obrigatório)

Body (application/json): `ResolveAlertDto`

- `note`: string (opcional)

Responses:

- `200`: Alerta resolvido
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

## Audit

### `GET /api/v1/audit`

**[OWNER] Lista o log de auditoria com filtros por usuário, ação, entidade e período**  
`operationId: AuditController_list`

Query/Path params:

- `userId` (query, opcional): Filtrar por usuário
- `action` (query, opcional): Filtrar por tipo de ação — enum: ['CREATE', 'UPDATE', 'DELETE', 'SALE', 'ENTRY', 'CANCEL', 'LOGIN', 'LOGOUT']
- `entity` (query, opcional): Filtrar por entidade (User, Product, Sale…)
- `startDate` (query, opcional): Data inicial (ISO 8601)
- `endDate` (query, opcional): Data final (ISO 8601)
- `page` (query, opcional)
- `limit` (query, opcional)

Responses:

- `200`: Log de auditoria paginado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

## Auth

### `POST /api/v1/auth/login`

**Autenticar e criar sessão**  
`operationId: AuthController_login`

Body (application/json): `LoginDto`

- `email`: string (obrigatório)
- `password`: string (obrigatório)

Responses:

- `200`: Login realizado com sucesso
- `401`: INVALID_CREDENTIALS
- `403`: ACCOUNT_INACTIVE

Auth: público (sem security)

### `POST /api/v1/auth/logout`

**Invalidar sessão e revogar tokens**  
`operationId: AuthController_logout`

Responses:

- `204`: Logout realizado

Auth: cookie

### `POST /api/v1/auth/forgot-password`

**Iniciar recuperação de senha**  
`operationId: AuthController_forgotPassword`

Body (application/json): `ForgotPasswordDto`

- `email`: string (obrigatório)

Responses:

- `200`: Sempre retorna sucesso

Auth: público (sem security)

### `POST /api/v1/auth/reset-password`

**Redefinir senha com token recebido por e-mail**  
`operationId: AuthController_resetPassword`

Body (application/json): `ResetPasswordDto`

- `token`: string (obrigatório)
- `newPassword`: string (obrigatório)
- `confirmPassword`: string (obrigatório)

Responses:

- `204`: Senha redefinida com sucesso
- `400`: INVALID_OR_EXPIRED_TOKEN

Auth: público (sem security)

### `POST /api/v1/auth/refresh`

**Renovar access token via refresh token**  
`operationId: AuthController_refresh`

Responses:

- `200`: Novo access token gerado
- `401`: INVALID_REFRESH_TOKEN | REFRESH_TOKEN_EXPIRED

Auth: público (sem security)

### `POST /api/v1/auth/clear-sessions`

**Revogar todas as sessões ativas do usuário**  
`operationId: AuthController_clearSessions`

Responses:

- `204`: Todas as sessões foram encerradas

Auth: cookie

## Customer Auth

### `POST /api/v1/customer-auth/magic-link`

**Solicita link de acesso por email (magic link)**  
`operationId: CustomerAuthController_requestLink`

Body (application/json): `RequestMagicLinkDto`

- `email`: string (obrigatório)

Responses:

- `200`: Sempre retorna sucesso — não revela se o email existe

Auth: público (sem security)

### `POST /api/v1/customer-auth/verify`

**Verifica o token do magic link e cria a sessão do cliente**  
`operationId: CustomerAuthController_verify`

Body (application/json): `VerifyMagicLinkDto`

- `token`: string (obrigatório)

Responses:

- `200`: Sessão criada

Auth: público (sem security)

### `POST /api/v1/customer-auth/logout`

**Encerra a sessão do cliente**  
`operationId: CustomerAuthController_logout`

Responses:

- `204`:

Auth: customer_access_token

### `GET /api/v1/customer-auth/me/orders`

**Lista as compras e reservas do cliente autenticado**  
Busca vendas por `customerId` **e** por email da sessão, então o histórico completo aparece mesmo para compras registradas antes de o cliente criar conta.  
`operationId: CustomerAuthController_orders`

Responses:

- `200`: `{ purchases: SaleResponse[], reservations: MyReservationResponse[] }`

Auth: customer_access_token

**Integrado no front** — sem mudança de interface, `customerAuthService.getOrders` / `useCustomerOrdersQuery`.

### `GET /api/v1/customer-auth/me/orders/{id}`

**Busca um pedido por ID (recibo)**  
Retorna os dados completos de uma venda do cliente autenticado — itens, valores, data e canal (mesmo shape de `GET /sales/{id}`). Usado para geração de recibo no portal.  
`operationId: CustomerAuthController_order`

Query/Path params:

- `id` (path, obrigatório)

Responses:

- `200`: Dados completos do pedido
- `403`: ACCESS_DENIED — pedido não pertence ao cliente autenticado
- `404`: SALE_NOT_FOUND

Auth: customer_access_token

**Integrado no front** (2026-07-23) — `customerAuthService.getOrderById`, consumido por `useCustomerOrderQuery`/`CustomerOrderReceiptModal` (compras clicáveis em `/portal/orders`).

## Customers

### `GET /api/v1/customers`

**Lista clientes com segmentação e paginação**  
Filtros combináveis: time do coração, tamanhos preferidos, status, faixa de valor gasto e busca livre.  
`operationId: CustomersController_list`

Query/Path params:

- `page` (query, opcional)
- `limit` (query, opcional)
- `search` (query, opcional): Busca em nome ou WhatsApp
- `favoriteTeam` (query, opcional)
- `preferredSizes` (query, opcional): Tamanhos preferidos, separados por vírgula (contém qualquer um)
- `status` (query, opcional) — enum: ['ACTIVE', 'COOLING', 'INACTIVE']
- `minSpent` (query, opcional)
- `maxSpent` (query, opcional)
- `includeInactive` (query, opcional): Incluir inativos (OWNER only)

Responses:

- `200`: Lista paginada de clientes
- `401`: MISSING_TOKEN / INVALID_TOKEN

Auth: access_token

### `POST /api/v1/customers`

**Cria um novo cliente**  
whatsapp deve ser único no sistema.  
`operationId: CustomersController_create`

Body (application/json): `CreateCustomerDto`

- `name`: string (obrigatório)
- `whatsapp`: string (obrigatório)
- `email`: string (opcional)
- `favoriteTeam`: string (opcional)
- `preferredSizes`: array (opcional)
- `birthDate`: string (opcional)
- `notes`: string (opcional)

Responses:

- `201`: Cliente criado com sucesso
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `409`: CUSTOMER_WHATSAPP_DUPLICATE

Auth: access_token

### `PATCH /api/v1/customers`

**Edita cliente (ID + campos no body — IDOR mitigation)**  
`operationId: CustomersController_update`

Body (application/json): `UpdateCustomerDto`

- `id`: string (obrigatório)
- `name`: string (opcional)
- `whatsapp`: string (opcional)
- `email`: string (opcional)
- `favoriteTeam`: string (opcional)
- `preferredSizes`: array (opcional)
- `birthDate`: string (opcional)
- `notes`: string (opcional)

Responses:

- `200`: Cliente atualizado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: CUSTOMER_NOT_FOUND
- `409`: CUSTOMER_WHATSAPP_DUPLICATE

Auth: access_token

### `DELETE /api/v1/customers`

**[OWNER] Desativa cliente (ID no body — IDOR mitigation)**  
`operationId: CustomersController_deactivate`

Body (application/json): `DeleteCustomerDto`

- `id`: string (obrigatório)

Responses:

- `204`: Cliente desativado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — acesso restrito a OWNER
- `404`: CUSTOMER_NOT_FOUND

Auth: access_token

### `GET /api/v1/customers/export`

**Exporta clientes filtrados em texto plano**  
Formato "Nome — +WhatsApp", um por linha — pronto para colar em grupo do WhatsApp.  
`operationId: CustomersController_export`

Query/Path params:

- `search` (query, opcional): Busca em nome ou WhatsApp
- `favoriteTeam` (query, opcional)
- `preferredSizes` (query, opcional): Tamanhos preferidos, separados por vírgula (contém qualquer um)
- `status` (query, opcional) — enum: ['ACTIVE', 'COOLING', 'INACTIVE']
- `minSpent` (query, opcional)
- `maxSpent` (query, opcional)

Responses:

- `200`: Lista em texto plano
- `401`: MISSING_TOKEN / INVALID_TOKEN

Auth: access_token

### `POST /api/v1/customers/find`

**Busca cliente por ID (ID no body — IDOR mitigation)**  
`operationId: CustomersController_find`

Body (application/json): `FindCustomerDto`

- `id`: string (obrigatório)

Responses:

- `200`: Dados do cliente encontrado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: CUSTOMER_NOT_FOUND

Auth: access_token

### `GET /api/v1/customers/{id}/purchases`

**Histórico de compras do cliente**  
Retorna vendas vinculadas, totalSpent, averageTicket e lastPurchaseAt.  
`operationId: CustomersController_purchases`

Query/Path params:

- `id` (path, obrigatório)
- `page` (query, opcional)
- `limit` (query, opcional)

Responses:

- `200`: Histórico paginado de compras
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: CUSTOMER_NOT_FOUND

Auth: access_token

### `GET /api/v1/customers/ranking/by-amount`

**[OWNER] Top clientes por valor gasto (totalSpent)**  
`operationId: CustomersController_byAmount`

Query/Path params:

- `limit` (query, opcional): Top N (default 20)

Responses:

- `200`: Ranking por valor gasto
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — acesso restrito a OWNER

Auth: access_token

### `GET /api/v1/customers/ranking/by-purchases`

**[OWNER] Top clientes por quantidade de compras (purchaseCount)**  
`operationId: CustomersController_byPurchases`

Query/Path params:

- `limit` (query, opcional): Top N (default 20)

Responses:

- `200`: Ranking por quantidade de compras
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — acesso restrito a OWNER

Auth: access_token

## Dashboard

### `GET /api/v1/dashboard/summary`

**Cards de resumo do dashboard**  
Retorna snapshot do estoque (total, valor investido, críticos, zerados) e métricas de vendas do período (faturamento, ticket médio, lucro bruto, margem).  
`operationId: DashboardController_summary`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.

Responses:

- `200`: Resumo do dashboard
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/top-products`

**Top produtos mais vendidos no período**  
Ranking por quantidade vendida. Máximo 20 resultados.  
`operationId: DashboardController_topProducts`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `limit` (query, opcional): Máximo de resultados (default: 10, max: 20)

Responses:

- `200`: Ranking de produtos
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/top-clubs`

**Top clubes/marcas com maior giro no período**  
Agrupa por clube/marca. Útil para decidir quais times repor com mais urgência.  
`operationId: DashboardController_topClubs`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `limit` (query, opcional): Máximo de resultados (default: 10, max: 20)

Responses:

- `200`: Ranking de clubes/marcas
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/sizes`

**Ranking de tamanhos — resolve a Dor 2 do cliente**  
Retorna top 5 (mais vendidos) e bottom 5 (menos vendidos) no período. Aceita clubOrBrand/category opcionais para calibrar o mix de tamanhos de um time ou categoria específica na hora de repor o estoque.  
`operationId: DashboardController_sizes`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `clubOrBrand` (query, opcional): Filtrar por clube/marca
- `category` (query, opcional): Filtrar por categoria — enum: ['CAMISA', 'SHORT', 'MEIAO', 'AGASALHO', 'ACESSORIO', 'CALCADO']

Responses:

- `200`: Ranking de tamanhos
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/channels`

**Comparativo de canais de venda no período**  
Loja física vs Instagram vs WhatsApp — quantidade, faturamento e percentual de cada canal.  
`operationId: DashboardController_channels`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.

Responses:

- `200`: Breakdown por canal
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/margins`

**Análise de margens de lucro no período**  
Margem geral + top 20 produtos por lucro bruto. Cálculo: receita − (quantidade × custo). Apenas OWNER.  
`operationId: DashboardController_margins`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.

Responses:

- `200`: Margens geral e por produto
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/idle-products`

**Produtos parados sem venda no período**  
Lista produtos com estoque > 0 e sem venda há X dias, ordenados pelo maior valor parado (quantidade × custo). Ajuda a priorizar promoções e liquidações.  
`operationId: DashboardController_idleProducts`

Query/Path params:

- `days` (query, opcional): Dias sem venda (default: 30)

Responses:

- `200`: Produtos parados com valor imobilizado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/payment-methods`

**Breakdown por forma de pagamento no período**  
Dinheiro, PIX, débito e crédito — faturamento e % de cada um. Útil para planejamento de fluxo de caixa.  
`operationId: DashboardController_paymentMethods`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.

Responses:

- `200`: Breakdown por forma de pagamento
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/stock-velocity`

**Velocidade de saída — previsão de ruptura**  
Com base nas vendas dos últimos 30 dias, calcula a taxa diária de saída de cada produto e estima em quantos dias o estoque vai zerar. Risk: CRITICAL (≤7 dias), WARNING (≤15 dias), OK. Endpoint estratégico: permite repor antes da ruptura.  
`operationId: DashboardController_stockVelocity`

Responses:

- `200`: Produtos ordenados por urgência de reposição
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/reorder-list`

**Lista de reposição — o que precisa ser pedido agora**  
Produtos com estoque atual abaixo do estoque mínimo, ordenados pelo maior déficit. Inclui custo estimado para repor cada item até o mínimo (reorderCost = deficit × costPrice).  
`operationId: DashboardController_reorderList`

Responses:

- `200`: Lista de reposição com déficit e custo de reposição
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/capital-by-club`

**Capital imobilizado por clube/marca**  
Quanto do capital em estoque está concentrado em cada clube ou marca. Inclui percentual do total, variantes críticas (abaixo do mínimo) e quantidade total em estoque.  
`operationId: DashboardController_capitalByClub`

Responses:

- `200`: Capital por clube ordenado do maior para o menor
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/club-trend`

**Sazonalidade — vendas por clube mês a mês**  
Série mensal de quantidade vendida e faturamento por clube/marca. Ajuda a identificar picos ligados a evento (clássico, final de campeonato, contratação de jogador, lançamento de camisa nova) e planejar reposição antes do próximo pico.  
`operationId: DashboardController_clubTrend`

Query/Path params:

- `months` (query, opcional): Janela em meses (default: 6, max: 12)

Responses:

- `200`: Série mensal por clube/marca
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/customers-by-team`

**Clientes agrupados por time do coração**  
Quantidade de clientes, gasto total, ticket médio e total de compras por time do coração (favoriteTeam). Guia campanhas segmentadas — ex: torcedor de qual time vale mais a pena avisar quando chega camisa nova.  
`operationId: DashboardController_customersByTeam`

Responses:

- `200`: Ranking de times por valor de cliente
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

### `GET /api/v1/dashboard/reservation-conversion`

**Taxa de conversão de reservas no período**  
Quantas reservas viraram venda de fato (CONFIRMADA) vs foram canceladas ou expiraram, entre as já resolvidas (exclui as ainda pendentes). Se a taxa for baixa, o processo de reserva pode estar sendo usado só como "deixa eu pensar", não como compromisso real.  
`operationId: DashboardController_reservationConversion`

Query/Path params:

- `period` (query, obrigatório) — enum: ['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'CURRENT_MONTH', 'CUSTOM']
- `startDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.
- `endDate` (query, opcional): Obrigatório quando period=CUSTOM. Formato ISO 8601.

Responses:

- `200`: Breakdown de status e taxa de conversão
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — restrito a OWNER

Auth: access_token

## Products

### `GET /api/v1/products`

**Lista produtos com filtros e paginação**  
Retorna lista paginada de produtos. EMPLOYEE não recebe costPrice. Filtro por status é calculado em runtime (OUT_OF_STOCK, CRITICAL, IDLE, IN_STOCK). Apenas OWNER pode usar includeInactive=true.  
`operationId: ProductsController_list`

Query/Path params:

- `page` (query, opcional)
- `limit` (query, opcional)
- `search` (query, opcional): Busca em nome ou código interno
- `clubOrBrand` (query, opcional)
- `category` (query, opcional) — enum: ['CAMISA', 'SHORT', 'MEIAO', 'AGASALHO', 'ACESSORIO', 'CALCADO']
- `size` (query, opcional)
- `status` (query, opcional) — enum: ['IN_STOCK', 'CRITICAL', 'OUT_OF_STOCK', 'IDLE']
- `includeInactive` (query, opcional): Incluir inativos (OWNER only)

Responses:

- `200`: Lista paginada de produtos
- `401`: MISSING_TOKEN / INVALID_TOKEN

Auth: access_token

### `POST /api/v1/products`

**Cria um novo produto**  
Gera código interno automático (FWS-XXXX). Se initialQuantity > 0, cria StockEntry com supplier "CADASTRO_INICIAL". Não permite duplicidade (nome + clube + tamanho).  
`operationId: ProductsController_create`

Body (application/json): `CreateProductDto`

- `name`: string (obrigatório)
- `clubOrBrand`: string (obrigatório)
- `category`: string (obrigatório) — enum: ['CAMISA', 'SHORT', 'MEIAO', 'AGASALHO', 'ACESSORIO', 'CALCADO']
- `size`: string (obrigatório)
- `photoUrl`: string (opcional)
- `costPrice`: number (obrigatório)
- `salePrice`: number (obrigatório)
- `initialQuantity`: number (obrigatório)
- `minStock`: number (obrigatório)

Responses:

- `201`: Produto criado com sucesso
- `400`: VALIDATION_FAILED
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `409`: PRODUCT_DUPLICATE

Auth: access_token

### `PATCH /api/v1/products`

**Edita produto (ID + campos no body — IDOR mitigation)**  
EMPLOYEE não pode alterar costPrice nem salePrice (campos ignorados silenciosamente). Quantidade NUNCA é alterada por esta rota — apenas via StockEntry ou Sale.  
`operationId: ProductsController_update`

Body (application/json): `UpdateProductDto`

- `id`: string (obrigatório)
- `name`: string (opcional)
- `clubOrBrand`: string (opcional)
- `category`: string (opcional) — enum: ['CAMISA', 'SHORT', 'MEIAO', 'AGASALHO', 'ACESSORIO', 'CALCADO']
- `size`: string (opcional)
- `photoUrl`: string (opcional)
- `costPrice`: number (opcional)
- `salePrice`: number (opcional)
- `minStock`: number (opcional)

Responses:

- `200`: Produto atualizado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: PRODUCT_NOT_FOUND
- `409`: PRODUCT_DUPLICATE

Auth: access_token

### `DELETE /api/v1/products`

**[OWNER] Soft delete de produto (ID no body — IDOR mitigation)**  
Desativa o produto (isActive = false). Preserva integridade do histórico de vendas e entradas.  
`operationId: ProductsController_delete`

Body (application/json): `DeleteProductDto`

- `id`: string (obrigatório)

Responses:

- `204`: Produto desativado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — acesso restrito a OWNER
- `404`: PRODUCT_NOT_FOUND

Auth: access_token

### `POST /api/v1/products/find`

**Busca produto por ID (ID no body — IDOR mitigation)**  
EMPLOYEE não recebe costPrice na resposta.  
`operationId: ProductsController_find`

Body (application/json): `FindProductDto`

- `id`: string (obrigatório)

Responses:

- `200`: Dados do produto encontrado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: PRODUCT_NOT_FOUND

Auth: access_token

### `PATCH /api/v1/products/restore`

**[OWNER] Reativa produto desativado (ID no body — IDOR mitigation)**  
Reverte um soft delete, tornando o produto visível novamente.  
`operationId: ProductsController_restore`

Body (application/json): `FindProductDto`

- `id`: string (obrigatório)

Responses:

- `200`: Produto reativado
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — acesso restrito a OWNER
- `404`: PRODUCT_NOT_FOUND
- `409`: PRODUCT_ALREADY_ACTIVE

Auth: access_token

### `POST /api/v1/products/photo/upload-url`

**Gera URL pré-assinada para upload de foto no S3**  
Salva a URL da foto no banco e retorna `uploadUrl` para PUT direto no S3 (expira em 5 min). Fluxo: (1) chamar este endpoint → (2) PUT do arquivo binário no `uploadUrl` com header `Content-Type` correto. Foto anterior é deletada do S3 automaticamente. Formatos aceitos: jpg, jpeg, png, webp.  
`operationId: ProductsController_getUploadUrl`

Body (application/json)

Responses:

- `200`: URL pré-assinada gerada
- `400`: INVALID_FILE_FORMAT
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: PRODUCT_NOT_FOUND

Auth: access_token

### `DELETE /api/v1/products/photo`

**Remove a foto do produto (ID no body)**  
Deleta a foto do S3 e limpa o campo photoUrl.  
`operationId: ProductsController_deletePhotoHandler`

Body (application/json)

Responses:

- `204`: Foto removida
- `400`: NO_PHOTO_TO_DELETE
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: PRODUCT_NOT_FOUND

Auth: access_token

## Public — Chatbot API

### `GET /api/v1/public/products`

**Buscar produtos disponíveis**  
Endpoint para chatbot (n8n / Gemini). Retorna produtos ativos com status de estoque simplificado. Autenticado via header x-api-key.  
`operationId: PublicController_search`

Query/Path params:

- `search` (query, opcional): Busca por nome, código (FWS-XXXX) ou clube/marca
- `category` (query, opcional) — enum: ['CAMISA', 'SHORT', 'MEIAO', 'AGASALHO', 'ACESSORIO', 'CALCADO']
- `size` (query, opcional): Tamanho (P, M, G, GG, 38, 42...)
- `clubOrBrand` (query, opcional)
- `stockStatus` (query, opcional): Filtrar por disponibilidade — enum: ['AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK']

Responses:

- `200`: Lista de produtos com status de estoque
- `401`: INVALID_API_KEY

Auth: x-api-key

### `POST /api/v1/public/reservations`

**Criar reserva de produto via chatbot**  
Cria uma reserva pendente por 24h. Não desconta estoque — a loja confirma manualmente. Ideal para fluxo: WhatsApp → n8n → Gemini → reserva.  
`operationId: PublicController_reserve`

Body (application/json): `CreateReservationDto`

- `productId`: string (obrigatório)
- `quantity`: number (obrigatório)
- `customerName`: string (obrigatório)
- `customerWhatsapp`: string (obrigatório)
- `customerEmail`: string (opcional)
- `notes`: string (opcional)

Responses:

- `201`: Reserva criada com confirmação e prazo de validade
- `400`: PRODUCT_OUT_OF_STOCK / INSUFFICIENT_STOCK
- `401`: INVALID_API_KEY
- `404`: PRODUCT_NOT_FOUND

Auth: x-api-key

## Sales

### `GET /api/v1/sales`

**Lista vendas com filtros e paginação**  
Histórico cronológico de vendas. Filtros por período, produto, canal, responsável, cliente e status.  
`operationId: SalesController_list`

Query/Path params:

- `page` (query, opcional)
- `limit` (query, opcional)
- `productId` (query, opcional): Filtrar por produto (presente nos itens)
- `customerId` (query, opcional): Filtrar por cliente
- `userId` (query, opcional): Filtrar por responsável
- `channel` (query, opcional) — enum: ['LOJA_FISICA', 'INSTAGRAM', 'WHATSAPP', 'SITE']
- `status` (query, opcional) — enum: ['CONFIRMED', 'CANCELLED']
- `startDate` (query, opcional): Data inicial (ISO)
- `endDate` (query, opcional): Data final (ISO)

Responses:

- `200`: Lista paginada de vendas
- `401`: MISSING_TOKEN / INVALID_TOKEN

Auth: access_token

### `POST /api/v1/sales`

**Registra uma nova venda**  
Decrementa automaticamente o estoque dos produtos. Bloqueia vendas que deixariam estoque negativo. Preço unitário é preenchido automaticamente se omitido. Apenas OWNER pode editar a data da venda (saleDate). Atualiza campos desnormalizados do produto (lastSaleAt, totalSold) e do cliente.  
`operationId: SalesController_create`

Body (application/json): `CreateSaleDto`

- `items`: array (obrigatório)
- `channel`: string (obrigatório) — enum: ['LOJA_FISICA', 'INSTAGRAM', 'WHATSAPP', 'SITE']
- `paymentMethod`: string (obrigatório) — enum: ['DINHEIRO', 'PIX', 'DEBITO', 'CREDITO']
- `customerEmail`: string (**obrigatório** — mudança de 2026-07-23; resolve o `customerId` automaticamente no backend)
- `customerId`: string (opcional — se enviado junto de `customerEmail`, o backend prioriza o ID)
- `discount`: number (opcional)
- `saleDate`: string (opcional)

Responses:

- `201`: Venda registrada com sucesso
- `400`: INSUFFICIENT_STOCK / PRODUCT_INACTIVE / CUSTOMER_INACTIVE
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: PRODUCT_NOT_FOUND / CUSTOMER_NOT_FOUND

Auth: access_token

**Integrado no front** (`SaleForm.tsx`, `CreateSaleBody`) — `customerEmail` já é obrigatório na UI, sem busca prévia de `customerId`.

### `GET /api/v1/sales/{id}`

**Busca venda por ID**  
Retorna os dados completos da venda com todos os itens. Usado pelo admin para visualizar detalhes e gerar recibo.  
`operationId: SalesController_findById`

Query/Path params:

- `id` (path, obrigatório)

Responses:

- `200`: Dados da venda encontrada (mesmo shape da listagem, objeto único)
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: SALE_NOT_FOUND

Auth: access_token

**Integrado no front** (2026-07-23) — `salesService.findById`, consumido por `useSaleQuery`/`SaleReceiptModal` (botão "Ver recibo" em `/sales`).

### `POST /api/v1/sales/find` _(deprecated)_

**Busca venda por ID (ID no body — IDOR mitigation)**  
Mantido para compatibilidade. Prefira `GET /api/v1/sales/{id}`.  
`operationId: SalesController_find`

Body (application/json): `FindSaleDto`

- `id`: string (obrigatório)

Responses:

- `200`: Dados da venda encontrada
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: SALE_NOT_FOUND

Auth: access_token

⚠️ O front não usa mais essa rota — migrado para `GET /api/v1/sales/{id}` em 2026-07-23.

### `POST /api/v1/sales/cancel`

**[OWNER] Cancela uma venda**  
Cancela a venda e devolve o estoque de todos os itens. Reverte campos desnormalizados do produto e do cliente. Não é possível cancelar uma venda já cancelada.  
`operationId: SalesController_cancel`

Body (application/json): `CancelSaleDto`

- `id`: string (obrigatório)
- `cancelReason`: string (opcional)

Responses:

- `200`: Venda cancelada com sucesso
- `400`: SALE_ALREADY_CANCELLED
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — acesso restrito a OWNER
- `404`: SALE_NOT_FOUND

Auth: access_token

## StockEntries

### `GET /api/v1/stock-entries`

**Lista entradas de mercadoria com filtros e paginação**  
Histórico cronológico de entradas e estornos. Filtros por produto, responsável, fornecedor e período. EMPLOYEE não recebe unitCost nem totalCost.  
`operationId: StockEntriesController_list`

Query/Path params:

- `page` (query, opcional)
- `limit` (query, opcional)
- `productId` (query, opcional): Filtrar por produto
- `userId` (query, opcional): Filtrar por responsável
- `supplier` (query, opcional): Filtrar por fornecedor
- `startDate` (query, opcional): Data inicial (ISO)
- `endDate` (query, opcional): Data final (ISO)

Responses:

- `200`: Lista paginada de entradas
- `401`: MISSING_TOKEN / INVALID_TOKEN

Auth: access_token

### `POST /api/v1/stock-entries`

**Registra uma nova entrada de mercadoria**  
Operação transacional: cria StockEntry e incrementa Product.quantity. Atualiza o costPrice do produto com o unitCost informado. Não é permitido criar entrada para produto inativo.  
`operationId: StockEntriesController_create`

Body (application/json): `CreateStockEntryDto`

- `productId`: string (obrigatório)
- `quantity`: number (obrigatório)
- `unitCost`: number (obrigatório)
- `supplier`: string (obrigatório)
- `notes`: string (opcional)

Responses:

- `201`: Entrada registrada com sucesso
- `400`: PRODUCT_INACTIVE / VALIDATION_FAILED
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: PRODUCT_NOT_FOUND

Auth: access_token

### `POST /api/v1/stock-entries/find`

**Busca entrada por ID (ID no body — IDOR mitigation)**  
EMPLOYEE não recebe unitCost nem totalCost.  
`operationId: StockEntriesController_find`

Body (application/json): `FindStockEntryDto`

- `id`: string (obrigatório)

Responses:

- `200`: Dados da entrada encontrada
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `404`: STOCK_ENTRY_NOT_FOUND

Auth: access_token

### `POST /api/v1/stock-entries/reverse`

**[OWNER] Estorna uma entrada de mercadoria**  
Cria um registro de estorno (isReverse: true) e decrementa a quantidade do produto. Não é possível estornar uma entrada já estornada. Estorno é bloqueado se deixaria o estoque negativo.  
`operationId: StockEntriesController_reverse`

Body (application/json): `ReverseStockEntryDto`

- `id`: string (obrigatório)
- `reason`: string (obrigatório)

Responses:

- `201`: Estorno registrado com sucesso
- `400`: STOCK_REVERSE_NEGATIVE / STOCK_ENTRY_ALREADY_REVERSED / CANNOT_REVERSE_REVERSAL
- `401`: MISSING_TOKEN / INVALID_TOKEN
- `403`: ACCESS_DENIED — acesso restrito a OWNER
- `404`: STOCK_ENTRY_NOT_FOUND

Auth: access_token

## Users

### `POST /api/v1/users/register`

**[Público] Solicita cadastro de funcionário — fica inativo até um OWNER aprovar (PATCH isActive:true)**  
`operationId: UsersController_registerUser`

Body (application/json): `RegisterUserDto`

- `name`: string (obrigatório)
- `email`: string (obrigatório)
- `password`: string (obrigatório)

Responses:

- `201`: Cadastro criado, pendente de aprovação
- `401`: Não autenticado

Auth: access_token

### `GET /api/v1/users/me`

**Retorna o perfil do usuário autenticado**  
`operationId: UsersController_getMeHandler`

Responses:

- `200`: Perfil do usuário atual
- `401`: Não autenticado

Auth: access_token

### `PATCH /api/v1/users/me/password`

**Troca a senha do usuário autenticado**  
`operationId: UsersController_changePasswordHandler`

Body (application/json): `ChangePasswordDto`

- `currentPassword`: string (obrigatório)
- `newPassword`: string (obrigatório)

Responses:

- `204`: Senha alterada. Sessões encerradas.
- `401`: Não autenticado

Auth: access_token

### `GET /api/v1/users`

**[OWNER] Lista usuários com filtros e paginação**  
`operationId: UsersController_listUsers`

Query/Path params:

- `page` (query, opcional)
- `limit` (query, opcional)
- `role` (query, opcional) — enum: ['OWNER', 'EMPLOYEE']
- `isActive` (query, opcional)

Responses:

- `200`: Lista paginada de usuários
- `401`: Não autenticado
- `403`: Acesso restrito a OWNER

Auth: access_token

### `POST /api/v1/users`

**[OWNER] Cria um novo usuário (Cognito + banco)**  
`operationId: UsersController_createUser`

Body (application/json): `CreateUserDto`

- `name`: string (obrigatório)
- `email`: string (obrigatório)
- `password`: string (obrigatório)
- `role`: string (obrigatório) — enum: ['OWNER', 'EMPLOYEE']

Responses:

- `201`: Usuário criado com sucesso
- `401`: Não autenticado
- `403`: Acesso restrito a OWNER

Auth: access_token

### `PATCH /api/v1/users`

**[OWNER] Edita usuário (ID + campos no body — IDOR mitigation)**  
`operationId: UsersController_updateUser`

Body (application/json): `UpdateUserDto`

- `id`: string (obrigatório)
- `name`: string (opcional)
- `email`: string (opcional)
- `role`: string (opcional) — enum: ['OWNER', 'EMPLOYEE']
- `isActive`: boolean (opcional)

Responses:

- `200`: Usuário atualizado
- `401`: Não autenticado
- `403`: Acesso restrito a OWNER

Auth: access_token

### `DELETE /api/v1/users`

**[OWNER] Desativa usuário (soft delete — ID no body — IDOR mitigation)**  
`operationId: UsersController_deleteUser`

Body (application/json): `DeleteUserDto`

- `id`: string (obrigatório)

Responses:

- `204`: Usuário desativado. Sessões encerradas.
- `401`: Não autenticado
- `403`: Acesso restrito a OWNER

Auth: access_token

### `POST /api/v1/users/find`

**[OWNER] Busca usuário por ID (ID no body — IDOR mitigation)**  
`operationId: UsersController_findUser`

Body (application/json): `FindUserDto`

- `id`: string (obrigatório)

Responses:

- `200`: Dados do usuário encontrado
- `401`: Não autenticado
- `403`: Acesso restrito a OWNER

Auth: access_token
