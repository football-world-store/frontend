import type { Sale } from "@/types";

export const salesFixture: Sale[] = [
  {
    id: "s-001",
    channel: "LOJA_FISICA",
    paymentMethod: "PIX",
    status: "CONFIRMED",
    customerId: "c-001",
    customerName: "Lucas Andrade",
    totalAmount: 459.0,
    soldAt: "2026-04-25T14:30:00.000Z",
    soldBy: "Edimilson",
    items: [
      {
        productId: "p-002",
        productName: "Camisa Flamengo Retrô 1981",
        quantity: 1,
        unitPrice: 459.0,
      },
    ],
  },
  {
    id: "s-002",
    channel: "WHATSAPP",
    paymentMethod: "CREDITO",
    status: "CONFIRMED",
    customerId: "c-002",
    customerName: "Carolina Mendes",
    totalAmount: 489.7,
    soldAt: "2026-04-26T10:00:00.000Z",
    soldBy: "Edimilson",
    items: [
      {
        productId: "p-001",
        productName: "Camisa Brasil 2026 — Home",
        quantity: 1,
        unitPrice: 349.9,
      },
      {
        productId: "p-004",
        productName: "Meião Corinthians Listrado",
        quantity: 2,
        unitPrice: 59.9,
      },
    ],
  },
];
