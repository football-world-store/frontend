# Design System — Football World Store

Filosofia: **"The Elite Performance Tier"** — dark-first, metálico, sem linhas.

## Paleta de cores (Material 3)

Todos os tokens vivem em `src/app/globals.css` e são expostos como utilities Tailwind.

### Superfícies (do mais profundo ao mais claro)

| Token | Hex | Uso |
|-------|-----|-----|
| `bg-surface` | #131313 | Background base |
| `bg-surface-container-lowest` | #0e0e0e | Inputs, campos |
| `bg-surface-container-low` | #1c1b1b | Sidebar, linhas pares |
| `bg-surface-container` | #201f1f | Cards base, linhas ímpares |
| `bg-surface-container-high` | #2a2a2a | Cards elevados |
| `bg-surface-container-highest` | #353534 | Cards destaque, badges |
| `bg-surface-bright` | #393939 | Hover states |

### Primary (gold metálico)

| Token | Hex | Uso |
|-------|-----|-----|
| `text-primary` / `bg-primary` | #f2ca50 | CTA, destaques, links ativos |
| `bg-primary-container` | #d4af37 | Gradiente metálico (fim) |
| `text-on-primary` | #3c2f00 | Texto sobre gold |

### Texto

| Token | Uso |
|-------|-----|
| `text-on-surface` | Texto principal (#e5e2e1) |
| `text-on-surface-variant` | Texto secundário, labels (#d0c5af) |

### Semânticas

| Token | Uso |
|-------|-----|
| `text-error` / `bg-error` | Erros, alertas críticos |
| `text-tertiary` / `bg-tertiary` | Acentos azul gélido |

## Regras visuais

### No-Line Rule
- ZERO `border` ou `divider` pra separar conteúdo
- Boundaries são definidos por shift de surface tier
- Listas: alternar `bg-surface-container-low` e `bg-surface-container`
- Exceção: `border-ghost` (outline-variant @ 15% opacity) em inputs/secondary buttons

### CTA primário
- Gradiente metálico: `bg-metallic` (45° primary → primary-container)
- Hover: `bg-metallic-hover` (225° — simula reflexo de luz)
- Texto: `text-on-primary`

### Glass Rule
- Modais/popovers: `bg-glass` (surface-bright @ 80% + backdrop-blur 20px)
- Sombra: `shadow-glass`

### Sombras
- Cards: `shadow-ambient` (glow tonal, blur 32px, 6% opacity)
- Glass: `shadow-glass`
- Focus: `ring-focus-gold`
- Tailwind `shadow-md/lg/xl` estão PROIBIDOS

## Tipografia

Três famílias, cada uma com papel fixo:

| Papel | Família | Utility | Uso |
|-------|---------|---------|-----|
| Display, Headline | Lexend | `font-headline` | h1–h6, stats, títulos |
| Title, Body | Manrope | `font-body` | parágrafos, tabelas |
| Label, Micro-copy | Inter | `font-label` | tags, status, uppercase |

## Border radius

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-default` | 2px | Micro elementos |
| `rounded-lg` | 4px | Chips, tags |
| `rounded-xl` | 8px | Buttons, inputs, cards |
| `rounded-full` | 12px | Containers grandes |
| `rounded-pill` | 9999px | Pílulas, tabs |

## Ícones

- Material Symbols Outlined com `FILL=1, wght=600`
- Componente: `<Icon name="..." size="sm|md|lg" filled />`
- Ícones sólidos e pesados — nunca wireframe fino

## Utilities customizadas

```css
bg-metallic          /* Gradiente gold metálico */
bg-metallic-hover    /* Gradiente invertido (hover) */
bg-glass             /* Surface-bright @ 80% + blur */
shadow-ambient       /* Glow tonal suave */
shadow-glass         /* Sombra de glass elevado */
ring-focus-gold      /* Ring de foco acessível */
border-ghost         /* Borda sutil (outline-variant @ 15%) */
```
