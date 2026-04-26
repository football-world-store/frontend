import type { Alert } from "@/types";

export const alertsFixture: Alert[] = [
  {
    id: "a-001",
    type: "STOCK_LOW",
    severity: "CRITICAL",
    productId: "p-002",
    productName: "Camisa Flamengo Retrô 1981",
    message: "Estoque abaixo do mínimo (3 unidades, mínimo 4).",
    createdAt: "2026-04-26T08:00:00.000Z",
    acknowledgedAt: null,
  },
  {
    id: "a-002",
    type: "STOCK_OUT",
    severity: "CRITICAL",
    productId: "p-003",
    productName: "Short Palmeiras Treino",
    message: "Estoque zerado.",
    createdAt: "2026-04-26T08:30:00.000Z",
    acknowledgedAt: null,
  },
  {
    id: "a-003",
    type: "PRODUCT_IDLE",
    severity: "INFORMATIONAL",
    productId: "p-003",
    productName: "Short Palmeiras Treino",
    message: "Produto sem vendas há mais de 30 dias.",
    createdAt: "2026-04-26T08:45:00.000Z",
    acknowledgedAt: null,
  },
];
