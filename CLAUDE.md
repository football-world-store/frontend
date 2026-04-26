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

> Filosofia: **"The Elite Performance Tier"** (ver `front_stitch/golden_strike/DESIGN.md`). Dark-first, metálico, sem linhas. Toda decisão visual passa por aqui.

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

Auth é **server-side first**. O frontend não toca em token de sessão.

### Como funciona

1. **Backend** emite um cookie `access_token` no `POST /auth/login`. O cookie é **httpOnly + Secure + SameSite=Lax** — JavaScript do client **não consegue ler**. Logout limpa o cookie via `POST /auth/logout`.
2. **`apiClient`** (axios) usa `withCredentials: true` — o navegador anexa o cookie em toda request automaticamente.
3. **`src/proxy.ts`** (Next.js — convenção do Next 16, antes chamada `middleware.ts`) roda em todas as rotas server-side, antes do React montar:
   - `/` → redireciona para `/dashboard` (com sessão) ou `/sign-in` (sem sessão).
   - Rota de auth (`/sign-in`, `/forgot-password`, `/reset-password`) com sessão ativa → redireciona para `/dashboard`.
   - Rota protegida sem sessão → redireciona para `/sign-in?redirect=<rota-original>`.
4. **`useLoginMutation`** lê `?redirect=` e devolve o usuário para a rota tentada após login.
5. **Interceptor 401** em `apiClient` redireciona para `/sign-in` quando o backend invalida a sessão (cookie expirado).

### Regras

- **NUNCA** armazene token em `localStorage`, `sessionStorage` ou cookie não-httpOnly. O backend é o dono da sessão.
- **NUNCA** faça redirect de auth via `useEffect`. O middleware já cuidou disso server-side.
- **NUNCA** crie uma rota protegida fora de `(protected)/`. O proxy presume que tudo que NÃO é auth-route é protegido.
- Para nova rota pública (ex: `/about`), adicione exceção explícita no `proxy.ts`.
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
