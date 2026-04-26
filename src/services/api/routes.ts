export const API_ROUTES = {
  products: {
    list: "/products",
    byId: (id: string) => `/products/${id}`,
  },
  cart: {
    current: "/cart",
    addItem: "/cart/items",
    removeItem: (itemId: string) => `/cart/items/${itemId}`,
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    me: "/auth/me",
  },
} as const;
