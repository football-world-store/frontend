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
