export const formatCurrencyBRL = (priceInCents: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);
};

export const formatDateBR = (value: string | Date): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR").format(date);
};
