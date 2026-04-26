export const APP_ROUTES = {
  home: "/",
  products: {
    list: "/products",
    detail: (slug: string) => `/products/${slug}`,
  },
  cart: "/cart",
  checkout: "/checkout",
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
} as const;
