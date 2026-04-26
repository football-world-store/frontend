# Arquitetura — Football World Store Frontend

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 16.2.4 |
| Linguagem | TypeScript (strict) | 5.x |
| Estilo | Tailwind CSS | 4.x |
| Server state | TanStack React Query | 5.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| HTTP | Axios (centralizado) | 1.x |
| Toasts | Sonner | 2.x |
| Gráficos | Recharts | 3.x |
| Mocks | MSW | 2.x |
| Package manager | Bun | latest |
| Lint | ESLint + SonarJS + Prettier | 9.x |

## Estrutura de pastas

```
src/
├── app/                    # Next.js App Router (páginas)
│   ├── (protected)/        # Rotas protegidas por sessão
│   ├── sign-in/            # Autenticação
│   ├── forgot-password/    # Recuperação de senha
│   ├── reset-password/     # Reset de senha
│   ├── layout.tsx          # Root layout (fonts, providers)
│   ├── providers.tsx       # QueryClient + Auth + UI + Toaster
│   └── globals.css         # Design tokens + Tailwind bridge
│
├── components/             # Atomic Design
│   ├── atoms/              # Primitivos: Button, Input, Icon, Badge...
│   ├── molecules/          # Composições: Card, FormField, StatTile...
│   ├── organisms/          # Lógica de negócio: LoginForm, InventoryTable...
│   └── templates/          # Layouts de página: DashboardLayout, AuthLayout...
│
├── contexts/               # React Contexts (estado UI/sessão)
│   ├── AuthContext.tsx      # useAuth() — usuário, isAuthenticated, signOut
│   └── UIContext.tsx        # useUI() — sidebar open/close
│
├── hooks/                  # Custom hooks
│   ├── queries/            # useXxxQuery (leituras via React Query)
│   ├── mutations/          # useXxxMutation (escritas via React Query)
│   └── useInventoryFilters.ts  # Hook de filtros do inventário
│
├── services/               # Camada de API
│   ├── api/
│   │   ├── config.ts       # API_PREFIX, API_BASE_URL, timeout, headers
│   │   ├── client.ts       # Axios instance + interceptors (401, toast)
│   │   └── routes.ts       # API_ROUTES (endpoints do backend)
│   └── *.service.ts        # Um service por domínio
│
├── constants/              # Constantes globais
│   ├── env.ts              # Variáveis de ambiente tipadas
│   ├── routes.ts           # APP_ROUTES (paths do frontend)
│   ├── queryKeys.ts        # Factory de chaves do React Query
│   ├── formatting.ts       # PRICE_CENTS_MULTIPLIER, VIP_THRESHOLD...
│   └── auth.ts             # SESSION_COOKIE_NAME
│
├── types/                  # TypeScript types
│   ├── api/                # DTOs, responses, auth types
│   └── domain/             # Entidades de negócio (Product, Customer...)
│
├── lib/                    # Wrappers de libs externas
│   ├── validations/        # Schemas Zod (auth, product, customer...)
│   └── queryClient.ts      # Config do QueryClient
│
├── utils/                  # Funções puras (formatters, validators)
├── mocks/                  # MSW handlers + fixtures
└── proxy.ts                # Middleware server-side (Next 16)
```

## Fluxo de dados

```
Page (app/)
  └── busca dados via hooks (useXxxQuery, useAuth)
        └── delega pro Template (components/templates/)
              └── compõe Organisms (components/organisms/)
                    └── usa Molecules (components/molecules/)
                          └── renderiza Atoms (components/atoms/)
```

### Regras do fluxo

1. **Pages** são magras — só buscam dados e passam pro template
2. **Templates** compõem layout + organisms + molecules
3. **Organisms** podem ter lógica de negócio e state local
4. **Molecules** combinam atoms, sem lógica de negócio
5. **Atoms** são primitivos puros, sem fetch, sem lógica

## Autenticação

Auth é server-side first:

1. Backend emite cookie `access_token` (httpOnly + Secure + SameSite=Lax)
2. `apiClient` usa `withCredentials: true` — browser anexa cookie automaticamente
3. `proxy.ts` roda server-side antes do React montar — redireciona conforme sessão
4. `AuthContext` hidrata dados do usuário via `GET /auth/me`
5. Interceptor 401 no axios redireciona pra `/sign-in` quando sessão expira

## API Client

```
.env                    → NEXT_PUBLIC_API_URL=http://localhost:3333
services/api/config.ts  → API_PREFIX="/api/v1", API_BASE_URL=env+prefix
services/api/client.ts  → axios.create({ baseURL: API_BASE_URL })
services/api/routes.ts  → API_ROUTES.products.list = "/products"
```

URL final: `http://localhost:3333/api/v1/products`

Trocar pra produção: só mudar a env. O prefixo é centralizado no código.
