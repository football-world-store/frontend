// Hex resolvidos de tokens do design system para contextos onde CSS vars não funcionam
// (Recharts stroke/fill, SVG data URIs). Se a paleta mudar em globals.css, atualize aqui.

/** --color-on-surface-variant (#d0c5af). Reutilizado em charts e SVG data URIs. */
export const ON_SURFACE_VARIANT_COLOR = "#d0c5af";

/** Cores da paleta primária para séries de dados. */
export const CHART_PALETTE = {
  primary: "#f2ca50", // --color-primary
  primaryContainer: "#d4af37", // --color-primary-container
  primaryFixedDim: "#e9c349", // --color-primary-fixed-dim
  tertiary: "#bfcdff", // --color-tertiary
  tertiaryContainer: "#97b0ff", // --color-tertiary-container
} as const;

/** Sequência de cores para gráficos com múltiplas séries (donut, bar). */
export const CHART_SERIES_COLORS = [
  CHART_PALETTE.primary,
  CHART_PALETTE.primaryContainer,
  CHART_PALETTE.tertiary,
  CHART_PALETTE.tertiaryContainer,
  CHART_PALETTE.primaryFixedDim,
] as const;

/** Cor do texto dos eixos (on-surface-variant). */
export const CHART_AXIS_COLOR = ON_SURFACE_VARIANT_COLOR;

/** Cor da grid (on-surface-variant @ 8% opacity). */
export const CHART_GRID_COLOR = "rgba(208, 197, 175, 0.08)";

/** Estilo do tooltip (usa tokens de superfície). */
export const CHART_TOOLTIP_STYLE = {
  background: "var(--color-surface-bright)",
  border: "none",
  borderRadius: 8,
  color: "var(--color-on-surface)",
} as const;
