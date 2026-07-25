const CENTS_PER_REAL = 100;

const currencyBRLFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateBRFormatter = new Intl.DateTimeFormat("pt-BR");

export const formatCurrencyBRL = (priceInCents: number): string =>
  currencyBRLFormatter.format(priceInCents / CENTS_PER_REAL);

export const formatPriceFromReais = (priceInReais: number): string =>
  currencyBRLFormatter.format(priceInReais);

export const formatDateBR = (value: string | Date): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateBRFormatter.format(date);
};

const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 3600;
const DAY_IN_SECONDS = 86400;

export const formatRelativeTimeBR = (value: string | Date): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffSeconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000),
  );

  if (diffSeconds < MINUTE_IN_SECONDS) return "agora mesmo";
  if (diffSeconds < HOUR_IN_SECONDS) {
    return `${Math.floor(diffSeconds / MINUTE_IN_SECONDS)}min atrás`;
  }
  if (diffSeconds < DAY_IN_SECONDS) {
    return `${Math.floor(diffSeconds / HOUR_IN_SECONDS)}h atrás`;
  }
  return `${Math.floor(diffSeconds / DAY_IN_SECONDS)}d atrás`;
};

const ZEBRA_TIERS = [
  "bg-surface-container-low",
  "bg-surface-container",
] as const;

export const zebraRowTier = (index: number): string =>
  ZEBRA_TIERS[index % ZEBRA_TIERS.length];
