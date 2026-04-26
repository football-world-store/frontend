# CLAUDE.md — Football World Store Frontend

Guia vivo de arquitetura e convenções deste projeto. **Leia antes de codar.**

---

## Stack

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript (strict)
- **Estilo**: Tailwind CSS v4
- **Server state**: TanStack Query v5 (`@tanstack/react-query`)
- **HTTP**: Axios (centralizado em `src/services/api/client.ts`)
- **Toasts**: Sonner
- **Package manager**: Bun
- **Lint/Format**: ESLint + Prettier + Husky + lint-staged

---

## Estrutura de pastas

```
src/
├── app/                  # Roteamento Next (App Router)
│   ├── layout.tsx        # Root layout — injeta <Providers>
│   ├── page.tsx          # Home
│   └── providers.tsx     # QueryClient + Auth + UI + Toaster (client component)
│
├── components/           # Atomic Design (UI puro, sem fetch)
│   ├── atoms/            # Button, Input, Label, Badge…
│   ├── molecules/        # FormField, SearchBar, Card…
│   ├── organisms/        # Header, Footer, ProductList…
│   └── templates/        # PageLayout, AuthLayout…
│
├── contexts/             # Estado global de UI/sessão (anti prop drilling)
│   ├── AuthContext.tsx   # useAuth()
│   └── UIContext.tsx     # useUI()
│
├── hooks/                # Custom hooks
│   ├── queries/          # useXxxQuery (TanStack Query reads)
│   └── mutations/        # useXxxMutation (TanStack Query writes)
│
├── services/             # Camada de API
│   ├── api/
│   │   ├── client.ts     # Axios instance + interceptors
│   │   └── routes.ts     # API_ROUTES (todas as URLs do backend)
│   └── *.service.ts      # Um arquivo por domínio (ex: products.service.ts)
│
├── constants/            # Constantes globais
│   ├── env.ts            # Leitura tipada de env vars
│   ├── routes.ts         # APP_ROUTES (paths frontend)
│   └── queryKeys.ts      # Factories de chaves do TanStack Query
│
├── types/                # Tipos e interfaces
│   ├── api/              # DTOs / responses do backend
│   └── domain/           # Entidades de negócio
│
├── utils/                # Funções puras (formatadores, validadores)
│
└── lib/                  # Wrappers de libs externas
    └── queryClient.ts    # Config do QueryClient
```

---

## Regras inegociáveis

### 1. Sem `useEffect` para data fetching

Use **sempre** TanStack Query (`useQuery`/`useMutation`). `useEffect` fica restrito a side-effects de UI (DOM, event listeners, subscriptions externas).

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
