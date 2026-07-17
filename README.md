# Football World Store — Frontend

Painel administrativo da Football World Store: dashboard, gestão de inventário, clientes, vendas, entradas de estoque, usuários e configurações. Construído com Next.js 16 (App Router), React 19, TypeScript estrito, Tailwind v4, TanStack Query e Axios.

> Para arquitetura, design system e convenções de código, leia [`CLAUDE.md`](./CLAUDE.md). Quem escreve código no projeto **deve** ler antes.

---

## Stack

| Camada            | Ferramenta                                            |
| ----------------- | ----------------------------------------------------- |
| Framework         | Next.js 16.2.4 (App Router) + React 19.2.4            |
| Linguagem         | TypeScript (strict, `noEmit`)                         |
| Estilo            | Tailwind CSS v4 + design system dark-only (DESIGN.md) |
| Server state      | TanStack Query v5                                     |
| HTTP              | Axios (com `withCredentials` para sessão httpOnly)    |
| Forms / validação | React Hook Form + Zod                                 |
| Toasts            | Sonner                                                |
| Mocks             | MSW (Mock Service Worker) para dev sem backend        |
| Package manager   | Bun                                                   |
| Lint / Format     | ESLint 9 + Prettier 3 + Husky + lint-staged + sonarjs |

---

## Pré-requisitos

- [Bun](https://bun.sh) >= 1.3
- Node.js 20+ (apenas para utilitários — runtime principal é Bun)

---

## Setup

```bash
bun install
cp .env.example .env.local
# preencha as variáveis (ver tabela abaixo)
bun dev
```

App sobe em [http://localhost:3000](http://localhost:3000). Husky é instalado automaticamente via script `prepare`.

---

## Variáveis de ambiente

| Variável                   | Default no `.env.example`      | Descrição                                                                    |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`      | `http://localhost:3333/api/v1` | URL base do backend. O Axios usa isso + `withCredentials` p/ cookie httpOnly |
| `NEXT_PUBLIC_ENABLE_MOCKS` | `false`                        | `true` liga o MSW em dev (`src/mocks/`) — útil sem backend rodando           |

> `.env`, `.env.local`, `.env.*.local` etc. estão no `.gitignore`. **Nunca** commite credenciais. Para introduzir uma nova variável, adicione no `.env.example` (sem valor real), no `src/constants/env.ts` (leitura tipada) e documente aqui.

---

## Scripts

| Comando                | Função                                |
| ---------------------- | ------------------------------------- |
| `bun dev`              | Servidor de desenvolvimento (Next.js) |
| `bun run build`        | Build de produção                     |
| `bun start`            | Sobe o build de produção              |
| `bun run lint`         | ESLint                                |
| `bun run lint:fix`     | ESLint com auto-fix                   |
| `bun run format`       | Prettier write                        |
| `bun run format:check` | Prettier check (usado no CI)          |
| `bun run typecheck`    | `tsc --noEmit`                        |

---

## Estrutura

```
src/
├── app/                          # App Router
│   ├── (protected)/              # Rotas autenticadas — staff (layout próprio)
│   │   ├── dashboard/
│   │   ├── customers/[id]/
│   │   ├── inventory/
│   │   ├── entries/
│   │   ├── insights/
│   │   ├── audit/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── sign-in/ register/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── minha-conta/entrar/       # Verificação de magic link do portal do cliente
│   ├── portal/ portal/orders/    # Portal do cliente — público, sessão própria
│   ├── layout.tsx                # Root layout (dark fixo, fonts)
│   ├── providers.tsx             # QueryClient + Auth + UI + Toaster
│   └── globals.css               # Design tokens (Tailwind v4 @theme)
│
├── components/                   # Atomic Design (UI puro, sem fetch)
│   ├── atoms/                    # Avatar, Badge, Button, Icon, Input, Label, Logo, Modal, Select, Spinner, FormError, IconButton, ClawIndicator
│   ├── molecules/                # Card, FormField, PasswordField, SelectField, Sidebar, TopBar, StatTile, EmptyState, ClubProgressList, ClubTrendChart, RevenueLineChart, SalesByChannelChart, SizesDonutChart
│   ├── organisms/                # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, RequestMagicLinkForm, VerifyMagicLinkForm, CustomerOrdersList, DashboardKPIs, AlertsPanel, InsightsPanel, InventoryTable, StockEntriesTable, CustomersList, CustomerForm, ProductForm, StockMovementForm, UserForm
│   └── templates/                # AuthLayout, DashboardLayout
│
├── contexts/                     # AuthContext (staff), CustomerAuthContext (portal — montado só em app/portal/layout.tsx)
│
├── hooks/
│   ├── queries/                  # useDashboardQuery, useProductsQuery, useCustomersQuery, useSalesQuery, useStockEntriesQuery, useUsersQuery, useAlertsQuery, useAuditLogsQuery, useMeQuery, useCustomerOrdersQuery
│   └── mutations/                # useLoginMutation, useLogoutMutation, useForgotPasswordMutation, useResetPasswordMutation, useRegisterUserMutation, useCreateProductMutation, useCreateCustomerMutation, useCreateStockEntryMutation, useCreateUserMutation, useRequestMagicLinkMutation, useVerifyMagicLinkMutation, useCustomerLogoutMutation
│
├── services/                     # Camada HTTP (única que usa Axios)
│   ├── api/
│   │   ├── client.ts             # Axios instance staff + interceptor 401 (refresh automático)
│   │   ├── customerClient.ts     # Axios instance do portal — sem refresh, sem redirect
│   │   ├── pagination.ts         # fetchPaginated() — shape real {data, meta} de todo endpoint paginado
│   │   └── routes.ts             # API_ROUTES (todas as URLs do backend)
│   ├── auth.service.ts
│   ├── customerAuth.service.ts
│   ├── products.service.ts
│   ├── customers.service.ts
│   ├── sales.service.ts
│   ├── stockEntries.service.ts
│   ├── users.service.ts
│   ├── dashboard.service.ts
│   ├── audit.service.ts
│   └── alerts.service.ts
│
├── constants/                    # env, routes (APP_ROUTES), queryKeys, auth (cookie name)
│
├── types/
│   ├── api/                      # DTOs / responses do backend (inclui customerAuth.ts)
│   └── domain/                   # Product, Customer, Sale, StockEntry, User, Alert, Reservation, CustomerOrder, DashboardStats…
│
├── lib/
│   ├── queryClient.ts            # Config do TanStack Query
│   └── validations/              # Zod schemas (auth, customerAuth, product, customer, stockEntry, user)
│
├── mocks/                        # MSW handlers + fixtures (toggle via NEXT_PUBLIC_ENABLE_MOCKS)
│   ├── browser.ts
│   ├── handlers.ts
│   └── fixtures/                 # alerts, customerAuth, customers, dashboard, products, sales, stockEntries, users
│
├── utils/                        # formatters, validators (funções puras)
│
└── proxy.ts                      # Sessão server-side staff (httpOnly cookie) + redirects; carve-out para /portal
```

> Status detalhado de quais módulos/endpoints do backend já estão conectados: [`CLAUDE.md` § Status da integração com o backend](./CLAUDE.md#status-da-integração-com-o-backend). Mapeamento completo de endpoints em [`docs/backend-api.md`](./docs/backend-api.md).

---

## Autenticação

Duas sessões **independentes**, cada uma server-side first com seu próprio cookie httpOnly, cliente Axios e Context. Detalhes completos em [`CLAUDE.md` § Autenticação & Middleware](./CLAUDE.md).

**Staff** (funcionário/OWNER) — cookie `access_token`, emitido em `POST /auth/login`:

- `apiClient` (`src/services/api/client.ts`) envia o cookie automaticamente (`withCredentials: true`), tenta refresh automático num 401 e redireciona para `/sign-in` se falhar.
- `src/proxy.ts` (convenção do Next 16, antes chamada `middleware.ts`) decide redirects antes do React montar: `/` → `/dashboard` ou `/sign-in`; rota de auth com sessão ativa → `/dashboard`; rota protegida sem sessão → `/sign-in?redirect=<rota>`.

**Portal do cliente** (`/portal`) — cookie `customer_access_token`, magic link sem senha, sem refresh:

- `customerApiClient` (`src/services/api/customerClient.ts`) é uma instância Axios separada, sem retry/redirect automático.
- `proxy.ts` não faz gating de sessão nessas rotas — a prova de sessão válida é a chamada a `GET /customer-auth/me/orders` funcionar ou devolver 401.

**Token NUNCA toca o JavaScript do client**, em nenhuma das duas sessões. Não use `localStorage`, `sessionStorage` ou cookies não-httpOnly.

---

## CI

GitHub Actions roda em todo Pull Request contra `main` (`.github/workflows/ci.yml`):

1. `bun install --frozen-lockfile`
2. `bun run lint`
3. `bun run format:check`
4. `bun run typecheck`
5. `bun run build`

Caches: `~/.bun/install/cache` e `.next/cache` (chaveados por `bun.lock` + fontes).

Pre-commit: Husky + lint-staged rodam ESLint --fix e Prettier nos arquivos staged.

---

## Convenções (resumo)

> A versão completa, com regras de complexidade, design system e padrões de pasta, vive em [`CLAUDE.md`](./CLAUDE.md).

- **Sem `useEffect` para data fetching nem redirect.** TanStack Query para reads/writes; middleware para redirects de auth.
- **Toda chamada HTTP passa por `services/`.** Componentes nunca tocam Axios.
- **URLs só em `services/api/routes.ts`.** Sem string solta.
- **Server state → TanStack Query. UI state → Context.** Nunca duplique.
- **Componentes em `components/` são puros.** Recebem dados via props ou Context. Páginas e organisms é que orquestram hooks.
- **Dark-only.** Cores via tokens (`bg-surface`, `text-on-surface`, etc.) — proibido hex cru, paletas Tailwind ou `prefers-color-scheme`.
- **Limites ESLint:** complexidade ciclomática ≤ 10, cognitiva ≤ 15, profundidade ≤ 3, ≤ 3 params posicionais, ≤ 80 linhas/função. Não ignore os warnings.
