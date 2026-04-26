# Convenções — Football World Store Frontend

## Idioma

- Interface: **PT-BR** (labels, botões, mensagens, placeholders)
- Código: **EN** (variáveis, funções, tipos, componentes)
- Commits: formato `<emoji> <type>(<scope>): <message>` em PT-BR ou EN

## Nomenclatura

### Componentes

- PascalCase: `Button`, `FormField`, `InventoryTable`
- Pasta própria com barrel: `Button/Button.tsx` + `Button/index.ts`

### Hooks

- camelCase com prefixo `use`: `useAuth`, `useProductsQuery`
- Queries: `useXxxQuery` (ex: `useProductsQuery`)
- Mutations: `useXxxMutation` (ex: `useCreateProductMutation`)

### Services

- camelCase com sufixo `.service`: `products.service.ts`
- Objeto exportado: `productsService.list()`, `productsService.create()`

### Types

- PascalCase: `Product`, `CustomerStatus`, `SaleChannel`
- Interfaces para objetos, types para unions/primitivos
- Domínio em `types/domain/`, API em `types/api/`

### Constants

- UPPER_SNAKE_CASE: `PRICE_CENTS_MULTIPLIER`, `VIP_THRESHOLD`
- Query keys: factory pattern em `queryKeys.ts`

## Padrões de código

### Componentes

```tsx
// Variantes via Record (nunca if/else chain)
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-metallic text-on-primary...",
  secondary: "bg-surface-container-highest...",
};

// forwardRef para atoms que precisam de ref
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", ...rest }, ref) => { ... }
);
Button.displayName = "Button";
```

### Queries

```tsx
// Hook magro — service faz o trabalho
export const useProductsQuery = () =>
  useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: productsService.list,
  });
```

### Mutations

```tsx
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      toast.success("Produto cadastrado!");
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
```

### Pages (Atomic Design)

```tsx
// Page é MAGRA — só busca dados e delega pro template
const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useDashboardStatsQuery();
  return <DashboardHome greeting={...} stats={data} isLoading={isLoading} />;
};
```

## Limites de complexidade (ESLint)

| Métrica                     | Limite      | Regra                          |
| --------------------------- | ----------- | ------------------------------ |
| Complexidade ciclomática    | ≤ 10        | `complexity`                   |
| Complexidade cognitiva      | ≤ 15        | `sonarjs/cognitive-complexity` |
| Profundidade de aninhamento | ≤ 3         | `max-depth`                    |
| Parâmetros posicionais      | ≤ 3         | `max-params`                   |
| Linhas por função (.ts)     | ≤ 80        | `max-lines-per-function`       |
| Linhas por função (.tsx)    | ≤ 150       | `max-lines-per-function`       |
| Callbacks aninhados         | ≤ 3         | `max-nested-callbacks`         |
| String duplicada            | ≥ 3x → warn | `sonarjs/no-duplicate-string`  |

## Cores em contextos sem suporte a CSS vars

Recharts (`stroke`, `fill`) e SVG data URIs não aceitam `var(--color-*)`. Nesses casos use as constantes de `src/constants/chartTokens.ts`:

```ts
import {
  CHART_AXIS_COLOR, // --color-on-surface-variant (#d0c5af)
  CHART_GRID_COLOR, // on-surface-variant @ 8% opacity
  CHART_SERIES_COLORS, // paleta sequencial (primary → tertiary → …)
  CHART_TOOLTIP_STYLE, // contentStyle pronto para <Tooltip>
  ON_SURFACE_VARIANT_COLOR, // hex nu — para SVG data URIs
} from "@/constants";
```

Nunca declare hex cru em componente. Se um novo valor for necessário, adicione em `chartTokens.ts` com comentário apontando para o token CSS de origem.

## Proibições

- ❌ Hex cru no JSX/TSX — sempre token (`bg-surface`, `text-primary`) ou constante de `chartTokens.ts`
- ❌ `import axios` fora de `services/api/` — ESLint bloqueia
- ❌ `useEffect` para data fetching — usar React Query
- ❌ `useEffect` para redirect — usar proxy.ts (server-side)
- ❌ `any` — usar `unknown` + narrowing
- ❌ `<div onClick>` — usar `<button>` ou `<a>`
- ❌ `shadow-md/lg/xl` do Tailwind — usar `shadow-ambient`
- ❌ Palettes do Tailwind (`zinc-*`, `gray-*`) — usar tokens do design system
- ❌ `localStorage`/`sessionStorage` para tokens — auth é via cookie httpOnly
- ❌ Prop drilling > 2 níveis — usar Context ou hook

## Como rodar

```bash
bun install          # Instalar dependências
bun dev              # Dev server (localhost:3000)
bun run lint         # Lint
bun run typecheck    # Type check
bun run format       # Formatar
bun run build        # Build de produção
```
