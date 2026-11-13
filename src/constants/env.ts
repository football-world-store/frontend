export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  ACAI_URL:
    process.env.NEXT_PUBLIC_ACAI_URL ??
    "https://acai-da-toca.github.io/cardapio/",
  WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5577997011339",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
