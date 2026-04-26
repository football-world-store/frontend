# Football World Store — Frontend

Aplicação web da Football World Store, construída com Next.js 16, TypeScript, Tailwind v4, TanStack Query, Axios e Sonner.

> Para arquitetura, convenções e padrões de código, leia [`CLAUDE.md`](./CLAUDE.md).

## Pré-requisitos

- [Bun](https://bun.sh) >= 1.3
- Node.js 20+ (apenas para utilitários, runtime principal é Bun)

## Setup

```bash
bun install
cp .env.example .env.local
# preencha NEXT_PUBLIC_API_URL quando o backend estiver disponível
bun dev
```

A aplicação sobe em [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando                | Função                      |
| ---------------------- | --------------------------- |
| `bun dev`              | Servidor de desenvolvimento |
| `bun run build`        | Build de produção           |
| `bun start`            | Sobe build de produção      |
| `bun run lint`         | Lint com ESLint             |
| `bun run lint:fix`     | Lint com auto-fix           |
| `bun run format`       | Formatar com Prettier       |
| `bun run format:check` | Checar formatação           |
| `bun run typecheck`    | Type-check (`tsc --noEmit`) |

## Estrutura

```
src/
├── app/          # App Router
├── components/   # Atomic Design (atoms, molecules, organisms, templates)
├── contexts/     # Auth, UI (anti prop drilling)
├── hooks/        # queries/, mutations/
├── services/     # api/client, api/routes, *.service.ts
├── constants/    # env, routes, queryKeys
├── types/        # api/, domain/
├── utils/        # formatters, validators
└── lib/          # queryClient
```

Detalhes em [`CLAUDE.md`](./CLAUDE.md).

## Variáveis de ambiente

| Variável              | Descrição                                         |
| --------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base do backend (ex: `http://localhost:3001`) |
