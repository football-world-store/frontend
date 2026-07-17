import type { CustomerOrder } from "@/types";

const CUSTOMER_PORTAL_NAME = "Lucas Andrade";

export const customerIdentityFixture = {
  id: "cust-portal-001",
  name: CUSTOMER_PORTAL_NAME,
  email: "lucas@example.com",
};

export const customerOrdersFixture: CustomerOrder[] = [
  {
    kind: "sale",
    id: "s-001",
    saleNumber: 1001,
    channel: "LOJA_FISICA",
    paymentMethod: "PIX",
    status: "CONFIRMED",
    customerId: "cust-portal-001",
    customerName: CUSTOMER_PORTAL_NAME,
    discount: 0,
    totalAmount: 459.0,
    saleDate: "2026-04-25T14:30:00.000Z",
    createdAt: "2026-04-25T14:30:00.000Z",
    cancelledAt: null,
    cancelReason: null,
    userId: "u-001",
    items: [],
  },
  {
    kind: "reservation",
    id: "r-001",
    productId: "p-002",
    productName: "Camisa Corinthians Home 2026",
    quantity: 1,
    customerName: CUSTOMER_PORTAL_NAME,
    customerWhatsapp: "5511999991111",
    customerEmail: "lucas@example.com",
    notes: null,
    status: "CONFIRMADA",
    createdAt: "2026-05-01T10:00:00.000Z",
  },
];
