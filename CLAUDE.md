# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Guia vivo de arquitetura e convenções deste projeto. **Leia antes de codar.**

> ⚠️ **Next.js 16 é recente e difere do seu treinamento.** APIs, convenções e estrutura de arquivos podem ter mudado (ex: `middleware.ts` agora é `src/proxy.ts`). Antes de usar uma API do Next que pareça incerta, confira `node_modules/next/dist/docs/` ou os arquivos reais do projeto em vez de assumir comportamento de versões antigas.

---

## Comandos

```bash
bun install                 # instalar deps
cp .env.example .env.local  # configurar env (ver tabela abaixo)

bun dev                     # dev server — http://localhost:3000
bun run build                # build de produção
bun start                   # sobe o build de produção

bun run lint                 # ESLint
bun run lint:fix             # ESLint com --fix
bun run format                # Prettier --write
bun run format:check          # Prettier --check (usado no CI)
bun run typecheck             # tsc --noEmit
```

Não há suíte de testes configurada neste projeto (sem Jest/Vitest/Playwright, sem scripts de teste no `package.json`). Validação é feita via `lint` + `typecheck` + `build`, que é exatamente o que o CI roda.

**CI** (`.github/workflows/ci.yml`, todo PR contra `main`): `bun install --frozen-lockfile` → `lint` → `format:check` → `typecheck` → `build`. Rode esses quatro comandos localmente antes de abrir PR.

**Variáveis de ambiente** (`src/constants/env.ts` faz a leitura tipada):

| Variável                   | Descrição                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`      | URL base do backend (Axios usa isso + `withCredentials`)           |
| `NEXT_PUBLIC_ENABLE_MOCKS` | `true` liga o MSW em dev (`src/mocks/`) — útil sem backend rodando |

---

## Status da integração com o backend

Checklist de módulos/endpoints do backend (`https://backend-bywc.onrender.com`) já conectados no frontend. Mapeamento completo de rotas em [`docs/backend-api.md`](./docs/backend-api.md).

- [x] **Auth (staff)** — login, logout, forgot/reset password, refresh, clear-sessions
- [x] **Auto-cadastro de funcionário** — `POST /users/register` (`/register`), fica inativo até OWNER aprovar
- [x] **Users** — CRUD completo, `me`, troca de senha
- [x] **Products** — CRUD, upload de foto (S3 presigned URL), restore
- [x] **StockEntries** — listar, criar, estornar (shape `product{}`/`user{}` aninhado, `isReverse`/`reverseOf`)
- [x] **Sales** — listar, criar, cancelar
- [x] **Customers** — CRUD, export, ranking, histórico de compras (`GET /:id/purchases`)
- [x] **Alerts** — listar, contagem, resolver
- [x] **Audit** — log de auditoria com filtros (`user{}` aninhado via Prisma include)
- [x] **Dashboard** — todos os 14 endpoints: summary, top-products, top-clubs, sizes, channels, margins (+ byCategory/byClub), idle-products (`{summary, items}`), payment-methods, stock-velocity, reorder-list, capital-by-club, club-trend (lista flat por clube×mês), customers-by-team, reservation-conversion (`{total, pendingCount, conversionRate, byStatus[]}`)
- [x] **Customer Auth (portal do cliente)** — magic link sem senha, `/portal` → `/minha-conta/entrar` → `/portal/orders`. Sessão isolada (`customer_access_token`, `customerApiClient`, `CustomerAuthContext`) — ver seção Autenticação & Middleware
- [ ] **Public — Chatbot API** (`/public/products`, `/public/reservations`) — **fora de escopo**, consumida só pelo fluxo n8n do chatbot, não integrar no front

⚠️ **Lição da integração**: o OpenAPI/Scalar não documenta response schemas na maioria dos endpoints — só descrições textuais. Um bug sistêmico de paginação (todo endpoint de listagem paginada retorna `{ data: T[], meta: {...} }` **sem** o envelope `{ data: {...} }` do resto da API) só foi encontrado auditando o código-fonte real do backend, não a spec. Ao integrar endpoint novo ou investigar um shape esquisito, **confirme contra `backend/src/modules/<nome>/interface/*.controller.ts` e `use-case/*.use-case.ts`** — o README de cada módulo do backend é útil como contexto rápido, mas pode estar desatualizado em relação ao código (aconteceu em `dashboard/summary`).

---

## Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Linguagem**: TypeScript (strict)
- **Estilo**: Tailwind CSS v4
- **Server state**: TanStack Query v5 (`@tanstack/react-query`)
- **HTTP**: Axios (centralizado em `src/services/api/client.ts`)
- **Forms/validação**: React Hook Form + Zod (`src/lib/validations/`)
- **Toasts**: Sonner
- **Mocks**: MSW — `src/mocks/` (handlers + fixtures por domínio), liga via `NEXT_PUBLIC_ENABLE_MOCKS`
- **Package manager**: Bun
- **Lint/Format**: ESLint (+ sonarjs, jsx-a11y) + Prettier + Husky + lint-staged

---

## Estrutura de pastas

```
src/
├── app/                       # Roteamento Next (App Router)
│   ├── (protected)/           # Rotas autenticadas — proxy.ts assume protegido por padrão
│   │   ├── dashboard/ customers/[id]/ inventory/ entries/
│   │   ├── sales/ insights/ alerts/ audit/ settings/
│   │   └── layout.tsx
│   ├── sign-in/ register/ forgot-password/ reset-password/   # Rotas públicas de auth (staff)
│   ├── minha-conta/entrar/    # Verificação de magic link do portal do cliente
│   ├── portal/ portal/orders/ # Portal do cliente — público, fora do gating de sessão staff
│   ├── layout.tsx             # Root layout — <html class="dark"> fixo, fonts, <Providers>
│   ├── providers.tsx          # QueryClient + Auth + UI + Toaster (client component)
│   └── globals.css            # Design tokens (Tailwind v4 @theme) — ver seção Design System
│
├── components/                # Atomic Design (UI puro, sem fetch)
│   ├── atoms/                 # Button, Input, Label, Badge, Modal, Select, Spinner…
│   ├── molecules/              # FormField, Card, Sidebar, TopBar, StatTile, gráficos (Recharts)…
│   ├── organisms/               # LoginForm, ProductForm, InventoryTable, DashboardKPIs, RequestMagicLinkForm, CustomerOrdersList…
│   └── templates/                # AuthLayout, DashboardLayout
│
├── contexts/                  # AuthContext (staff), CustomerAuthContext (portal, montado só em app/portal/layout.tsx)
│
├── hooks/
│   ├── queries/                # useXxxQuery (TanStack Query reads)
│   └── mutations/               # useXxxMutation (TanStack Query writes)
│
├── services/                  # Única camada que importa axios
│   ├── api/
│   │   ├── client.ts           # Axios instance staff (refresh automático + redirect 401 → /sign-in)
│   │   ├── customerClient.ts   # Axios instance do portal — sem refresh, sem redirect (cookie customer_access_token separado)
│   │   ├── pagination.ts       # fetchPaginated() — todo endpoint de listagem retorna {data, meta} sem envelope extra
│   │   └── routes.ts           # API_ROUTES — todas as URLs do backend
│   └── *.service.ts            # Um arquivo por domínio (products, customers, sales, users, customerAuth…)
│
├── constants/                 # env.ts, routes.ts (APP_ROUTES), queryKeys.ts, auth.ts (nome do cookie)
│
├── types/
│   ├── api/                    # DTOs / responses do backend
│   └── domain/                  # Product, Customer, Sale, StockEntry, User, Alert…
│
├── lib/
│   ├── queryClient.ts          # Config do TanStack Query
│   └── validations/              # Zod schemas por domínio
│
├── mocks/                     # MSW handlers + fixtures/ por domínio (dev sem backend)
│
├── utils/                     # Funções puras (formatadores, validadores)
│
└── proxy.ts                   # Sessão server-side (cookie httpOnly) + redirects — ver seção Auth
```

---

## Regras inegociáveis

### 1. Sem `useEffect` para data fetching nem redirect baseado em estado

- Data fetching: use **sempre** TanStack Query (`useQuery`/`useMutation`).
- Redirect baseado em sessão/auth: **proibido via `useEffect`**. Quem decide isso é o **proxy** (`src/proxy.ts`), server-side, antes do React montar.
- Redirect pós-ação (ex: após `useLoginMutation` sucesso): faça dentro de `onSuccess` da mutation, não em `useEffect` reagindo a state.
- `useEffect` fica restrito a side-effects de UI puros: DOM, event listeners, subscriptions a libs externas (ex: WebSocket, IntersectionObserver).

### 2. Toda chamada HTTP passa pelos `services/`

- Componentes **nunca** chamam `apiClient` ou `axios` diretamente.
- Hooks de query/mutation chamam services, não fazem HTTP cru.
- ESLint bloqueia `import axios` fora de `src/services/api/**`.

### 3. URLs de endpoint só em `services/api/routes.ts`

Nada de string solta no código. Sempre `API_ROUTES.products.byId(id)`.

### 4. Constantes em `constants/`, tipos em `types/`

- Strings repetidas, configs, query keys → `constants/`.
- Interfaces, types, DTOs → `types/`.
- Nunca declare tipo de domínio dentro de um componente.

### 5. Estado de servidor → TanStack Query. Estado UI → Context.

- Dados do backend (produtos, carrinho, usuário): TanStack Query.
- Estado de UI compartilhado (sidebar aberta, modal, tema, sessão): Context.
- Não duplique server state em Context — você vai pagar caro depois.

### 6. Componentes em `components/` são puros

- Não fazem fetch.
- Não conhecem services nem query hooks.
- Recebem dados via props ou consomem Context (sessão/UI).
- Páginas (`app/`) e organisms é que orquestram hooks → componentes.

### 7. Anti prop drilling

- Mais de 2 níveis passando a mesma prop? Vai pra Context (se for UI/sessão) ou hook de query (se for server state).
- Cada Context expõe um hook (`useAuth`, `useUI`) com guard de provider.

### 8. Clean code

- Nomes descritivos (`isLoading`, `handleSubmit`, `useProductsQuery`).
- Sem `any`. Use `unknown` + narrowing quando necessário.
- Funções pequenas, responsabilidade única.
- Prefira composição a herança/abstração prematura.

### 9. Complexidade & conascência (medidos pelo ESLint)

ESLint avisa (warn) quando algum limite estoura. Não ignore os warnings — eles existem pra impedir código que vai virar dor de cabeça em 3 meses.

**Limites duros (verificados automaticamente):**

| Métrica                           | Limite      | Regra                          |
| --------------------------------- | ----------- | ------------------------------ |
| Complexidade ciclomática (função) | ≤ 10        | `complexity`                   |
| Complexidade cognitiva (sonarjs)  | ≤ 15        | `sonarjs/cognitive-complexity` |
| Profundidade de aninhamento       | ≤ 3 níveis  | `max-depth`                    |
| Parâmetros posicionais            | ≤ 3         | `max-params`                   |
| Linhas por função (`.ts`)         | ≤ 80        | `max-lines-per-function`       |
| Linhas por função (`.tsx`)        | ≤ 150       | `max-lines-per-function`       |
| Callbacks aninhados               | ≤ 3 níveis  | `max-nested-callbacks`         |
| String duplicada cross-arquivo    | ≥ 3x → bork | `sonarjs/no-duplicate-string`  |

**Conascência: anti-padrões PROIBIDOS**

A regra geral: quanto mais forte o acoplamento, mais perto os pontos têm que viver. Evite acoplar partes distantes do código.

- **Sem números/strings mágicas** (conascência de significado): nunca `if (status === 2)`. Use enum ou constante nomeada (`STATUS.ACTIVE`).
- **Sem mais de 3 parâmetros posicionais** (conascência de posição): `fn(a, b, c, d)` vira `fn({ a, b, c, d })`. Objetos forçam o chamador a usar nomes.
- **Sem duplicação de literais** (conascência de algoritmo): se a mesma string/número aparece em ≥ 3 lugares, vai pra `constants/`.
- **Sem algoritmo duplicado**: validador de CPF, formatador de data, parser de erro — extrai pra `utils/` e reusa.
- **Sem prop drilling > 2 níveis** (conascência de posição encadeada): vira Context (UI/sessão) ou hook de query (server state).

**Quando estourar um limite:**

1. **Função grande?** Quebrar em sub-funções nomeadas.
2. **Muito `if/else`?** Lookup map (`Record<Status, string>`) ou early return.
3. **Componente com 3+ booleans?** Extrair sub-componente ou consolidar em `state` enum (`"idle" | "loading" | "success" | "error"`).
4. **Hook com 5+ dependências de outros hooks?** Quebrar em hooks menores e compor.

### 10. Acessibilidade — todo elemento interativo é tabulável

Acessibilidade não é opcional. ESLint (`jsx-a11y`) avisa, mas o critério final é: **navegou de ponta a ponta usando apenas Tab, Shift+Tab, Enter, Space e ESC?** Se não, está errado.

**Regras NUNCA:**

- **NUNCA use `<div onClick>`, `<span onClick>` ou similares.** Elemento clicável é `<button>`, `<a>` (com `href`), `<input>`, `<select>`, `<textarea>`. Ponto.
- **NUNCA use `cursor-pointer` em algo que não tem ação real.** O cursor é uma promessa visual — quebrá-la confunde.
- **NUNCA omita `focus-visible:outline-none focus-visible:ring-focus-gold`** em qualquer `<button>`, `<a>`, ou elemento interativo customizado. Sem ring de foco, usuário de teclado fica perdido.
- **NUNCA use `tabIndex` positivo** (`tabIndex={1}`, `tabIndex={5}`). Use só `0` (entra na ordem natural) ou `-1` (foco programático). Ordem deve seguir o DOM.
- **NUNCA esconda foco com `outline-none` sem substituir** por outro indicador visível (ring, border, glow).
- **NUNCA use `autoFocus`** em forms — fere quem usa screen reader e quebra fluxo de leitura. Foco programático só em modais via `useEffect` com `dialog.showModal()` ou `ref.focus()`.

**Regras SEMPRE:**

- **SEMPRE use `<label htmlFor>`** associado a `<input>`/`<select>`/`<textarea>`. O componente `Label` (atom) já faz isso.
- **SEMPRE coloque `aria-label`** em `<button>` que mostra apenas ícone (ver `IconButton`). Texto alternativo é obrigatório.
- **SEMPRE use `aria-pressed`** em toggles/tabs (estado on/off) e `aria-current="page"` em links de navegação ativos (ver `Sidebar`).
- **SEMPRE forneça texto alternativo em `<img>`** ou `alt=""` se decorativo. Em `Avatar` com iniciais, use `role="img"` + `aria-label={nome completo}` e `aria-hidden` nas iniciais.
- **SEMPRE use elementos semânticos:** `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<dialog>`. Eles trazem foco e role grátis.
- **SEMPRE teste navegação com Tab antes de marcar uma feature como pronta.** Inclui: ordem natural, foco visível, ESC fecha modal, Enter envia form.

**Padrão de tokens de foco:**

`focus-visible:outline-none focus-visible:ring-focus-gold` — usa o utility `ring-focus-gold` definido em `globals.css` (4px, primary @ 15% opacity). Já aplicado em `Button`, `IconButton`, `Input`, `Select`. Replicar em qualquer novo elemento focável.

---

## Design System (CSS global) — regras inegociáveis

> Filosofia: **"The Elite Performance Tier"** — dark-first, metálico, sem linhas (DESIGN.md original não está neste repo; as regras abaixo são a fonte da verdade). Toda decisão visual passa por aqui.

### 1. Dark-first SEMPRE

- O app é **dark-only**. `<html>` tem `class="dark"` fixo no `layout.tsx`.
- NUNCA use `prefers-color-scheme` nem crie um toggle light. A paleta inteira é desenhada pra fundo escuro.

### 2. Cores: SÓ via tokens semânticos

- Tokens vivem em `src/app/globals.css` (`--color-*`) e são expostos como utilities Tailwind (`bg-surface`, `text-on-surface`, `border-outline`, etc.).
- NUNCA use hex cru (`#xxx`) no JSX, TSX ou CSS de componente. Sempre token.
- NUNCA use `#000000` puro nem `#ffffff` puro. Se precisa de "preto", é `bg-surface`. Se precisa de "branco", é `text-on-surface`.
- Tailwind palettes (`zinc-*`, `gray-*`, `slate-*`, etc.) estão **proibidas** — não fazem parte do design system.

### 3. No-Line Rule (DESIGN.md §2)

- ZERO `border` ou `divider` pra separar conteúdo. Boundaries são definidos por **shift de surface tier**.
  - Base: `bg-surface`
  - Sectioning: `bg-surface-container-low`
  - Nesting: `bg-surface-container-highest` sobre `bg-surface-container`
- Lista de itens? Alterne `bg-surface-container-low` e `bg-surface-container`. NUNCA `divide-y`.
- Quando precisar **mesmo** de uma borda em input/secondary button, use a utility `border-ghost` (outline-variant @ 15% opacity). Nada mais.

### 4. Tipografia: fonte por papel

Três famílias, cada uma com um papel fixo. Carregadas via `next/font` em `layout.tsx` e expostas como utilities:

| Papel             | Família | Utility         | Uso                         |
| ----------------- | ------- | --------------- | --------------------------- |
| Display, Headline | Lexend  | `font-headline` | h1–h6, stats, page titles   |
| Title, Body       | Manrope | `font-body`     | parágrafos, tabelas, labels |
| Label, Micro-copy | Inter   | `font-label`    | tags, status, uppercase     |

- Headings (`h1`–`h6`) já usam `font-headline` por padrão (definido no `globals.css`).
- NUNCA importe outra fonte do Google Fonts ou CDN. Se precisar de uma nova família, adicione no `layout.tsx` via `next/font` e crie variável `--font-*`.

### 5. CTA primário: gradiente metálico (DESIGN.md §2)

- Botão primary usa `bg-metallic` (utility custom = gradiente 45° de `primary` → `primary-container`). NUNCA flat gold.
- Hover: troca pra `bg-metallic-hover` (gradiente em 225° — simula reflexo de luz).
- Texto sobre gold: `text-on-primary`.

### 6. Glass Rule (DESIGN.md §2)

- Modais, dropdowns, popovers flutuantes: `bg-glass` (utility custom = `surface-bright @ 80% + backdrop-blur 20px`).
- NUNCA use `bg-black/50` ou similares pra simular glass.

### 7. Sombras: ambient glow apenas (DESIGN.md §4)

- `shadow-md`, `shadow-lg`, `shadow-xl` do Tailwind estão **proibidos**. Sombras pesadas matam a estética.
- Se um card precisa flutuar: `shadow-ambient` (glow tonal, blur 32px, 6% opacity).
- Glass elevado: `shadow-glass`.
- Focus em CTA: `ring-focus-gold` (já aplicado via `focus-visible`).

### 8. Sem px cru pra spacing/sizing

- Use a escala do Tailwind (`p-4`, `gap-6`, `h-10`) — ela é em rem por baixo dos panos.
- Quando precisar de valor custom, use rem/em: `p-[1.25rem]`, NUNCA `p-[20px]`.
- Exceção: blur, border de 1px (`border`), e tokens internos do CSS podem ficar em px porque não escalam com fonte mesmo.

### 9. Border radius: tokens

- Use `rounded-default` (2px), `rounded-lg` (4px), `rounded-xl` (8px), `rounded-full` (12px), `rounded-pill` (999px).
- Botões e inputs: `rounded-xl` (8px) por padrão (DESIGN.md §5).

### 10. Ícones

- Use ícones **sólidos e pesados** (Material Symbols Outlined com `FILL=1` ou Phosphor Bold). NUNCA wireframe fino.
- O peso visual dos ícones precisa casar com Lexend (bold, geometric).

---

## Padrões de código

### Como criar um átomo

```
src/components/atoms/Input/
├── Input.tsx
└── index.ts
```

- Componente puro.
- Tipos via `interface XxxProps extends HTMLAttributes<...>`.
- Variantes via maps `Record<Variant, string>` (ver `Button.tsx`).

### Como criar um service

1. Adicionar rotas em `src/services/api/routes.ts`:
   ```ts
   export const API_ROUTES = {
     orders: {
       list: "/orders",
       byId: (id: string) => `/orders/${id}`,
     },
   };
   ```
2. Criar `src/services/orders.service.ts`:

   ```ts
   import { apiClient, API_ROUTES } from "@/services/api";
   import type { Order } from "@/types";

   export const ordersService = {
     list: async (): Promise<Order[]> => {
       const { data } = await apiClient.get<Order[]>(API_ROUTES.orders.list);
       return data;
     },
   };
   ```

3. Reexportar em `src/services/index.ts`.

### Como criar um query hook

1. Adicionar key factory em `src/constants/queryKeys.ts`:
   ```ts
   orders: {
     all: ["orders"] as const,
     list: () => [...queryKeys.orders.all, "list"] as const,
   },
   ```
2. Criar `src/hooks/queries/useOrdersQuery.ts`:

   ```ts
   import { useQuery } from "@tanstack/react-query";
   import { queryKeys } from "@/constants";
   import { ordersService } from "@/services";

   export const useOrdersQuery = () =>
     useQuery({
       queryKey: queryKeys.orders.list(),
       queryFn: ordersService.list,
     });
   ```

3. Reexportar em `src/hooks/queries/index.ts`.

### Como criar uma mutation

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/constants";
import { ordersService } from "@/services";

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersService.create,
    onSuccess: () => {
      toast.success("Pedido criado!");
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
```

Erros HTTP já caem no interceptor do axios e disparam `toast.error` automaticamente.

### Como adicionar um Context

Siga o padrão de `AuthContext.tsx`:

- `createContext<Value | null>(null)`.
- Hook consumidor com guard (`throw` se usado fora do provider).
- `useMemo` no value para evitar re-renders.

---

## Autenticação & Middleware

Auth é **server-side first**. O frontend não toca em token de sessão. Existem **duas sessões independentes**, cada uma com seu próprio cookie, cliente HTTP e Context — nunca misture as duas.

### Sessão de staff (funcionário/OWNER)

1. **Backend** emite um cookie `access_token` no `POST /auth/login`. O cookie é **httpOnly + Secure + SameSite=Lax** — JavaScript do client **não consegue ler**. Logout limpa o cookie via `POST /auth/logout`. Tem refresh (`POST /auth/refresh`).
2. **`apiClient`** (`src/services/api/client.ts`) usa `withCredentials: true`, tenta refresh automático num 401 e redireciona para `/sign-in` se o refresh falhar.
3. **`src/proxy.ts`** (Next.js — convenção do Next 16, antes chamada `middleware.ts`) roda em todas as rotas server-side, antes do React montar:
   - `/` → redireciona para `/dashboard` (com sessão) ou `/sign-in` (sem sessão).
   - Rota de auth staff (`/sign-in`, `/register`, `/forgot-password`, `/reset-password`) com sessão ativa → redireciona para `/dashboard`.
   - Rota protegida sem sessão → redireciona para `/sign-in?redirect=<rota-original>`.
   - Rotas do portal (`/portal/*`, `/minha-conta/entrar`) **não entram nesse gating em nenhuma direção** — ver seção abaixo.
4. **`useLoginMutation`** lê `?redirect=` e devolve o usuário para a rota tentada após login.
5. **Interceptor 401** em `apiClient` redireciona para `/sign-in` quando o backend invalida a sessão (cookie expirado).

### Sessão do portal do cliente (magic link, sem senha)

Pensada para o cliente final ver as próprias compras/reservas — **não é staff**, tem cookie e fluxo próprios:

1. Cliente pede link em `/portal` → `POST /customer-auth/magic-link { email }` (sempre responde sucesso, nunca revela se o email existe).
2. Clica no link do e-mail, que aponta para `/minha-conta/entrar?token=...` (path **fixo no backend**, não configurável via env — não renomeie essa rota sem checar `request-magic-link.use-case.ts` no backend).
3. `VerifyMagicLinkForm` dispara `POST /customer-auth/verify { token }` automaticamente no mount → backend seta cookie `customer_access_token` (httpOnly, 7 dias, **sem refresh** — não existe endpoint de renovação).
4. `GET /customer-auth/me/orders` lista compras (`Sale`) e reservas (`CustomerReservation`) do cliente autenticado.
5. **`customerApiClient`** (`src/services/api/customerClient.ts`) é uma instância axios separada — sem retry de refresh, sem redirect automático em 401 (quem decide o que fazer é o componente, ex: mostrar "sessão expirada, peça um novo link").
6. **`CustomerAuthContext`** (`src/contexts/CustomerAuthContext.tsx`) guarda a identidade do cliente via `queryClient.setQueryData`, análogo ao padrão já usado em `useLoginMutation` para o staff — mas é montado **só** em `src/app/portal/layout.tsx`, nunca em `providers.tsx` global.
7. `proxy.ts` não faz nenhum gating de sessão do portal — a prova de sessão válida é a própria chamada a `me/orders` funcionar ou devolver 401, checada client-side.

### Regras

- **NUNCA** armazene token em `localStorage`, `sessionStorage` ou cookie não-httpOnly. O backend é o dono da sessão.
- **NUNCA** faça redirect de auth via `useEffect`. O middleware já cuidou disso server-side.
- **NUNCA** crie uma rota protegida (staff) fora de `(protected)/`. O proxy presume que tudo que NÃO é auth-route nem rota do portal é protegido.
- **NUNCA** misture `apiClient` (staff) com `customerApiClient` (portal), nem `AuthContext` com `CustomerAuthContext`. São sessões, cookies e políticas de erro diferentes.
- Para nova rota pública de staff (ex: `/about`), adicione exceção explícita no `proxy.ts`. Para nova rota do portal, use o prefixo `/portal/*` (já coberto pelo carve-out) ou adicione a rota específica em `isPortalRoute`.
- Nome do cookie vive em `SESSION_COOKIE_NAME` (`src/constants/auth.ts`). Sincronize com o backend.

---

## Como rodar

```bash
# instalar deps
bun install

# copiar env
cp .env.example .env.local
# preencha NEXT_PUBLIC_API_URL quando o backend estiver pronto

# desenvolvimento
bun dev          # http://localhost:3000

# qualidade
bun run lint
bun run typecheck
bun run format

# build
bun run build
bun start
```

---

## Integração do HTML do Stitch

Quando o HTML do Stitch chegar:

1. Decomponha em **átomos primeiro** (botões, inputs, ícones, badges).
2. Suba para moléculas (form fields, cards, search bars).
3. Compose em organisms (header, footer, product grid).
4. Templates definem layout das páginas; pages orquestram dados.
5. Tokens visuais (cores, fontes, spacing) → `src/app/globals.css` via `@theme`.

Não jogue HTML inteiro num componente — quebre por responsabilidade.
