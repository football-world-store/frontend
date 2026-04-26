export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
